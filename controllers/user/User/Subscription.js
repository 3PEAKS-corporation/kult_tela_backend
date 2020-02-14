const { utils, db } = require('../../../services/')
const { User } = require('../../../utils/')
const { DATA } = require('../../../data/')

const Subscription = {
  async extend(req, res) {
    const { plan_id } = req.body
    const plans = JSON.parse(JSON.stringify(DATA.plans))
    const plan = plans.filter(e => (e.id = plan_id))[0]
    if (plan) {
      // TODO: создание платежа и возврат юзеру ссылки на оплату
      const payment = true
      if (payment) {
        try {
          const userId = req.currentUser.id

          await User.Common.resetBeforeNewMonth(userId)
          await User.History.add(userId, 'PLAN_EXTEND')
          await User.Payment.add(userId, {
            reason: 'PLAN_EXTEND',
            amount: plan.cost,
            key: 'KEY'
          })

          const query = `UPDATE users SET plan_id=$1, subscription_exp = current_timestamp + '31 days' WHERE id=$2 RETURNING TRUE`
          const values = [plan_id, req.currentUser.id]
          const { rows } = await db.query(query, values)
          if (rows[0].bool === true) {
            return utils.response.success(res, true)
          } else
            return utils.response.error(res, 'Не удалось произвести оплату')
        } catch (e) {
          return utils.response.error(res, 'Не удалось произвести оплату')
        }
      }
    }
  }
}

module.exports = Subscription
