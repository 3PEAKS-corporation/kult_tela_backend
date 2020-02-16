const { db } = require('../../services/')
const Common = require('./Common')
const History = require('./History')
const Notification = require('./Notification')

const Subscription = {
  async extend(userId, new_plan_id) {
    try {
      await Common.resetBeforeNewMonth(userId)
      await History.add(userId, 'PLAN_EXTEND')

      const query = `UPDATE users SET plan_id=$1, subscription_exp = current_timestamp + '31 days' WHERE id=$2 RETURNING TRUE`
      const values = [new_plan_id, userId]
      const { rows } = await db.query(query, values)
      console.log('rows: ', rows)
      if (rows[0].bool === true) {
        console.log('plan extended')
        await Notification.add(userId, { title: 'Подписка успешно продлена' })
        return true
      } else return false
    } catch (e) {
      console.log(e)
      return false
    }
  }
}

module.exports = Subscription
