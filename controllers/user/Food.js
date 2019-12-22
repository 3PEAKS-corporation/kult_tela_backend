const { db, utils } = require('../../services')
const { DATA } = require('../../data/')

const Food = {
  async getDailyMenu(req, res) {
    const query = `SELECT (food->>'menu_id')::int as menu_id, to_char((current_timestamp-date_signup),'DD')::int as days_from_start FROM users WHERE id=$1`
    const values = [req.currentUser.id]

    try {
      const { rows } = await db.query(query, values)
      const { menu_id, days_from_start } = rows[0]

      const menu = DATA.menus.filter(item => item.id === menu_id)[0]

      const day_id =
        days_from_start === 0
          ? 0
          : days_from_start -
            Math.floor(days_from_start / menu.days.length) * menu.days.length -
            1

      if (menu) return utils.response.success(res, menu.days[day_id])
      else return utils.response.error(res, 'Меню не найдено')
    } catch (error) {
      return utils.response.error(res, 'Не удалось загрузить меню')
    }
  }
}

module.exports = Food
