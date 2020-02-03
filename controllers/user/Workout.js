const { db, utils } = require('../../services')

const Recipe = {
  async getOneById(req, res) {
    const { id } = req.params
    let query = `SELECT * FROM workouts WHERE id=$1`
    let values = [id]
    try {
      const { rows } = await db.query(query, values)
      let workout = rows[0]
      if (rows[0]) {
        const ids_home = workout.exercises_home
        const ids_gym = workout.exercises_gym

        query = `SELECT * FROM exercises WHERE id IN (${ids_home.join(',')})`
        const { rows: exercises_home } = await db.query(query)

        query = `SELECT * FROM exercises WHERE id IN (${ids_gym.join(',')})`
        const { rows: exercises_gym } = await db.query(query)

        workout.exercises_home = exercises_home
        workout.exercises_gym = exercises_gym

        return utils.response.success(res, workout)
      } else return utils.response.error(res, 'Тренировка не найдена')
    } catch (error) {
      return utils.response.error(res, 'Тренировка не найдена')
    }
  }
}

module.exports = Recipe
