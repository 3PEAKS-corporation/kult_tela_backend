const { db } = require('../../services/')
const { copyDATA } = require('../../data')

const newPrice = (newPlanPrice, currentPlanPrice, daysFromStart) =>
  newPlanPrice - (currentPlanPrice / 31) * daysFromStart

const Plan = {
  async getChangePrices(userId) {
    const query = `SELECT id, plan_id, TO_CHAR((current_timestamp - (subscription_exp - interval '31 day')), 'DD')::int  as days_from_sub FROM users WHERE id=$1`

    const values = [parseInt(userId)]

    try {
      const { rows } = await db.query(query, values)
      let data = rows[0]
      if (data && typeof data.plan_id === 'number') {
        const plans = copyDATA().plans
        const currentPrice = plans.filter(e => e.id === data.plan_id)[0].cost
        const newPlans = plans.map(e => {
          if (e.id > data.plan_id) {
            e.newCost = Math.round(
              newPrice(e.cost, currentPrice, data.days_from_sub)
            )
          }
          return e
        })
        return newPlans.filter(
          (e, i) =>
            !newPlans[i + 1] || typeof newPlans[i + 1].newCost === 'number'
        )
      }
    } catch (e) {
      return null
    }
  }
}

module.exports = Plan
