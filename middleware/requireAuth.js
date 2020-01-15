const { db, utils, token: _token } = require('../services/')

const requireAuth = {
  async userToken(req, res, next) {
    const token = _token.getToken(req)
    if (!token)
      return utils.response.error(res, 'Ошибка доступа: токен отсутствует')

    const query = `SELECT users.id as id, users.plan_id as plan_id FROM tokens
                    LEFT JOIN users
                    ON tokens.user_id = users.id
                    WHERE token =$1`

    const values = [token]

    try {
      const { rows } = await db.query(query, values)
      if (!rows[0].id)
        return utils.response.error(res, 'Ошибка доступа: токен не найден', 401)
      else {
        const user = rows[0]
        req.currentUser = { id: user.id, plan_id: user.plan_id }
        console.log()

        return next()
      }
    } catch (error) {
      return utils.response.error(res, 'Ошибка доступа', 401)
    }
  },
  async adminToken(req, res, next) {
    return next()
  }
}

module.exports = requireAuth
