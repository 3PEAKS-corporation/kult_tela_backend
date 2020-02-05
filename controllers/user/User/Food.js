const { utils, db } = require('../../../services/')
const { User } = require('../../../utils/')

const Food = {
  async getStateOfReport(req, res) {
    const result = await User.Food.getReportStatus(req.currentUser.id)
    return utils.response.success(res, result)
  },
  async addReport(req, res) {
    const { names } = req.body
    const userId = req.currentUser.id
    const images = req.files

    if (images.length == 0 || !names)
      return utils.response.error(res, 'Нет прикрепленных изображений')

    const date = utils.getCurrentDate()

    const reports = names
      .filter(item => item !== 'null')
      .map((item, i) => {
        return { type: item, image_src: images[i].filename, date }
      })

    images.forEach(image => {
      User.Photo.add(req.currentUser.id, image.filename, 'FOOD_REPORT')
    })

    const query = `UPDATE users SET food_reports = array_append(food_reports, jsonb_build_object(
      'id', arr_length(food_reports),
      'type', $1::varchar,
      'image_src', $2::varchar,
      'date', $3::varchar
    )::jsonb)
    WHERE id=$4
    RETURNING TRUE`
    let values

    try {
      for (const item of reports) {
        values = [item.type, item.image_src, item.date, userId]
        await db.query(query, values)
      }
      const reportStatus = await User.Food.getReportStatus(userId)

      return utils.response.success(res, reportStatus)
    } catch (error) {
      return utils.response.error(res, 'Не удалось загрузить отчет')
    }
  }
}

module.exports = Food
