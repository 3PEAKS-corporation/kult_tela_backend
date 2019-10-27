const bcrypt = require('bcrypt')
const { utils, db, token: _token, mail } = require('../services/')

const SALT_ROUNDS = 10

const User = {
  async createBlankProfile(req, res) {
    const { email } = req.body

    if (!email) return utils.response.error(res)

    const query = `INSERT INTO users(email) VALUES($1) RETURNING TRUE`
    const values = [email]
    try {
      const { rows: result } = await db.query(query, values)
      if (result[0]) return utils.response.success(res, result[0])
      else return utils.response.error(res, 'Пользователь уже существует')
    } catch (error) {
      return utils.response.error(
        res,
        'Пользователь с таким email уже зарегистрирован'
      )
    }
  },
  async signup(req, res) {
    const { password, email } = req.body

    if (!utils.verify([password, email])) return utils.response.error(res)

    const passwordHashed = await bcrypt.hash(password, SALT_ROUNDS)

    const query = `INSERT INTO users(email, password) VALUES($1, $2) RETURNING TRUE`
    const values = [email, passwordHashed]
    try {
      const { rows } = await db.query(query, values)
      return utils.response.success(res, rows[0])
    } catch (error) {
      return utils.response.error(
        res,
        'Пользователь с таким email уже зарегистрирован'
      )
    }
  },

  async login(req, res) {
    const { password, email } = req.body

    if (!utils.verify([password, email])) return utils.response.error(res)

    const query = `SELECT id, email, password FROM users WHERE email=$1`
    const values = [email]

    try {
      const { rows } = await db.query(query, values)
      const user = rows[0]
      const isPassword = await bcrypt.compare(password, user.password)
      if (isPassword) {
        const query2 = `UPDATE tokens SET expire_date=CURRENT_DATE+interval'31 days' WHERE user_id=$1 RETURNING *`
        const values2 = [user.id]

        const { rows: result } = await db.query(query2, values2)
        if (result[0].token)
          return utils.response.success(res, { token: result[0].token })

        const token = _token.generateToken({ id: user.id, email: user.email })
        const query3 = `INSERT INTO tokens(user_id, token) VALUES($1,$2) RETURNING TRUE`
        const values3 = [user.id, token]

        const { rows: result2 } = await db.query(query3, values3)
        if (result2[0]) return utils.response.success(res, { token })
        else return utils.response.error(res, 'Ошибка БД')
      } else return utils.response.error(res, 'Неправильный пароль')
    } catch (error) {
      utils.response.error(res, 'Email не существует')
    }
  },

  async userByToken(req, res) {
    const userId = req.currentUserId

    const query = `SELECT * FROM users WHERE id=$1`
    const values = [userId]

    try {
      const { rows } = await db.query(query, values)
      if (rows[0]) {
        let user = rows[0]
        delete user.password
        return utils.response.success(res, { user })
      } else return utils.response.error(res, 'Неправильный токен')
    } catch (error) {
      return utils.response.error(res, 'Пользователь не найден')
    }
  }
}

module.exports = User
