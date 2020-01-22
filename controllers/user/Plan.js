const { utils, db } = require('../../services/')
const { DATA } = require('../../data/')

const Plan = {
  getPublicInfo(req, res) {
    return utils.response.success(res, DATA.plans)
  }
}

module.exports = Plan
