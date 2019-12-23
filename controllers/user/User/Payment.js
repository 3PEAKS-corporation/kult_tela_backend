const { db } = require('../../../services/')

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
    } catch (error) {}
  }
}

module.exports = Payment
