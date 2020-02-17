const { db } = require('../../services/')

const Token = {
  async getUserByToken(token) {
    if (!token) return null

    const query = `SELECT users.id as id, users.plan_id as plan_id, users.subscription_exp > current_timestamp as is_subscription,
       users.admin_role_id as admin_role_id
                    FROM tokens
                    LEFT JOIN users
                    ON tokens.user_id = users.id
                    WHERE token =$1`

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
