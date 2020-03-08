const { db } = require('../../services/')
const { copyDATA } = require('../../data/')

const Workout = {
  /**
   *
   * @param userId
   * @returns {object} if user stil didnt set his levels
   * @returns {null|{false}} if not needed to set levels
   */
  async getLevels(userId) {
    const query = `SELECT users.workout, users.id as user_id, COUNT(payments.id) as plan_payments FROM users LEFT JOIN payments ON payments.user_id=users.id  WHERE users.id=$1 AND users.plan_id > 0 AND (payments.type='PLAN_BUY' OR payments.type='PLAN_EXTEND') GROUP BY users.workout, users.id;`
    const values = [userId]

    try {
      const { rows } = await db.query(query, values)
      const workout = rows[0].workout
      console.log(rows)

      if (
        typeof workout.physical_level === 'number' &&
        typeof workout.overweight_level === 'number'
      ) {
        return false
      } else {
        let paymentsAmount = rows[0].plan_payments
        paymentsAmount = paymentsAmount - 1
        let levels = copyDATA('workout_levels')

        if (paymentsAmount > 0) {
          for (
            let i = 2;
            paymentsAmount !== 0 && i < 5;
            i++, paymentsAmount--
          ) {
            delete levels.physical[i].disabled
          }
        }
        return levels
      }
    } catch (e) {
      return null
    }
  }
}

module.exports = Workout
