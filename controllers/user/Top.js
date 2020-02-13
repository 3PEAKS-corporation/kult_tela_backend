const { db, utils } = require('../../services')

const Top = {
  async lastMonth(req, res) {
    const query = `SELECT id, rank, weight_start, weight_diff, first_name, last_name, avatar_src
                    FROM users 
                    WHERE (arr_last_item(weight_history)->>'weight')::real IS NOT NULL 
                    AND rank!=0
                    AND (arr_last_item(weight_history)->>'date')::timestamp + interval '1 month' > current_timestamp
                    ORDER BY weight_start-(arr_last_item(weight_history)->>'weight')::real DESC`

    try {
      const { rows } = await db.query(query)
      const top = rows.map(e => {
        e.avatar_src = utils.getImageUrl(e.avatar_src)
        return e
      })
      return utils.response.success(res, { top })
    } catch (error) {
      return utils.response.error(res, 'Ошибка при составлении топа')
    }
  },

  async allTime(req, res) {
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
