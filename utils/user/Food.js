const { db, utils } = require('../../services/')
const { copyDATA } = require('../../data/')

const Food = {
  async setCurrentFoodMenu(userId) {
    const menuId = 0
    const food_menus = copyDATA().food_menus
    let query = `SELECT weight_start - COALESCE(0, weight_diff) as current_weight FROM users WHERE id=$1`
    let values = [userId]

    try {
      const { rows } = await db.query(query, values)
      if (rows[0]) {
        const relations = food_menus.relation
        const current_weight = rows[0].current_weight
        let menu_id = relations[Object.keys(relations)[0]]
        for (const weight in relations) {
          if (current_weight > parseInt(weight)) {
            menu_id = relations[weight]
          } else break
        }

        query = `UPDATE users SET food_menu_id=$1 WHERE id=$2`
        values = [menu_id, userId]
        await db.query(query, values)
        return true
      }
    } catch (error) {
      return false
    }
  },
  async getReportStatus(userId) {
    const query = `SELECT food_reports FROM users WHERE id=$1`
    const values = [userId]

    const { rows } = await db.query(query, values)

    const reps = rows[0].food_reports
    const result = [false, false, false, false]

    if (reps && reps.length !== 0) {
      const date = utils.getCurrentDate()
      const reports = reps.filter(item => item.date == date)
      if (reports) {
        reports.forEach(item => {
          const type = item.type
          const _types = {
            Завтрак: () => {
              result[0] = true
            },
            Обед: () => {
              result[1] = true
            },
            Ужин: () => {
              result[2] = true
            },
            Перекус: () => {
              result[3] = true
            }
          }

          if (_types[type]) _types[type]()
        })
      }
    }
    return result
  }
}

module.exports = Food
