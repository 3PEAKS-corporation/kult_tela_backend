const { utils, db, token: _token, mail } = require('../../../services/')

const Photo = {
  async add(userId, src) {
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

module.exports = Photo
