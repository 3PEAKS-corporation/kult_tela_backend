const { email: sendEmail, utils } = require('../../services/')
const { env } = require('../../config/')

const Email = {
  async newStudent(email) {
    sendEmail(email, {
      html: utils.generateEmail({
        title: 'Новый ученик!',
        body:
          'У вас новый ученик, проверьте личные сообщения в панели управления!',
        link: {
          text: 'К панели управления',
          url: env.ADMIN_URL
        }
      }),
      subject: 'Оповещение Культ Тела'
    })
  }
}

module.exports = Email
