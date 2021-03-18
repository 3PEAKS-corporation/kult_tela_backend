const { utils, db } = require('../../../services/')
const { User } = require('../../../utils/')

const Workout = {
  async getLevels(req, res) {
    const levels = await User.Workout.getLevels(req.currentUser.id)
    if (levels) return utils.response.success(res, levels)
    else return utils.response.error(res, 'Ошибка при получении данных')
  },
  async setLevels(req, res) {
    let { physical_level, overweight_level, schedule_type } = req.body

    if(schedule_type !== 'odd' && schedule_type !== 'even') schedule_type = 'odd'

    if (!utils.verify([physical_level, overweight_level]))
      return utils.response.error(res)

    physical_level = parseInt(physical_level)
    overweight_level = parseInt(overweight_level)

    if (
      typeof physical_level !== 'number' ||
      typeof overweight_level !== 'number'
    )
      return utils.response.error(res)
    const userId = parseInt(req.currentUser.id)

    try {
      const dateNow = new Date();
      const schedule = formSchedule(dateNow.getDay(), schedule_type)

      const query = `UPDATE users SET workout = workout || '{"physical_level": ${physical_level}}'::jsonb WHERE id =${userId};
                UPDATE users SET workout = workout || '{"overweight_level": ${overweight_level}}'::jsonb WHERE id =${userId};
                UPDATE users SET workout = workout || jsonb_build_object('start_date', current_timestamp) WHERE id=${userId};
                UPDATE users SET workout = workout || jsonb_build_object('schedule', cast('${JSON.stringify(
                  schedule
                )}' AS jsonb)) WHERE id=${userId};`

      await db.query(query)
      return utils.response.success(res)
    } catch (e) {
      return utils.response.error(res, 'Не удалось изменить данные')
    }
  }
}

const workout_schedule = {
  odd: [
    { number: 1, next_after: 2 },
    { number: 3, next_after: 2 },
    { number: 5, next_after: 3 }
  ],
  even: [
    { number: 2, next_after: 2 },
    { number: 4, next_after: 2 },
    { number: 6, next_after: 3 }
  ]
}

function formSchedule(dow, schedule_type) {
  const work_days = workout_schedule[schedule_type]

  let schedule = []
  let train_day = 0
  for (let dfs = 0; dfs < 31 && train_day < 12; ) {
    let train = { dfs }
    const work_day = work_days.filter(e => e.number === dow)[0]
    if (work_day) {
      train.train_day = train_day
      schedule.push(train)

      train_day += 1
    }
    const add = work_day ? work_day.next_after : 1
    dfs += add
    dow += add
    dow = dow > 6 ? dow - 7 : dow
  }
  return schedule
}

module.exports = Workout
