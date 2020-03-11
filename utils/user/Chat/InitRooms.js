const { db, utils } = require('../../../services')
const { copyDATA } = require('../../../data/')
const Message = require('./Message')
const AdminEmail = require('../../admin/Email')

const InitRooms = {
  async withDietolog(userId) {
    const query = `SELECT id, email FROM users WHERE admin_role_id=1`

    try {
      const { rows } = await db.query(query)
      const dietolog = rows[0]
      if (dietolog) {
        await Message.addMessage({
          fromUserId: dietolog.id,
          toUserId: userId,
          text:
            'Здравия желаю! С сегодняшнего дня я являюсь вашим персональным диетологом! По любым вопросам касательно питания - можете спрашивать меня! У нас чат тет-а-тет. Рекомендую также отправлять отчеты по питанию в разделе "персональное меню"!'
        })
        await AdminEmail.newStudent(dietolog.email)
      }
      return true
    } catch (e) {
      return false
    }
  }
}

module.exports = InitRooms
