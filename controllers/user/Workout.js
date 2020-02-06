const { db, utils } = require('../../services')
const { DATA } = require('../../data')

const Workout = {
  async get(req, res) {
    const query = `SELECT workout, EXTRACT('DAY' FROM (current_timestamp - (workout->>'start_date')::timestamp::date)) as days_from_start FROM users WHERE id=$1`
    const values = [req.currentUser.id]
    try {
      const { rows } = await db.query(query, values)

      const _workout = rows[0].workout
      const days_from_start = rows[0].days_from_start
      if (_workout) {
        const workout_ids =
          DATA.workouts.relation[_workout.physical_level][
            _workout.overweight_level
          ]
        let workout = {}
        if (typeof workout_ids.gym === 'number') {
          const wg = DATA.workouts.plans.filter(
            item => item.id === workout_ids.gym
          )[0]
          workout.gym = {}
          //workout.gym.id = wg.id
          workout.gym.description = wg.description
          workout.gym.exercises = wg.days[days_from_start]
        } else workout.gym = null

        if (typeof workout_ids.home === 'number') {
          const wh = DATA.workouts.plans.filter(
            item => item.id === workout_ids.home
          )[0]
          workout.home = {}

          //workout.home.id = wh.id
          workout.home.description = wh.description
          workout.home.exercises = wh.days[days_from_start]
        } else workout.home = null
        console.log(workout)
        return utils.response.success(res, workout)
      }
    } catch (e) {
      console.log(e)
      return utils.response.error(res)
    }
  }
}

module.exports = Workout
