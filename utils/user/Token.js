const { db } = require('../../services/')

const Token = {
  async getUserByToken(token) {
    if (!token) return null

    const query = `SELECT users.id as id, users.plan_id as plan_id FROM tokens
                    LEFT JOIN users
                    ON tokens.user_id = users.id
                    WHERE token =$1`

    const values = [token]

    try {
      const { rows } = await db.query(query, values)
      if (!rows[0].id) return null
      else {
        const user = rows[0]
        return user
      }
    } catch (error) {
      return null
    }
  }
}

module.exports = Token
