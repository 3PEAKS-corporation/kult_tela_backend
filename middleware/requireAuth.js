const { utils } = require('../services/')
const {
  User: { Token }
} = require('../utils/')

const getToken = req => req.headers.token

const requireAuth = {
  userToken(withoutSubscription = false) {
    return async function(req, res, next) {
      const token = getToken(req)

      const user = await Token.getUserByToken(token)

      console.log('tyts')

      if (user.is_subscription === true || withoutSubscription === true) {
        req.currentUser = {
          id: user.id,
          plan_id: user.plan_id
        }
        return next()
      } else if (user.is_subscription === false) {
        console.log('erer')
        return utils.response.error(res, 'Нет доступа, срок подписки истек')
      } else if (user === null) {
        return utils.response.error(
          res,
          'Ошибка доступа: токен отсутствует',
          401
        )
      }
    }
  },
  async adminToken(req, res, next) {
    return next()
  }
}

module.exports = requireAuth
