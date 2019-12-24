const { utils, db, token: _token, mail } = require('../../../services/')

const Photo = {
  async add(userId, src, reason = ' ') {
    const query = `UPDATE users SET photos = array_append(photos, jsonb_build_object(
      'id', arr_length(photos),
      'src', $1::varchar,
      'date', current_timestamp,
      'reason', $2::varchar
    )::jsonb)
    WHERE id=$3
    RETURNING TRUE`
    const values = [src, reason, userId]
    try {
      await db.query(query, values)
    } catch (error) {}
  }
}

module.exports = Photo
