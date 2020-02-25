const { db, utils } = require('../../services')
const { copyDATA } = require('../../data/')

const Food = {
  async getDailyMenu(req, res) {
    const query = `SELECT food_menu_id as menu_id, to_char((current_timestamp-date_signup),'DD')::int as days_from_start FROM users WHERE id=$1`
    const values = [req.currentUser.id]

    try {
      const { rows } = await db.query(query, values)
      const { menu_id, days_from_start } = rows[0]
      const menu = copyDATA().food_menus.menus.filter(
        item => item.id === menu_id
      )[0]

      const day_id =
        days_from_start === 0
          ? 0
          : days_from_start -
            Math.floor(days_from_start / menu.days.length) * menu.days.length
      if (menu)
        return utils.response.success(res, {
          ...menu.days[day_id],
          info: menu.info
        })
      else return utils.response.error(res, 'Меню не найдено')
    } catch (error) {
      console.log(error)
      return utils.response.error(res, 'Не удалось загрузить меню')
    }
  },
  async getTipsVideos(req, res) {
    const plan_id = req.currentUser.plan_id
    const videos = copyDATA().food_tips_videos
    let filtered_videos = [...videos.common]
    if (plan_id < 1) {
      filtered_videos = [
        ...videos.common,
        ...videos.secret.map(e => ({ id: e.id, title: e.title }))
      ]
    } else {
      filtered_videos = [...videos.common, ...videos.secret]
    }

    return utils.response.success(res, filtered_videos)
  }
}

module.exports = Food
