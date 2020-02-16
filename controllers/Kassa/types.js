const { utils } = require('../../services')
const { User } = require('../../utils')

const switchTypes = async (userId, { type, ...metadata }) => {
  console.log(type, metadata)
  if (type === 'PLAN_EXTEND') {
    return await User.Subscription.extend(userId, metadata.new_plan_id)
  }
}

module.exports = {
  switchTypes
}
