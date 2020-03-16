const { utils, db } = require('../../services/')

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
    const { first_name, last_name, admin_description } = req.body

    if (!first_name && !last_name && !admin_description && !new_avatar)
      return utils.response.error(res)

    const userId = req.currentUser.id

    try {
      if (new_avatar) {
        const filename = req.file.filename
        await updateOne('avatar_src', filename, userId)
      }

      await updateOne('first_name', first_name, userId)
      await updateOne('last_name', last_name, userId)
      await updateOne('admin_description', admin_description, userId)

      return utils.response.success(res)
    } catch (error) {
      return utils.response.error(res, 'Не удалось обновить данные')
    }
  }
}

module.exports = Common
