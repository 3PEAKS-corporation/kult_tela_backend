const { db, utils } = require('../../services')
const { DATA } = require('../../data')

const Workout = {
  async get(req, res) {
    const query = `SELECT workout, EXTRACT('DAY' FROM (current_timestamp - (workout->>'start_date')::timestamp::date)) as days_from_start, extract(dow from current_timestamp) as _dow FROM users WHERE id=$1`
    const values = [req.currentUser.id]
    try {
      const { rows } = await db.query(query, values)
      const dow = rows[0]._dow
      //if ([1, 3, 5].includes(dow)) {
      const _workout = rows[0].workout
      const days_from_start = rows[0].days_from_start
      if (_workout) {
        const workout_ids =
          DATA.workouts.relation[_workout.physical_level][
            _workout.overweight_level
          ]
        let workout = {
          day_number: days_from_start + 1
        }
        if (typeof workout_ids.gym === 'number') {
          const wg = DATA.workouts.plans.filter(
            item => item.id === workout_ids.gym
          )[0]
          workout.gym = {}
          workout.gym.description = wg.description
          // TODO: add proper days offset here
          workout.gym.exercises = wg.days[days_from_start].exercises
        } else workout.gym = null

        if (typeof workout_ids.home === 'number') {
          const wh = DATA.workouts.plans.filter(
            item => item.id === workout_ids.home
          )[0]
          workout.home = {}

          workout.home.description = wh.description
          // TODO: add proper days offset here
          workout.home.exercises = wh.days[days_from_start].exercises
        } else workout.home = null
        return utils.response.success(res, workout)
      } else return utils.response.success(res, { day_off: true })
      //}
    } catch (e) {
      console.log(e)
      return utils.response.error(res)
    }
  }
}

module.exports = Workout
