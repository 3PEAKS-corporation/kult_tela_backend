const { utils, db } = require('../../services/')

const Support = {
  async getAdminId(req, res) {
    const query = `SELECT id FROM users WHERE admin_role_id=0`
    try {
      const { rows } = await db.query(query)
      if (!rows)
        return utils.response.error(
          res,
          'Все администраторы заняты, попробуйте позднее'
        )
      else {
        if (rows.length === 1)
          return utils.response.success(res, { id: rows[0].id })
        else if (rows.length > 1) {
          const id = rows[Math.floor(Math.random() * rows.length)]
          return utils.response.success(res, { id })
        }
      }
    } catch (e) {
      return utils.response.error(
        res,
        'Все администраторы заняты, попробуйте позднее'
      )
    }
  }
}

module.exports = Support
