const { db, utils } = require('../../services/')
const { copyDATA } = require('../../data/')

const Public = {
  async getUserInfo(userId) {
    const query = `SELECT *, 
       to_char((workout->>'start_date')::timestamp, 'DD.MM.YYYY') as workout_start_date
       FROM users WHERE id=$1 AND admin_role_id IS NULL`
    const values = [userId]
    try {
      const { rows } = await db.query(query, values)
      if (rows[0]) {
        let user = rows[0]

        const plans = copyDATA('plans')
        const workout_levels = copyDATA('workout_levels')

        user.plan_name = plans.filter(e => e.id === user.plan_id)[0].name
        user.name =
          user.last_name + ' ' + user.first_name + ' ' + user.patronymic

        if (user.food_reports) {
          user.food_reports = user.food_reports.slice(-6).map(e => {
            e.image_src = utils.getImageUrl(e.image_src)
            return e
          })
        }

        if (
          user.workout &&
          typeof user.workout.overweight_level == 'number' &&
          typeof user.workout.physical_level == 'number'
        ) {
          user.workout.overweight_level = workout_levels.overweight.filter(
            e => e.id === user.workout.overweight_level
          )[0].name
          user.workout.physical_level = workout_levels.physical.filter(
            e => e.id === user.workout.physical_level
          )[0].name
          user.workout.start_date = user.workout_start_date
          delete user.workout_start_date
        }
        delete user.password
        delete user.photos
        delete user.notifications
        delete user.notifications_last_seen
        delete user.history

        user.avatar_src = utils.getImageUrl(user.avatar_src)
        return user
      } else return false
    } catch (e) {
      return null
    }
  }
}

module.exports = Public
