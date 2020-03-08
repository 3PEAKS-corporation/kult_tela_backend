const { utils, db } = require('../../../services/')
const { User } = require('../../../utils/')

const Workout = {
  async getLevels(req, res) {
    const levels = await User.Workout.getLevels(req.currentUser.id)
    if (levels) return utils.response.success(res, levels)
    else return utils.response.error(res, 'Изменение данных невозможно')
  },
  async setLevels(req, res) {
    let { physical_level, overweight_level } = req.body

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
    let query = `SELECT extract(dow from current_timestamp) as _dow;`
    try {
      const { rows } = await db.query(query)
      let dow = rows[0]._dow

      const schedule = formSchedule(dow)

      query = `UPDATE users SET workout = workout || '{"physical_level": ${physical_level}}'::jsonb WHERE id =${userId};
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

function formSchedule(dow) {
  const work_days = [
    { number: 1, next_after: 2 },
    { number: 3, next_after: 2 },
    { number: 5, next_after: 3 }
  ]

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
