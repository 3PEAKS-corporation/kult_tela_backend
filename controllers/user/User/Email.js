const { email: sendEmail } = require('../../../services/')
const { env } = require('../../../config/')

const Email = {
  async firstLogin(email, hash) {
    const body = `
      <h2>Здравия желаю, рядовой ! Добро пожаловать в ряды Армии безопасного похудения!</h2>
      <p>Чтобы продолжить регистрацию, пройдите по ссылке ниже: </p>
      <a href="${env.URL + 'first-login/' + hash}">Продолжить регистрацию</a>
    `
    sendEmail(email, body)
  }
}

module.exports = Email
