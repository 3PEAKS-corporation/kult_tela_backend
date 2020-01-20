const { utils, db } = require('../../../services/')
const { DATA } = require('../../../data/')
const Photo = require('./Photo')

const updateOne = async (name, value, userId) => {
  if (value) {
    const query = `UPDATE users SET ${name}=$1 WHERE id=$2`
    const values = [value, userId]
    await db.query(query, values)
  }
}

const getPublicUserData = async userId => {
  const query = `SELECT id, first_name || ' ' || last_name as name, rank, avatar_src  FROM users WHERE id=$1`
  const values = [userId]

  try {
    const { rows } = await db.query(query, values)
    const user = rows[0]
    if (user) {
      user.avatar_src = utils.getImageUrl(user.avatar_src)
      return user
    } else return null
  } catch (error) {
    return null
  }
}

const getUserData = async (key, isEmail = false, returnPassword = false) => {
  let query
  if (!isEmail)
    query = `SELECT *, to_char(date_signup,'DD.MM.YYYY') as date_signup_formatted FROM users WHERE id=$1`
  else
    query = `SELECT *, to_char(date_signup,'DD.MM.YYYY') as date_signup_formatted FROM users WHERE email=$1`

  const values = [key]

  try {
    const { rows } = await db.query(query, values)
    if (rows[0]) {
      let user = rows[0]
      user.date_signup = user.date_signup_formatted
      user.avatar_src = utils.getImageUrl(user.avatar_src)
      user.plan_name = DATA.plans.filter(
        item => item.id == user.plan_id
      )[0].name
      delete user.date_signup_formatted
      if (returnPassword === false) delete user.password
      delete user.payments
      delete user.food_reports
      delete user.photos
      return user
    } else return null
  } catch (error) {
    return null
  }
}

const Common = {
  getUserData,
  getPublicUserData,
  async updateInfo(req, res) {
    const new_avatar = req.file
    const { first_name, last_name, patronymic, height, age } = req.body

    if (
      !first_name &&
      !last_name &&
      !patronymic &&
      !height &&
      !age &&
      !new_avatar
    )
      return utils.response.error(res)

    const userId = req.currentUser.id

    try {
      if (new_avatar) {
        const filename = req.file.filename

        await updateOne('avatar_src', filename, userId)
        await Photo.add(userId, filename, 'AVATAR_UPDATE')
      }

      await updateOne('first_name', first_name, userId)
      await updateOne('last_name', last_name, userId)
      await updateOne('patronymic', patronymic, userId)
      await updateOne('height', height, userId)
      await updateOne('age', age, userId)

      const user = await getUserData(userId)

      return utils.response.success(res, user)
    } catch (error) {
      return utils.response.error(res, 'Не удалось обновить данные')
    }
  }
}

module.exports = Common
