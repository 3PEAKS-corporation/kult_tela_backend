const { utils } = require('../services/')
const { User } = require('../utils/')

const getToken = req => req.headers.token

const requireAuth = {
  userToken(withoutSubscription = false) {
    return async function(req, res, next) {
      const token = getToken(req)

      const user = await User.Token.getUserByToken(token)
      if (user) {
        /**
         * @ADMIN auth
         */
        if (!user.plan_id && typeof user.admin_role_id === 'number') {
          req.currentUser = {
            id: user.id,
            admin_role_id: user.admin_role_id,
            admin: true
          }
          return next()
        } else if (
          user.is_subscription === true ||
          withoutSubscription === true
        ) {
          /**
           * @USER auth
           */
          req.currentUser = {
            id: user.id,
            plan_id: user.plan_id
          }
          return next()
        } else if (user.is_subscription === false) {
          return utils.response.error(res, 'Нет доступа, срок подписки истек')
        }
      } else {
        return utils.response.error(
          res,
          'Ошибка доступа: токен отсутствует',
          401
        )
      }
    }
  },
  async adminToken(req, res, next) {
    const token = getToken(req)

    const admin = await User.Token.getUserByToken(token)
    if (admin && typeof admin.admin_role_id === 'number') {
      req.currentUser = {
        id: admin.id,
        admin_role_id: admin.admin_role_id,
        admin: true
      }
      console.log(req.currentUser)
      return next()
    } else return utils.response.error(res, 'Ошибка доступа: токен отсутствует')
  }
}

module.exports = requireAuth
