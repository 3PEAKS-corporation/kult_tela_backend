const { env } = require('../config')
const { YooCheckout } = require('@a2seven/yoo-checkout')
const bcrypt = require('bcrypt')

const checkout = new YooCheckout({ shopId: env.KASSA_ID, secretKey: env.KASSA_KEY })

const idempotenceKey = () => {
  const random = Math.random().toString()
  const random2 = Math.random().toString()
  const date = new Date().valueOf().toString()
  return bcrypt
    .hashSync(random + date + env.SECRET + random2, 2)
    .substring(0, 30)
}

const createPayment = ({ value, description, return_url, ...options }) => {
  const key = idempotenceKey()
  return new Promise((resolve, reject) => {
    checkout
      .createPayment(
        {
          ...options,
          amount: {
            value,
            currency: 'RUB'
          },
          capture: true,
          payment_method_data: {
            type: 'bank_card'
          },
          confirmation: {
            type: 'redirect',
            return_url: env.SITE_URL + (return_url || '')
          },
          description: description || 'Оплата услуг в приложении "Культ Тела"'
        },
        key
      )
      .then(res => {
        resolve(res)
      })
      .catch(err => {
        reject(err)
      })
  })
}

const getPaymentStatus = async key => {
  return new Promise((resolve, reject) => {
    checkout
      .getPayment(key)
      .then(res => {
        resolve(res)
      })
      .catch(err => {
        reject(err)
      })
  })
}

module.exports = {
  createPayment,
  getPaymentStatus
}
