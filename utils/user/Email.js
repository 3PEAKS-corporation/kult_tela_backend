const { email: sendEmail, utils } = require('../../services/')
const { env } = require('../../config/')

const Email = {
  async firstLogin(email, hash) {
    sendEmail(email, {
      html: utils.generateEmail({
        title: 'Здравия желаю, рядовой!',
        body:
          'Добро пожаловать в ряды Армии безопасного похудения! <br /> Для продолжения регистрации пройдите по ссылке ниже.',
        link: {
          text: 'Продолжить регистрацию',
          url: env.SITE_URL + 'first-login/' + hash
        }
      }),
      subject: 'Продолжить регистрацию в Культ Тела'
    })
  },
  async passwordReset(email, hash) {
    sendEmail(email, {
      html: utils.generateEmail({
        title: 'Здравия желаю!',
        body:
          'Для продолжения сброса пароля перейдите по ссылке ниже. Если вы не оставляли запрос на сброс пароля - просто проигнорируйте это письмо, ваши данные останутся в безопасности.',
        link: {
          text: 'Сбросить пароль',
          url: env.SITE_URL + 'reset-password/' + hash
        }
      }),
      subject: 'Сброс пароля от учетной записи Культ Тела'
    })
  }
}

module.exports = Email
