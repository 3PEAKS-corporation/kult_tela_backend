const { db, utils } = require('../services')

const Top = {
  async current(req, res) {
    const query = `SELECT id, rank, weight_start, weight_diff, first_name, last_name FROM users WHERE weight_diff IS NOT NULL AND rank!=0 ORDER BY weight_diff DESC`

    try {
      const { rows } = await db.query(query)
      return utils.response.success(res, { top: rows })
    } catch (error) {
      return utils.response.error(res, 'Ошибка при составлении топа')
    }
  }
}

module.exports = Top
