const { db } = require('../../services/')

const Promo = {
  async getStatus(code, setUsed = false) {
    if (typeof code !== 'string') code = code.toString()
    let query
    if (setUsed === true) {
      query = `UPDATE promo_codes SET used=true WHERE key=$1 AND (used=false OR infinite=true) RETURNING *`
    } else {
      query = `SELECT * FROM promo_codes WHERE key=$1 AND (used=false OR infinite=true)`
    }
    const values = [code]
    try {
      const { rows } = await db.query(query, values)
      if (rows && rows[0]) return rows[0]
      else return false
    } catch (e) {
      return false
    }
  }
}

module.exports = Promo
