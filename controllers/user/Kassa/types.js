const { utils } = require('../../../services')
const { User } = require('../../../utils')

const switchTypes = async (userId, { type, ...metadata }) => {
  console.log(type, metadata)
  if (type === 'PLAN_EXTEND') {
    return await User.Subscription.extend(userId, metadata.new_plan_id)
  } else if (type === 'CONSULTATION_BUY') {
    await User.Notification.add(userId, {
      title:
        'Оплата онлайн-консультации успешно принята, позже с вами свяжется администратор'
    })
  }
}

module.exports = {
  switchTypes
}
