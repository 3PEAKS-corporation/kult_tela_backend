const bcrypt = require('bcrypt')
const { utils, db, jwt } = require('../services/')

const SALT_ROUNDS = 10

const User = {
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

        const token = jwt.generateToken({ id: user.id, email: user.email })
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
  async tokenAuth(req, res) {
    const { token } = req.headers
    if (!token) return utils.response.error(res, 'Токен не существует')

    const query = `SELECT users.id as id, users.email as email, users.name as name FROM users, tokens WHERE users.id = tokens.user_id AND tokens.token=$1`
    const values = [token]

    try {
      const { rows: user } = await db.query(query, values)
      if (user[0]) return utils.response.success(res, { user: user[0] })
    } catch (error) {
      return utils.response.error(res, 'Пользователь не найден')
    }
  }
}

module.exports = User
