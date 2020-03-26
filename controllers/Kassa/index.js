const { utils } = require('../../services')
const { User } = require('../../utils')
const { switchTypes } = require('./types')
const fs = require('fs')
const Netmask = require('netmask').Netmask

const kassaIps = [
  '185.71.76.0/27',
  '185.71.77.0/27',
  '77.75.153.0/25',
  '77.75.154.128/25'
  /*'2a02:5180:0:1509::/64',
          '2a02:5180:0:2655::/64',
          '2a02:5180:0:1533::/64',
          '2a02:5180:0:2669::/64'*/
]

const Kassa = {
  async consumeNotification(req, res) {
    const notification = req.body

    const fip = req.headers['x-forwarded-for'] || req.connection.remoteAddress

    let isIp = false
    try {
      kassaIps.some(ip => {
        const block = new Netmask(ip)
        if (block.contains(fip)) {
          isIp = true
          return true
        }
      })
    } catch (e) {
      console.log('err', e)
      return utils.response.error(res, 'Ты не Яндекс.Касса')
    }

    if (!isIp) return utils.response.error(res, 'Ты не Яндекс.Касса')

    if (!notification.event || !notification.object)
      return utils.response.error(res)

    const result = await User.Payment.setStatus(notification.object.status, {
      key: notification.object.id
    })

    if (result.user_id) {
      if (notification.object.status && notification.object.metadata.type) {
        await switchTypes(result.user_id, notification.object)
      }

      if (result.user_id) return utils.response.success(res)
    } else return utils.response.error(res, 'Платеж не найден')
  }
}

module.exports = Kassa
