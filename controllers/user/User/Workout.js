const { utils, db, token: _token, mail } = require('../../../services/')
const { DATA } = require('../../../data/')

const Workout = {
  async getLevels(req, res) {
    const query = 'SELECT workout FROM users WHERE id=$1'
    const values = [req.currentUser.id]

    try {
      const { rows } = await db.query(query, values)
      const workout = rows[0].workout

      if (
        typeof workout.physical_level === 'number' &&
        typeof workout.overweight_level === 'number'
      ) {
        return utils.response.success(res, null)
      } else {
        // TODO: add payments protection
        let levels = DATA.workout_levels
        return utils.response.success(res, levels)
      }
    } catch (e) {
      return utils.response.error(res)
    }
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
                UPDATE users SET workout = workout || '{"overweight_level": ${overweight_level}}'::jsonb WHERE id =${userId};`
    try {
      await db.query(query)
      return utils.response.success(res)
    } catch (e) {
      return utils.response.error(res, 'Не удалось изменить данные')
    }
  }
}

module.exports = Workout
