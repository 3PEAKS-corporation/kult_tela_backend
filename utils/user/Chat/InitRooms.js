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
            'Здравия желаю! С сегодняшнего дня я являюсь вашим персональным диетологом! По любым вопрсам касательно питания - можете спрашивать меня!'
        })
        await AdminEmail.newStudent(dietolog.email)
      }
      return true
    } catch (e) {
      console.log(e)
      return false
    }
  }
}

module.exports = InitRooms
