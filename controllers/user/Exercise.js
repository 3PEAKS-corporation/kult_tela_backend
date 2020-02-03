const { db, utils } = require('../../services')
const { DATA } = require('../../data/')
const Exercise = {
  async getOneById(req, res) {
    const { id } = req.params
    let query = `SELECT * FROM exercises WHERE id=$1`
    let values = [id]
    try {
      const { rows } = await db.query(query, values)
      if (rows[0]) return utils.response.success(res, rows[0])
      else return utils.response.error(res, 'Упражнение не найдена')
    } catch (error) {
      return utils.response.error(res, 'Упражнение не найдена')
    }
  },
  getAll(req, res) {
    return utils.response.success(res, DATA.exercise_videos)
  }
}

module.exports = Exercise
