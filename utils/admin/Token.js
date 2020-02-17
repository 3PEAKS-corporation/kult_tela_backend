const { db } = require('../../services/')

const Token = {
  async getAdminByToken(token) {
    if (!token) return null

    const query = `SELECT users.id as id, users.admin_role_id as admin_role_id
                   FROM tokens
                            LEFT JOIN users
                                      ON tokens.user_id = users.id
                   WHERE token =$1`
    const values = [token]

    try {
      const { rows } = await db.query(query, values)
      if (!rows[0].id) return null
      else {
        const admin = rows[0]
        if (typeof admin.admin_role_id !== 'number') return null
        else return rows[0]
      }
    } catch (error) {
      console.log(error)
      return null
    }
  }
}

module.exports = Token
