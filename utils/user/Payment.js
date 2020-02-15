const { db } = require('../../services/')

const Payment = {
  async add(userId, { reason, amount, key }) {
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
      return true
    } catch (error) {
      return false
    }
  },
  async create(userId, key, type, value) {
    const query = `INSERT INTO payments(user_id, key, type, value) VALUES ($1, $2, $3, $4) RETURNING *;`
    const values = [userId, key, type, value]

    try {
      const { rows } = await db.query(query, values)
      const payment = rows[0]
      if (payment) return payment
      else return null
    } catch (e) {
      return false
    }
  },
  async setStatus(status, { id, key }) {
    if (!id && !key) return false
    console.log('sarrrdas')
    const query = `UPDATE payments SET status='${status}' WHERE ${
      id ? 'id=' + parseInt(id) : 'key=' + key
    }`
    try {
      await db.query(query)
      return true
    } catch (e) {
      console.log(e)
      return false
    }
  }
}

module.exports = Payment
