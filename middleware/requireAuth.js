const { db, utils, token: _token } = require('../services/')

module.exports = {
  async requireToken(req, res, next) {
    const token = _token.getToken(req)
    if (!token)
      return utils.response.error(res, 'Ошибка доступа: токен отсутствует')

    const query = `SELECT * FROM tokens where token = $1`
    const values = [token]

    try {
      const { rows } = await db.query(query, values)
      if (!rows[0].user_id)
        return utils.response.error(
          res,
          'Ошибка доступа: токен отсутствует',
          401
        )
      else {
        req.currentUserId = rows[0].user_id
        return next()
      }
    } catch (error) {
      return utils.response.error(res, 'Ошибка доступа', 401)
    }
  }
}
