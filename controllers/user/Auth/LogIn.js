const bcrypt = require('bcrypt')
const { utils, db, token: _token } = require('../../../services')
const { User } = require('../../../utils/')
const { DATA } = require('../../../data/')

const LogIn = {
  async login(req, res) {
    const { password, email } = req.body

    if (!utils.verify([password, email])) return utils.response.error(res)

    try {
      let user = await User.Common.getUserData(email, true, true)

      let isPassword = null
      if (user && user.password)
        isPassword = await bcrypt.compare(password, user.password)
      else if (user && !user.password)
        return utils.response.error(
          res,
          'Ваша регистрация не завершена, проверьте электронную почту!'
        )
      else return utils.response.error(res, 'Пользователь не существует')
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
      return utils.response.error(res, 'Пользователь не существует')
    }
  },

  async userByToken(req, res) {
    const userId = req.currentUser.id
    console.log(userId)

    try {
      const user = await User.Common.getUserData(userId)
      if (user !== null) return utils.response.success(res, user)
      else return utils.response.error(res, 'Неправильный токен')
    } catch (error) {
      return utils.response.error(res, 'Пользователь не найден')
    }
  }
}

module.exports = LogIn
