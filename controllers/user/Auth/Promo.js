const bcrypt = require('bcrypt')
const { utils, db, token: _token } = require('../../../services')
const { User } = require('../../../utils/')

const Promo = {
  async getStatus(req, res) {
    const code = req.body.code

    if (!code) return utils.response.error(res)

    const status = await User.Promo.getStatus(code)

    if (!status) return utils.response.error(res, 'Недействительный промокод')
    else if (typeof status.plan_id === 'number')
      return utils.response.success(res, { plan_id: status.plan_id })
  }
}

module.exports = Promo
