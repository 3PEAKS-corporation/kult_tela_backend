const { utils } = require('../../services')
const { User } = require('../../utils')

const switchTypes = async (userId, obj) => {
  const metadata = obj.metadata
  const types = {
    PLAN_EXTEND: async () => {
      if (obj.status === 'succeeded') {
        await User.Subscription.extend(userId, metadata.new_plan_id)
      }
    },
    CONSULTATION_BUY: async () => {
      if (obj.status === 'succeeded')
        await User.Notification.add(userId, {
          title:
            'Оплата онлайн-консультации успешно принята, позже с вами свяжется администратор!'
        })
    },
    PLAN_BUY: async () => {
      if (obj.status === 'canceled')
        await User.Common.deleteUserByHash(obj.metadata.hash)
    },
    PLAN_CHANGE: async () => {
      await User.Plan.changePlan(userId, obj.metadata.new_plan_id)
    }
  }
  if (types[metadata.type]) return types[metadata.type]()
}

module.exports = {
  switchTypes
}
