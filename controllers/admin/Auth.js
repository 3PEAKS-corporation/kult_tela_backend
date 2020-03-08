const { utils, db } = require('../../services/')
const { env } = require('../../config/')
const bcrypt = require('bcrypt')

const SALT_ROUNDS = 10

const Auth = {
  async signUp(req, res) {
    const user = req.body

    if (user.secret !== env.ADMIN_SECRET)
      return utils.response.error(res, 'Секретный код неправильный')

    if (
      !utils.verify([
        user.first_name,
        user.last_name,
        user.password,
        user.secret,
        user.email,
        user.role_id,
        user.description
      ])
    )
      return utils.response.error(res)

    const passwordHashed = await bcrypt.hash(user.password, SALT_ROUNDS)

    const query = `INSERT INTO users(email, first_name, last_name, password, admin_role_id, admin_description) VALUES($1, $2, $3, $4, $5, $6)`
    const values = [
      user.email,
      user.first_name,
      user.last_name,
      passwordHashed,
      user.role_id,
      user.description
    ]

    try {
      await db.query(query, values)
      return utils.response.success(
        res,
        'Регистрация успешна, теперь вы можете войти по своим данным.'
      )
    } catch (e) {
      console.log(e)
      return utils.response.error(res, 'email уже используется')
    }
  }
}

module.exports = Auth
