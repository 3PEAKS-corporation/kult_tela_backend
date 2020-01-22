const { utils, db } = require('../../../services/')

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
  }
}

module.exports = Notification
