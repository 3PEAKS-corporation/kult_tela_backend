const { db } = require('../../services/')

const Weight = {
  async addToHistory(userId, new_weight) {
    new_weight = new_weight.split(',').join('.')

    const query = `
        UPDATE users
        SET weight_history = array_append(weight_history, jsonb_build_object(
                'id', arr_length(weight_history),
                'weight', $1::real,
                'date', TO_CHAR(current_timestamp, 'DD.MM.YYYY HH24:MI')
            )::jsonb)
        WHERE id=$2
        RETURNING rank, weight_diff
    `
    const values = [new_weight, userId]

    try {
      const { rows } = await db.query(query, values)
      if (rows[0]) return rows[0]
      else return false
    } catch (error) {
      return false
    }
  }
}

module.exports = Weight
