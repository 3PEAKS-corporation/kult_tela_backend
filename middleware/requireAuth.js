const { utils } = require('../services/')
const { Token } = require('../utils/')

const getToken = req => req.headers.token

const requireAuth = {
  async userToken(req, res, next) {
    const token = getToken(req)

    const user = await Token.getUserByToken(token)

    if (user) {
      req.currentUser = {
        id: user.id,
        plan_id: user.plan_id
      }
      return next()
    } else
      return utils.response.error(res, 'Ошибка доступа: токен отсутствует', 401)
  },
  async adminToken(req, res, next) {
    return next()
  }
}

module.exports = requireAuth
