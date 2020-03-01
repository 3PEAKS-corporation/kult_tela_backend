const { db } = require('../../services/')

const Token = {
  async getUserByToken(token) {
    if (!token) return null

    const query = `UPDATE users a
                   SET last_online = current_timestamp
                   FROM tokens b
                   WHERE
                       b.user_id = a.id AND b.token=$1
                   RETURNING a.id as id, a.plan_id as plan_id, a.subscription_exp > current_timestamp as is_subscription,
                       a.admin_role_id as admin_role_id`

    const values = [token]

    try {
      const { rows } = await db.query(query, values)
      let user = rows[0]
      if (user) {
        if (typeof user.admin_role_id !== 'number') delete user.admin_role_id
        else if (typeof user.admin_role_id === 'number') {
          delete user.plan_id
          delete user.is_subscription
        }
        return user
      } else return null
    } catch (error) {
      return null
    }
  }
}

module.exports = Token
