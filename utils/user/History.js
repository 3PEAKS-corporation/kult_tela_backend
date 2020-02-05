const { db } = require('../../services/')

const History = {
  async add(userId, reason, data) {
    const query = `UPDATE users SET history = array_append(history, jsonb_build_object(
      'id', arr_length(history),
      'reason', $1::varchar,
      'data', $2::jsonb,
      'date', current_timestamp
    )::jsonb)
    WHERE id=$3
    RETURNING TRUE`
    const values = [reason, data, userId]
    try {
      await db.query(query, values)
    } catch (error) {}
  }
}

module.exports = History
