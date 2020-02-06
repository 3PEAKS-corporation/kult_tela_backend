const { db } = require('../../services/')
const { DATA } = require('../../data/')

const Workout = {
  /**
   *
   * @param userId
   * @returns {object} if user stil didnt set his levels
   * @returns {null|{false}} if not needed to set levels
   */
  async getLevels(userId) {
    const query = 'SELECT workout, payments FROM users WHERE id=$1'
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
        const payments = rows[0].payments
        let paymentsAmount = 0
        payments.forEach(payment => {
          paymentsAmount += ['PLAN_BUY', 'PLAN_EXTENSION'].includes(
            payment.reason
          )
            ? 1
            : 0
        })
        paymentsAmount = paymentsAmount - 1
        console.log('pa', paymentsAmount)
        let levels = JSON.parse(JSON.stringify(DATA.workout_levels))

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
