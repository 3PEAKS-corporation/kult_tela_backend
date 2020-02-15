const { utils, db } = require('../../services/')
const { DATA } = require('../../data/')

const Public = {
  async getUserById(req, res) {
    const { id } = req.params
    const me_id = req.currentUser.id

    const query = `SELECT * FROM users_public WHERE id=$1 AND id!=$2`
    const values = [id, me_id]

    try {
      const { rows } = await db.query(query, values)
      let user = rows[0]
      if (user) {
        const plans = JSON.parse(JSON.stringify(DATA.plans))
        user.plan_name = plans.filter(item => item.id === user.plan_id)[0].name
        user.avatar_src = utils.getImageUrl(user.avatar_src)
        return utils.response.success(res, user)
      } else return utils.response.error(res, 'Пользователь не найден')
    } catch (e) {
      return utils.response.error(res, 'Пользователь не найден')
    }
  }
}

module.exports = Public
