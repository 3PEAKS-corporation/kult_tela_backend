const { utils, db } = require('../../../services/')
const { DATA } = require('../../../data/')
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
    const query = `UPDATE users SET workout = workout || '{"physical_level": ${physical_level}}'::jsonb WHERE id =${userId};
                UPDATE users SET workout = workout || '{"overweight_level": ${overweight_level}}'::jsonb WHERE id =${userId};
                UPDATE users SET workout = workout || jsonb_build_object('start_date', current_timestamp) WHERE id=${userId};`
    try {
      await db.query(query)
      return utils.response.success(res)
    } catch (e) {
      return utils.response.error(res, 'Не удалось изменить данные')
    }
  }
}

module.exports = Workout
