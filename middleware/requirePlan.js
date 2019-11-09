const { db, utils, token: _token } = require('../services/')

module.exports = function(minPlanId = 0) {
  return function(req, res, next) {
    if ((minPlanId = 0)) return next()

    const plan_id = req.currentUser.plan_id
    if (plan_id < minPlanId)
      return utils.response.error(res, 'Неправильный уровень доступа')
    else return next()
  }
}
