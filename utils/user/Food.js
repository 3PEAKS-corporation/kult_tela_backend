const { db, utils } = require('../../services/')

const Food = {
  async setCurrentFoodMenu(userId) {
    const menuId = 0
    // TODO: расчет id плана питания
    const query = `UPDATE users SET food_menu_id=$1 WHERE id=$2`
    const values = [menuId, userId]

    try {
      await db.query(query, values)
    } catch (error) {
      console.log(error)
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
