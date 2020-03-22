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
            'Здравия желаю! С сегодняшнего дня я являюсь вашим персональным диетологом! В списке ваших сообщений есть беседа со мной, где вы можете задавать любые вопросы. \n Я в сети ежедневно с 14 до 15ч. по Москве. Если у вас есть вопрос тет-а-тет, вы можете задать его здесь, в личных сообщениях. \n Рекомендую также отправлять отчеты по питанию в разделе "персональное меню", я буду их просматривать!'
        })
        await AdminEmail.newStudent(dietolog.email)
      }
      return true
    } catch (e) {
      return false
    }
  },
  async convWithDietolog(userId, removeUser = false) {
    let query

    userId = parseInt(userId)

    if (!removeUser) {
      query = `UPDATE chat_rooms SET user_ids = user_ids || ${userId} WHERE name='Общий чат с диетологом' AND conversation=true`
    } else {
      query = `UPDATE chat_rooms SET user_ids = array_remove(user_ids, ${userId}) WHERE name='Общий чат с диетологом' AND conversation=true`
    }

    try {
      await db.query(query)
      return true
    } catch (e) {
      console.log('diet err', e)
      return false
    }
  }
}

module.exports = InitRooms
