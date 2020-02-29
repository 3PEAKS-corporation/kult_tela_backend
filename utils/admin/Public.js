const { db, utils } = require('../../services/')
const { copyDATA } = require('../../data/')

const Public = {
  async getUserInfo(userId) {
    const query = `SELECT *, to_char(date_signup,'DD.MM.YYYY') as date_signup_formatted FROM users WHERE id=$1 AND admin_role_id IS NULL`
    const values = [userId]
    try {
      const { rows } = await db.query(query, values)
      if (rows[0]) {
        let user = rows[0]

        const plans = copyDATA().plans
        user.plan_name = plans.filter(e => e.id === user.plan_id)[0].name
        user.name =
          user.last_name + ' ' + user.first_name + ' ' + user.patronymic

        user.date_signup = user.date_signup_formatted
        delete user.date_signup_formatted
        delete user.password
        delete user.photos
        delete user.notifications
        delete user.notifications_last_seen
        delete user.history
        user.avatar_src = utils.getImageUrl(user.avatar_src)
        return user
      } else return false
    } catch (e) {
      return null
    }
  }
}

module.exports = Public
