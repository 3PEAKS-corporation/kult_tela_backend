const { db } = require('../../services/')
const { copyDATA } = require('../../data')
const Notification = require('./Notification')
const Common = require('./Common')

const newPrice = (newPlanPrice, currentPlanPrice, daysFromStart) =>
  newPlanPrice - (currentPlanPrice / 31) * (daysFromStart + 1)

const Plan = {
  async getChangePrices(userId) {
    const query = `SELECT id, plan_id, (SELECT status FROM payments WHERE user_id=$1 AND type='PLAN_BUY' ORDER BY id DESC LIMIT 1) as payment_status, TO_CHAR((current_timestamp - (subscription_exp - interval '31 day')), 'DD')::int  as days_from_sub FROM users WHERE id=$1`

    const values = [parseInt(userId)]

    try {
      const { rows } = await db.query(query, values)
      let data = rows[0]
      if (data && typeof data.plan_id === 'number') {
        const plans = copyDATA('plans')
        if (data.payment_status === 'promo_code') {
          return plans
            .map(e => {
              if (e.id !== data.plan_id) e.newCost = e.cost
              delete e.cost
              return e
            })
            .filter(e => e.id >= data.plan_id)
        } else {
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
      }
    } catch (e) {
      return null
    }
  },
  async changePlan(userId, newPlanId) {
    userId = parseInt(userId)
    newPlanId = parseInt(newPlanId)
    const query = `UPDATE users SET plan_id=$1 WHERE id=$2 RETURNING true`
    const values = [newPlanId, userId]

    try {
      const q2 = `SELECT plan_id as current_plan_id FROM users WHERE id=$1`
      const v2 = [userId]
      const { rows: info } = await db.query(q2, v2)
      if (!info[0] || typeof info[0].current_plan_id !== 'number') return false

      const { rows } = await db.query(query, values)
      if (rows[0] && rows[0].bool) {
        await Common.setUserDataByPlan(
          userId,
          newPlanId,
          info[0].current_plan_id
        )
        await Notification.add(userId, {
          title: 'Текущий пакет успешно изменён!'
        })
        return true
      }
    } catch (e) {
      console.log(e)
      await Notification.add(userId, {
        title:
          'Ошибка при смене пакета, пожалуйста, обратитесь к администратору'
      })
      return false
    }
  }
}

module.exports = Plan
