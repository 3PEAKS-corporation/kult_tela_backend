const bcrypt = require('bcrypt')
const { utils, db, token: _token, kassa } = require('../../../services')
const { User } = require('../../../utils/')
const { copyDATA } = require('../../../data/')

const SALT_ROUNDS = 10

async function isHashAndPaymentDone(hash) {
  let query = `SELECT signup_info.id, signup_info.user_id, signup_info.used, signup_info.hash, payments.id as p_id, payments.status as p_status, payments.key as p_key
               FROM signup_info
                        LEFT JOIN payments
                                  ON signup_info.payment_id::int = payments.id AND payments.type='PLAN_BUY'
               WHERE signup_info.hash=$1`
  let values = [hash]
  try {
    let { rows } = await db.query(query, values)
    const info = rows[0]
    if (info && info.used === false) {
      if (info.p_status === 'succeeded')
        return { success: true, status: 'succeeded', user_id: info.user_id }

      let kassaPayment = await kassa.getPaymentStatus(info.p_key)
      if (info.p_status !== kassaPayment.status)
        await User.Payment.setStatus(kassaPayment.status, { id: info.p_id })
      if (kassaPayment.status === 'succeeded')
        return { success: true, status: 'succeeded', user_id: info.user_id }
      if (kassaPayment.status === 'pending')
        return {
          success: false,
          status: 'pending',
          url: kassaPayment.confirmation.confirmation_url
        }
      else if (kassaPayment.status === 'canceled')
        return { success: false, status: 'canceled' }
    } else return false
  } catch (e) {
    return false
  }
}

const SignUp = {
  async createBlankProfile(req, res) {
    const { email, plan_id } = req.body
    if (!email || plan_id === undefined) return utils.response.error(res)

    let query = `INSERT INTO users(email, plan_id) VALUES($1, $2) RETURNING id, email`
    let values = [email, plan_id]

    const plans = copyDATA('plans')
    const plan = plans.filter(e => parseInt(e.id) === parseInt(plan_id))[0]

    try {
      const { rows: user } = await db.query(query, values)
      if (user[0]) {
        const { id: user_id, email } = user[0]
        const hash = _token.generateToken({
          id: user_id + '_PAYMENT',
          email: email
        })

        const kassaPayment = await kassa.createPayment({
          value: plan.cost,
          description: `Оплата пакета "${plan.name} в приложении Культ Тела"`,
          return_url: 'first-login/' + hash,
          metadata: {
            type: 'PLAN_BUY',
            hash: hash
          }
        })

        if (!kassaPayment)
          return utils.response.error(res, 'Ошибка при создании платежа')

        console.log('kassa: ', kassaPayment)

        const dbpayment = await User.Payment.create(
          user_id,
          kassaPayment.id,
          'PLAN_BUY',
          parseInt(plan.cost)
        )

        if (!dbpayment)
          return utils.response.error(res, 'Ошибка при создании платежа')

        query = `INSERT INTO signup_info(user_id, hash, payment_id) VALUES($1,$2,$3) RETURNING TRUE`

        values = [user_id, hash, dbpayment.id]
        const { rows } = await db.query(query, values)

        if (!rows[0].bool)
          return utils.response.error(res, 'Ошибка создания пользователя')
        const payment = {
          reason: 'PLAN_BUY',
          amount: plan.cost,
          key: dbpayment.id
        }

        await User.Email.firstLogin(email, hash)
        return utils.response.success(res, {
          url: kassaPayment.confirmation.confirmation_url
        })
      } else return utils.response.error(res, 'Email уже зарегистрирован')
    } catch (error) {
      console.log(error)
      return utils.response.error(
        res,
        'Пользователь с таким email уже зарегистрирован'
      )
    }
  },
  async isFillAllowed(req, res) {
    const { hash } = req.body

    if (!hash) return utils.response.error(res)

    try {
      let isOk = await isHashAndPaymentDone(hash)

      if (isOk.success === true) {
        let query = `SELECT email FROM users WHERE id=$1`
        let values = [isOk.user_id]
        let { rows } = await db.query(query, values)
        return utils.response.success(res, {
          success: true,
          email: rows[0].email
        })
      } else if (isOk === false)
        return utils.response.error(
          res,
          'Платеж в обработке, или срок действия ссылки истек'
        )
      else return utils.response.success(res, isOk)
    } catch (error) {
      return utils.response.error(
        res,
        'Платеж не обработан или закончен отказом'
      )
    }
  },
  async fillInfo(req, res) {
    const {
      hash,
      first_name,
      last_name,
      patronymic,
      weight_start,
      password,
      height,
      age
    } = req.body
    const avatar_src = req.file

    if (
      !utils.verify([
        hash,
        first_name,
        last_name,
        weight_start,
        password,
        avatar_src,
        height,
        age
      ])
    )
      return utils.response.error(res)

    try {
      let isOk = await isHashAndPaymentDone(hash)
      isOk.user_id = parseInt(isOk.user_id)

      if (isOk.success === true && isOk.status === 'succeeded') {
        const passwordHashed = await bcrypt.hash(password, SALT_ROUNDS)

        let query = `UPDATE users SET password=$1, first_name=$2, last_name=$3, patronymic=$4, weight_start=$5, avatar_src=$6, height=$8, age=$9,
                 date_signup=current_timestamp, subscription_exp = current_timestamp + '31 days' WHERE id=$7 RETURNING TRUE, plan_id`

        let values = [
          passwordHashed,
          first_name,
          last_name,
          patronymic || '',
          weight_start,
          avatar_src.filename,
          isOk.user_id,
          height,
          age
        ]
        const { rows } = await db.query(query, values)
        if (rows[0].bool === true) {
          const plan_id = rows[0].plan_id
          query = `UPDATE signup_info SET used=TRUE WHERE hash='${hash}' RETURNING TRUE;
          UPDATE chat_rooms SET user_ids = user_ids || ${isOk.user_id} WHERE name='Курилка за казармой' AND NOT (${isOk.user_id}=ANY(user_ids))`

          const data = await db.query(query)
          const result = data[0].rows

          if (result[0].bool === true) {
            await User.Photo.add(isOk.user_id, avatar_src.filename, 'AVATAR')
            await User.Notification.add(isOk.user_id, {
              title: 'Добро пожаловать в армию!'
            })
            await User.History.add(isOk.user_id, 'SIGNUP')
            await User.Weight.addToHistory(isOk.user_id, weight_start)
            await User.Common.setUserDataByPlan(isOk.user_id, plan_id)

            return utils.response.success(res)
          } else utils.response.error(res, 'Произошла ошибка, попробуйте позже')
        }
      } else
        return utils.response.error(
          res,
          'Платеж не обработан или завершен отказом'
        )
    } catch (error) {
      return utils.response.error(res, 'Не удалось изменить данные')
    }
  }
}

module.exports = SignUp
