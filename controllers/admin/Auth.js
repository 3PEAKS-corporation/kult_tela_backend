const { utils, db } = require('../../services/')
const { env } = require('../../config/')
const bcrypt = require('bcrypt')
const { User } = require('../../utils/')

const SALT_ROUNDS = 10

const Auth = {
  async signUp(req, res) {
    const user = req.body
    const file = req.file
    user.role_id = parseInt(user.role_id)

    if ([0, 1, 2].includes(user.role_id)) {
      if (user.secret !== env.ADMIN_SECRET)
        return utils.response.error(res, 'Секретный код неправильный')
    } else if (user.role_id === -1) {
      if (user.secret !== env.SUPERADMIN_SECRET)
        return utils.response.error(res, 'Секретный код неправильный')
    } else return utils.response.error(res, 'Секретный код неправильный')

    if (
      !utils.verify([
        user.first_name,
        user.last_name,
        user.password,
        user.secret,
        user.email,
        user.role_id
      ])
    )
      return utils.response.error(res)

    const passwordHashed = await bcrypt.hash(user.password, SALT_ROUNDS)

    let query = `INSERT INTO users(email, first_name, last_name, password, admin_role_id, admin_description, avatar_src) VALUES($1, $2, $3, $4, $5, $6, $7) RETURNING id`
    let values = [
      user.email,
      user.first_name,
      user.last_name,
      passwordHashed,
      user.role_id,
      user.description || '',
      file ? file.filename : ''
    ]

    try {
      const { rows } = await db.query(query, values)

      if (parseInt(user.role_id) === 1 && rows[0]) {
        await User.Chat.InitRooms.convWithDietolog(rows[0].id)
      }

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
