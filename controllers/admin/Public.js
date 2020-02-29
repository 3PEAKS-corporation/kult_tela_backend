const { utils, db } = require('../../services/')
const { Admin } = require('../../utils/')

const Public = {
  async getUserInfo(req, res) {
    const user_id = parseInt(req.params.user_id)

    if (typeof user_id !== 'number') return utils.response.error(res)

    const user = await Admin.Public.getUserInfo(user_id)
    if (!user) return utils.response.error(res, 'Пользователь не существует')

    return utils.response.success(res, user)
  }
}

module.exports = Public
