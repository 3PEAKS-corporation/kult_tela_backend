const { utils, db } = require('../../../services/')
const {
  User: { Photo, Common: _Common }
} = require('../../../utils/')

const updateOne = async (name, value, userId) => {
  if (value) {
    const query = `UPDATE users SET ${name}=$1 WHERE id=$2`
    const values = [value, userId]
    await db.query(query, values)
  }
}

const Common = {
  async updateInfo(req, res) {
    const new_avatar = req.file
    const { first_name, last_name, patronymic, height, age } = req.body

    if (
      !first_name &&
      !last_name &&
      !height &&
      !age &&
      !new_avatar &&
      !patronymic
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

      const user = await _Common.getUserData(userId)

      return utils.response.success(res, user)
    } catch (error) {
      return utils.response.error(res, 'Не удалось обновить данные')
    }
  }
}

module.exports = Common
