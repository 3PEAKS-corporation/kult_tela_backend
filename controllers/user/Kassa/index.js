const { utils } = require('../../../services')
const { User } = require('../../../utils')
const { switchTypes } = require('./types')

const kassaIps = [
  '185.71.76.0/27',
  '185.71.77.0/27',
  '77.75.153.0/25',
  '77.75.154.128/25',
  '2a02:5180:0:1509::/64',
  '2a02:5180:0:2655::/64',
  '2a02:5180:0:1533::/64',
  '2a02:5180:0:2669::/64'
]

const Kassa = {
  async consumeNotification(req, res) {
    const notification = req.body
    console.log(notification)
    // if (kassaIps.includes(req.connection.remoteAddress) === false)
    //   return utils.response.error(res, 'Ты не Яндекс.Касса')

    if (!notification.event || !notification.object)
      return utils.response.error(res)

    const result = await User.Payment.setStatus(notification.object.status, {
      key: notification.object.id
    })

    if (result.user_id) {
      if (
        notification.object.status === 'succeeded' &&
        notification.object.metadata.type
      ) {
        await switchTypes(result.user_id, notification.object.metadata)
      }

      if (result.user_id) return utils.response.success(res)
    } else return utils.response.error(res, 'Платеж не найден')
  }
}

module.exports = Kassa
