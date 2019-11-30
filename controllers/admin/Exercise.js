const { db, utils } = require('../../services')

const Exercise = {
  async create(req, res) {
    const { type, name, description, repetitions, video_src } = req.body

    if (!utils.verify([type, name, repetitions, description, video_src]))
      return utils.response.error(res)

    const query = `INSERT INTO execrices(type, name, description, repetitions, video_src) VALUES ($1, $2, $3, $4, $5)`

    const values = [type, name, description, repetitions, video_src]

    try {
      const result = await db.query(query, values)
      return utils.response.success(res)
    } catch (error) {
      return utils.response.error(res, 'Ошибка при добавлении')
    }
  }
}

module.exports = Exercise
