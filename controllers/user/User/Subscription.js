const { utils, db } = require('../../../services/')
const { User } = require('../../../utils/')
const { DATA } = require('../../../data/')

const Subscription = {
  async Extend(req, res) {
    const { plan_id } = req.body
    console.log(req.body)
    const plan = DATA.plans.filter(e => (e.id = plan_id))[0]
    if (plan) {
      // TODO: создание платежа и возврат юзеру ссылки на оплату
      const payment = true
      if (payment) {
        console.log('ASS')
        try {
          const userId = req.currentUser.id
          await User.History.add(userId, 'PLAN_EXTEND')
          await User.Payment.add(userId, 'PLAN_EXTEND')

          const query = `UPDATE users SET plan_id=$1, subscription_exp = current_timestamp + '31 days' WHERE id=$2 RETURNING TRUE`
          const values = [plan_id, req.currentUser.id]
          const { rows } = await db.query(query, values)
          console.log('query did')
          console.log(rows)
          if (rows[0].bool === true) {
            return utils.response.success(res, true)
          }
        } catch (e) {
          console.log(e)
        }
      }
    }
  }
}

module.exports = Subscription
