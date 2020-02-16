const { db } = require('../../services/')

const Payment = {
  async create(userId, key, type, value) {
    const query = `INSERT INTO payments(user_id, key, type, value) VALUES ($1, $2, $3, $4) RETURNING *;`
    const values = [userId, key, type, value]

    try {
      const { rows } = await db.query(query, values)
      const payment = rows[0]
      if (payment) return payment
      else return null
    } catch (e) {
      return false
    }
  },
  async setStatus(status, { id, key }) {
    if (!id && !key) return false
    const query = `UPDATE payments SET status='${status}' WHERE ${
      id ? 'id=' + parseInt(id) : `key='${key}'`
    } RETURNING user_id`
    try {
      const { rows } = await db.query(query)
      if (rows[0] && rows[0].user_id) return rows[0]
      else return false
    } catch (e) {
      console.log(e)
      return false
    }
  }
}

module.exports = Payment
