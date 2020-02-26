const { db, utils } = require('../../../services')
const { SOCKETS_CHAT } = require('../../../sockets/models')
const { copyDATA } = require('../../../data/')
const Message = require('./Message')

const InitRooms = {
  async withDietolog(userId) {
    const query = `SELECT id FROM users WHERE admin_role_id=1`

    try {
      const { rows } = await db.query(query)
      const dietolog_id = rows[0] && rows[0].id
      if (typeof dietolog_id === 'number') {
        await Message.initRoomWithMessage({
          fromUserId: dietolog_id,
          toUserId: userId,
          text:
            'Здравия желаю! С сегодняшнего дня я являюсь вашим персональным диетологом! По любым вопрсам касательно питания - можете спрашивать меня!'
        })
      }
      return true
    } catch (e) {
      console.log(e)
      return false
    }
  }
}

module.exports = InitRooms
