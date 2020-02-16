const { utils, db } = require('../../services/')
const { DATA } = require('../../data/')

const Roles = {
  getAll(req, res) {
    return utils.response.success(res, DATA.admin_roles)
  }
}

module.exports = Roles
