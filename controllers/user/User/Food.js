const { utils, db } = require('../../../services/')
const Photo = require('./Photo')

const Food = {
  async setCurrentFoodMenu(userId) {
    const menuId = 0
    // TODO: расчет id плана питания
    const query = `UPDATE users SET food_menu_id=$1 WHERE id=$2`
    const values = [menuId, userId]

    try {
      console.log(await db.query(query, values))
    } catch (error) {
      throw error
    }
  }
}

const getCurrentDate = () => {
  const d = new Date()
  return `${d.getDate()}.${d.getMonth() + 1}.${d.getFullYear()}`
}

const getReportStatus = async userId => {
  const query = `SELECT food_reports FROM users WHERE id=$1`
  const values = [userId]

  const { rows } = await db.query(query, values)

  const reps = rows[0].food_reports
  const result = [false, false, false, false]

  if (reps && reps.length !== 0) {
    const date = getCurrentDate()
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

const FoodReport = {
  async getStateOfReport(req, res) {
    const result = await getReportStatus(req.currentUser.id)
    return utils.response.success(res, result)
  },
  async addReport(req, res) {
    const { names } = req.body
    const userId = req.currentUser.id
    const images = req.files

    if (images.length == 0 || !names)
      return utils.response.error(res, 'Нет прикрепленных изображений')

    const date = getCurrentDate()

    const reports = names
      .filter(item => item !== 'null')
      .map((item, i) => {
        return { type: item, image_src: images[i].filename, date }
      })

    images.forEach(image => {
      Photo.add(req.currentUser.id, image.filename, 'FOOD_REPORT')
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

      const reportStatus = await getReportStatus(userId)

      return utils.response.success(res, reportStatus)
    } catch (error) {
      return utils.response.error(res, 'Не удалось загрузить отчет')
    }
  }
}

module.exports = { ...Food, ...FoodReport }
