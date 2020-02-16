const { utils, db } = require('../../services/')
const { env } = require('../../config/')
const { DATA } = require('../../data/')
const bcrypt = require('bcrypt')

const SALT_ROUNDS = 10

const Auth = {
  async signUp(req, res) {
    const user = req.body
    console.log(user)

    if (user.secret !== env.ADMIN_SECRET)
      return utils.response.error(res, 'Секретный код неправильный')

    if (
      !utils.verify(
        user.first_name,
        user.last_name,
        user.password,
        user.secret,
        user.email,
        user.role_id
      )
    )
      return utils.response.error(res)

    const passwordHashed = await bcrypt.hash(user.password, SALT_ROUNDS)

    const query = `INSERT INTO users(first_name, last_name, password, admin_role_id) VALUES($1, $2, $3, $4)`
    const values = [
      user.first_name,
      user.last_name,
      passwordHashed,
      user.role_id
    ]

    //TODO: Доделать
  }
}

module.exports = Auth
