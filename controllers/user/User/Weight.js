const { utils, db } = require('../../../services/')
const { User } = require('../../../utils/')

const Weight = {
  async update(req, res) {
    let { new_weight } = req.body
    if (!new_weight) return utils.response.error(res)

    const r = await User.Weight.addToHistory(req.currentUser.id, new_weight)
    if (r) return utils.response.success(res, r)
    else return utils.response.error(res, 'Не удалось обновить вес')
  }
}

module.exports = Weight
