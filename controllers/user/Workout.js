const { db, utils } = require('../../services')
const { DATA } = require('../../data')

const Workout = {
  get(prev = false) {
    return async function(req, res) {
      const query = `SELECT workout, EXTRACT('DAY' FROM (current_timestamp - (workout->>'start_date')::timestamp::date)) as days_from_start FROM users WHERE id=$1`
      const values = [req.currentUser.id]
      try {
        const { rows } = await db.query(query, values)

        const _workout = rows[0].workout
        let days_from_start = rows[0].days_from_start

        if (_workout) {
          const workout_ids =
            DATA.workouts.relation[_workout.physical_level][
              _workout.overweight_level
            ]

          let workout = {
            day_number: days_from_start + 1
          }

          if (
            days_from_start <=
            _workout.schedule[_workout.schedule.length - 1].dfs
          ) {
            let train_id = _workout.schedule.filter(
              e => e.dfs === days_from_start
            )[0]

            if (prev === true && !train_id) {
              days_from_start = days_from_start - 1
              train_id = _workout.schedule.filter(
                e => e.dfs === days_from_start
              )[0]
              if (!train_id) days_from_start = days_from_start - 1
              train_id = _workout.schedule.filter(
                e => e.dfs === days_from_start
              )[0]
            } else if (prev === true)
              return utils.response.error(
                res,
                'Невозможно просмотреть предыдущую тренировку'
              )

            if (train_id) {
              if (typeof workout_ids.gym === 'number') {
                train_id = train_id.train_day
                const wg = DATA.workouts.plans.filter(
                  item => item.id === workout_ids.gym
                )[0]

                workout.gym = {}
                workout.gym.description = wg.description
                workout.gym.exercises = wg.days[train_id].exercises
              } else workout.gym = null

              if (typeof workout_ids.home === 'number') {
                const wh = DATA.workouts.plans.filter(
                  item => item.id === workout_ids.home
                )[0]

                workout.home = {}
                workout.home.description = wh.description
                workout.home.exercises = wh.days[train_id].exercises
              } else workout.home = null
            } else workout.day_off = true
          } else workout.plan_done = true

          return utils.response.success(res, workout)
        } else return utils.response.success(res, { day_off: true })
      } catch (e) {
        console.log(e)
        return utils.response.error(res)
      }
    }
  }
}

module.exports = Workout
