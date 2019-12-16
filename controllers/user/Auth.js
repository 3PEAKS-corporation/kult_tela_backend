const bcrypt = require('bcrypt')
const {
  utils,
  db,
  token: _token,
  email: emailSender
} = require('../../services')
const User = require('../user/User')
const { Plans } = require('../user/Plan')
const SALT_ROUNDS = 10

async function isHashAndPaymentDone(hash) {
  let query = `SELECT * FROM signup_info WHERE hash=$1`
  let values = [hash]
  let { rows } = await db.query(query, values)
  const info = rows[0]
  if (info && info.used === false) {
    //TODO: проверка статуста платежа
    const payment = true
    if (payment) return { success: true, user_id: info.user_id }
    else if (!payment) return false
  } else return false
}

const Auth = {
  async createBlankProfile(req, res) {
    const { email, plan_id } = req.body
    if (!email || plan_id === undefined) return utils.response.error(res)

    let query = `INSERT INTO users(email, plan_id) VALUES($1, $2) RETURNING id, email`
    let values = [email, plan_id]

    //TODO: создание платежа и отдача ссылки оплаты

    try {
      const { rows: user } = await db.query(query, values)
      if (user[0]) {
        const { id: user_id, email } = user[0]
        const hash = _token.generateToken({
          id: user_id + '_PAYMENT',
          email: email
        })
        query = `INSERT INTO signup_info(user_id, hash, payment_hash) VALUES($1,$2,$3) RETURNING TRUE`
        values = [user_id, hash, 'PAYMENT_HASH']
        const { rows: signup_info } = await db.query(query, values)
        const payment = {
          reason: 'BUY_PLAN',
          amount: Plans[plan_id].cost,
          key: 'sdsdsds'
        }
        await User.addPayment(user_id, payment)

        emailSender(email, hash)
        //TODO: отправка на почту ссылки для заполнения данных
        if (signup_info[0]) return utils.response.success(res)
        else return utils.response.error(res, 'Ошибка создания пользователя')
      } else return utils.response.error(res, 'Email уже зарегистрирован')
    } catch (error) {
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
      const isOk = await isHashAndPaymentDone(hash)

      if (isOk) {
        let query = `SELECT email FROM users WHERE id=$1`
        let values = [isOk.user_id]
        let { rows } = await db.query(query, values)
        return utils.response.success(res, { email: rows[0].email })
      } else
        return utils.response.error(
          res,
          'Платеж в обработке, или срок действия ссылки истек'
        )
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
      height
    } = req.body
    const avatar_src = req.file

    if (
      !utils.verify([
        hash,
        first_name,
        last_name,
        patronymic,
        weight_start,
        password,
        avatar_src,
        height
      ])
    )
      return utils.response.error(res)

    try {
      const isOk = await isHashAndPaymentDone(hash)

      if (isOk) {
        const passwordHashed = await bcrypt.hash(password, SALT_ROUNDS)

        let query = `UPDATE users SET password=$1, first_name=$2, last_name=$3, patronymic=$4, weight_start=$5, avatar_src=$6, height=$8 WHERE id=$7 RETURNING TRUE`
        let values = [
          passwordHashed,
          first_name,
          last_name,
          patronymic,
          weight_start,
          avatar_src.filename,
          isOk.user_id,
          height
        ]
        const { rows } = await db.query(query, values)
        if (rows[0].bool === true) {
          query = `UPDATE signup_info SET used=TRUE WHERE hash=$1 RETURNING TRUE`
          values = [hash]
          const { rows: result } = await db.query(query, values)
          if (result[0].bool === true) {
            await User.addPhoto(isOk.user_id, avatar_src.filename)
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
  },

  async login(req, res) {
    const { password, email } = req.body

    if (!utils.verify([password, email])) return utils.response.error(res)

    const query = `SELECT *, to_char(date_signup,'DD.MM.YYYY') as date_signup_formatted FROM users WHERE email=$1`
    const values = [email]

    try {
      const { rows } = await db.query(query, values)
      let user = rows[0]
      const isPassword = await bcrypt.compare(password, user.password)
      user.date_signup = user.date_signup_formatted
      delete user.date_signup_formatted
      delete user.password
      if (isPassword) {
        const query2 = `UPDATE tokens SET expire_date=CURRENT_DATE+interval'31 days' WHERE user_id=$1 RETURNING *`
        const values2 = [user.id]

        const { rows: result } = await db.query(query2, values2)
        if (result[0] && result[0].token) {
          return utils.response.success(res, { token: result[0].token, user })
        }

        const token = _token.generateToken({ id: user.id, email: user.email })
        const query3 = `INSERT INTO tokens(user_id, token) VALUES($1,$2) RETURNING TRUE`
        const values3 = [user.id, token]

        const { rows: result2 } = await db.query(query3, values3)
        if (result2[0]) return utils.response.success(res, { token, user })
        else return utils.response.error(res, 'Ошибка БД')
      } else return utils.response.error(res, 'Неправильный пароль')
    } catch (error) {
      return utils.response.error(res, 'Email не существует')
    }
  },

  async userByToken(req, res) {
    const userId = req.currentUser.id

    const query = `SELECT *, to_char(date_signup,'DD.MM.YYYY') as date_signup_formatted FROM users WHERE id=$1`
    const values = [userId]

    try {
      const { rows } = await db.query(query, values)
      if (rows[0]) {
        let user = rows[0]
        user.date_signup = user.date_signup_formatted
        delete user.date_signup_formatted
        delete user.password
        return utils.response.success(res, { user })
      } else return utils.response.error(res, 'Неправильный токен')
    } catch (error) {
      return utils.response.error(res, 'Пользователь не найден')
    }
  }
}

module.exports = Auth
