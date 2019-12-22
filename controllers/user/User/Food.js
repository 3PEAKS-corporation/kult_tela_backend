const { utils, db } = require('../../../services/')

const Food = {
  async setCurrentFoodMenu(userId) {
    menuId = 1
    const query = `UPDATE users SET food = jsonb_set(food,'{menu_id}'::text[], $1) WHERE id=$2`
    const values = [menuId, userId]

    try {
      await db.query(query, values)
    } catch (error) {
      throw error
    }
  }
}

module.exports = Food
