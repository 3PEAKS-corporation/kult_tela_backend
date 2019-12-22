const { utils, db, token: _token, mail } = require('../../../services/')

const Notification = {
  async setLastSeen(req, res) {
    const { id } = req.params
    if (!id) return utils.response.error(res)

    const query = `UPDATE users SET notifications_last_seen=$1 WHERE id=$2`
    const values = [id, req.currentUser.id]
    try {
      await db.query(query, values)
      return utils.response.success(res)
    } catch (error) {
      return utils.response.error(res, 'Ошибка обновления оповещений!')
    }
  },
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
