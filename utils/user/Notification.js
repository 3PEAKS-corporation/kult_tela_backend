const { db } = require('../../services/')

const Notification = {
  async add(userId, { title, url }) {
    const query = `UPDATE users SET notifications = array_append(notifications, jsonb_build_object(
      'id', arr_length(notifications),
      'title', $1::varchar,
      'url', $2::varchar,
      'date', current_timestamp
    )::jsonb)
    WHERE id=$3
    RETURNING TRUE`
    const values = [title, url || 'null', userId]
    try {
      await db.query(query, values)
    } catch (error) {}
  }
}

module.exports = Notification
