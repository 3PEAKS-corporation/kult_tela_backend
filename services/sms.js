const { Client, Message } = require('smsaero-v2')
const { env } = require('../config/')

const client = new Client(env.SMS_AERO_LOGIN, env.SMS_AERO_TOKEN, { timeout: 10000 })

module.exports = {
  async send(text, number) {
    const r = await client.testAuth()

    return await client.send(new Message({
      sign: "SMS Aero",
      number: number.replace("+", ""),
      text
    }))
  }
}
