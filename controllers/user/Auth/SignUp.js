const bcrypt = require('bcrypt')
const { utils, db, token: _token, kassa, phoneNumber, sms } = require('../../../services')
const { User } = require('../../../utils/')
const { copyDATA } = require('../../../data/')

const SALT_ROUNDS = 10

async function isHashAndPaymentDone(hash) {
  let query = `SELECT hashes.id, hashes.user_id, hashes.used, hashes.hash, payments.id as p_id, payments.status as p_status, payments.key as p_key
               FROM hashes
                        LEFT JOIN payments
                                  ON hashes.payment_id = payments.id AND payments.type='PLAN_BUY'
               WHERE hashes.hash=$1 AND hashes.used=false AND hashes.type='PLAN_BUY'`
  let values = [hash]
  try {
    let { rows } = await db.query(query, values)
    const info = rows[0]
    if (info && info.used === false) {
      if (info.p_status === 'succeeded')
        return { success: true, status: 'succeeded', user_id: info.user_id }
      else if (info.p_status.indexOf('promo_code') !== -1)
        return { success: true, status: info.p_status, user_id: info.user_id }
      else if (info.p_status.indexOf('trial') !== -1)
        return { success: true, status: info.p_status, user_id: info.user_id }

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
    console.log(e)
    return false
  }
}

const SignUp = {
  async createBlankProfile(req, res) {
    let { phone_number, code } = req.body
    const forceBuy = req.params.forceBuy !== 'false'
    const plan_id = parseInt(req.body.plan_id)
    if (!phone_number || typeof plan_id !== 'number' || isNaN(plan_id))
      return utils.response.error(res)

    phone_number = phoneNumber.format(phone_number)

    let query = `INSERT INTO users(phone_number, plan_id) VALUES($1, $2) RETURNING id, phone_number`
    let values = [phone_number, plan_id]

    const plans = copyDATA('plans')
    const plan = plans.filter(e => parseInt(e.id) === parseInt(plan_id))[0]

    try {
      const { rows: user } = await db.query(query, values)
      if (user[0]) {
        const { id: user_id, phone_number } = user[0]
        const hash = _token.generateToken({
          id: user_id,
          email: phone_number
        })

        let dbpayment = null,
          kassaPayment = null

        if (typeof plan.trial !== 'number' && forceBuy) {
          if (!code) {
            kassaPayment = await kassa.createPayment({
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

            dbpayment = await User.Payment.create(
              user_id,
              kassaPayment.id,
              'PLAN_BUY',
              parseInt(plan.cost)
            )
          } else if (code) {
            const codeStatus = await User.Promo.getStatus(code, true)
            if (codeStatus && codeStatus.plan_id === plan_id) {
              dbpayment = await User.Payment.create(
                user_id,
                null,
                'PLAN_BUY',
                0,
                'promo_code ' + codeStatus.key
              )
            }
          }
        } else {
          dbpayment = await User.Payment.create(
            user_id,
            null,
            'PLAN_BUY',
            0,
            'trial ' + plan.trial
          )
        }

        if (!dbpayment) {
          query = `DELETE FROM users WHERE id=$1`
          values = [user_id]
          await db.query(query, values)
          return utils.response.error(res, 'Ошибка при попытке регистрации')
        }

        query = `INSERT INTO hashes(user_id, hash, code, payment_id, type) VALUES($1,$2,$3,$4, 'PLAN_BUY') RETURNING TRUE`

        const code = utils.generateSmsCode()
        values = [user_id, hash, code, dbpayment.id]
        const { rows } = await db.query(query, values)

        if (!rows[0].bool)
          return utils.response.error(res, 'Ошибка создания пользователя')

        const  r = await sms.send('Код для продолжения регистрации: \n' + code ,phone_number)
        return utils.response.success(res, {
          url: kassaPayment ? kassaPayment.confirmation.confirmation_url : null,
          codeUsed: !!code
        })
      } else return utils.response.error(res, 'Непредвиденная ошибка')
    } catch (error) {
      console.log(error)
      return utils.response.error(
        res,
        'Пользователь с таким телефонным номером уже зарегистрирован'
      )
    }
  },
  async verifyCode(req, res) {
    const { code } = req.body
    if (!code) return utils.response.error(res)

    let query = `SELECT hash FROM hashes WHERE code=$1 AND used=false`
    let values = [code.toString()]

    let { rows } = await db.query(query, values)

    const hash = rows[0] && rows[0].hash || null
    if(hash == null) return utils.response.error(
      res,
      'Введен неправильный код, попробуйте снова'
    )

    return utils.response.success(res, {
      success: true,
      hash
    })
  },
  async isFillAllowed(req, res) {
    const { hash } = req.body

    if (!hash) return utils.response.error(res)

    try {
      let isOk = await isHashAndPaymentDone(hash)

      if (isOk.success === true) {
        let query = `SELECT phone_number FROM users WHERE id=$1`
        let values = [isOk.user_id]
        let { rows } = await db.query(query, values)
        return utils.response.success(res, {
          success: true,
          phone_number: rows[0].phone_number
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
        height
      ])
    )
      return utils.response.error(res)

    try {
      let isOk = await isHashAndPaymentDone(hash)
      isOk.user_id = parseInt(isOk.user_id)

      if (
        isOk.success === true &&
        (isOk.status === 'succeeded' ||
          isOk.status.indexOf('promo_code') !== -1 ||
          isOk.status.indexOf('trial') !== -1)
      ) {
        let subscription_duration
        if (isOk.status.indexOf('promo_code') !== -1) {
          const promoCode = await User.Promo.getStatus(
            isOk.status.replace('promo_code ', '')
          )
          subscription_duration = promoCode.subscription_duration || 31
        } else if (isOk.status.indexOf('trial') !== -1) {
          subscription_duration = parseInt(isOk.status.replace('trial ', ''))
        } else subscription_duration = 31

        const passwordHashed = await bcrypt.hash(password, SALT_ROUNDS)

        let query = `UPDATE users SET password=$1, first_name=$2, last_name=$3, patronymic=$4, weight_start=$5, avatar_src=$6, height=$8, age=$9,
                 date_signup=current_timestamp, subscription_exp = current_timestamp + '${subscription_duration} days' WHERE id=$7 RETURNING TRUE, plan_id`

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
          query = `UPDATE hashes SET used=TRUE WHERE hash='${hash}' RETURNING TRUE;
          UPDATE chat_rooms SET user_ids = user_ids || ${isOk.user_id} WHERE id=1 AND NOT (${isOk.user_id}=ANY(user_ids))`

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
