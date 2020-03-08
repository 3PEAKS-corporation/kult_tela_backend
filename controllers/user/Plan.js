const { utils, db, kassa } = require('../../services/')
const { copyDATA } = require('../../data/')
const { User } = require('../../utils/')

const Plan = {
  getPublicInfo(req, res) {
    return utils.response.success(res, copyDATA('plans'))
  }
}

module.exports = Plan
