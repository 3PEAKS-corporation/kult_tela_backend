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
  },
  async updateWorkout(req, res) {},
  async addPayment(userId, { reason, amount, key }) {
    const query = `UPDATE users SET payments = array_append(payments, jsonb_build_object(
      'id', arr_length(payments),
      'key', $1::varchar,
      'reason', $2::varchar,
      'amount', $3::real,
      'date', current_timestamp
    )::jsonb)
    WHERE id=$4
    RETURNING TRUE`
    const values = [key, reason, amount, userId]
    try {
      await db.query(query, values)
    } catch (error) {}
  },
  async addNotification(userId) {},
  async addPhoto(userId, src) {
    const query = `UPDATE users SET photos = array_append(photos, jsonb_build_object(
      'id', arr_length(photos),
      'src', $1::varchar,
      'date', current_timestamp
    )::jsonb)
    WHERE id=$2
    RETURNING TRUE`
    const values = [src, userId]
    try {
      await db.query(query, values)
    } catch (error) {}
  }
}

module.exports = User
