const { utils, db, token: _token, mail } = require('../../services/')
const User = {
  async updateWeight(req, res) {
    let { new_weight } = req.body
    if (!new_weight) return utils.response.error(res)

    new_weight = new_weight.split(',').join('.')

    const query = `
      UPDATE users
      SET weight_history = array_append(weight_history, jsonb_build_object(
      'id', arr_length(weight_history),
      'weight', $1::real, 
      'date', current_timestamp
      )::jsonb)
      WHERE id=$2
      RETURNING rank, weight_diff
      `
    const values = [new_weight, req.currentUser.id]

    try {
      const { rows } = await db.query(query, values)
      return utils.response.success(res, rows[0])
    } catch (error) {
      return utils.response.error(res, 'Не удалось обновить вес')
    }
  }
}

module.exports = User
