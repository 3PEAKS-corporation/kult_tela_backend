const { db, utils } = require('../../services')

const Workout = {
  async create(req, res) {
    const { name, description, exercises_home, exercises_gym } = req.body

    if (!utils.verify([name, description]) && Array.isArray(exercises_gym) && Array.isArray(exercises_home))
      return utils.response.error(res)

    const query = `INSERT INTO workouts(
        name, description, exercises_home, exercises_gym)
        VALUES ($1, $2, $3, $4);`

    const values = [name, description, exercises_home, exercises_gym]

    try {
      const result = await db.query(query, values)
      return utils.response.success(res)
    } catch (error) {
      return utils.response.error(res, 'Ошибка при добавлении')
    }
  }
}

module.exports = Workout
