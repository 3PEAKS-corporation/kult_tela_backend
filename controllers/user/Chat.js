const { db, utils } = require('../../services')
const { User } = require('../../utils/')
const { SOCKETS_CHAT } = require('../../sockets/models/')
const { copyDATA } = require('../../data/')

const Chat = {
  async getById(req, res) {
    const user_id = parseInt(req.params.user_id)
    const currentUser = req.currentUser
    const isConversation = (req.query.c == 'true' && true) || false

    if (typeof user_id !== 'number' || user_id === currentUser.id)
      return utils.response.error(res, 'Чат не существует!')

    let meta = { all: false }
    if (!isConversation) {
      meta = {
        currentUserId: currentUser.id,
        all: false,
        userId: user_id
      }
    } else {
      meta = {
        conversation: {
          id: user_id
        }
      }
    }

    const chat = await User.Chat.Room.get(meta)
    if (chat && chat.length > 0) return utils.response.success(res, chat[0])
    else return utils.response.error(res, 'Чат не существует!')
  },
  async getAll(req, res) {
    const userId = req.currentUser.id
    const chats = await User.Chat.Room.get({
      currentUserId: userId,
      all: true
    })

    if (chats || chats === []) return utils.response.success(res, chats)
    else if (chats === null)
      return utils.response.error(res, 'Ошибка загрузки сообщений')
  }
}

module.exports = Chat
