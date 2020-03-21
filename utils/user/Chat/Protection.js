const { db } = require('../../../services')

/**
 * @params {userObject: {id, plan_id, admin_role_id}}
 * @returns {boolean} is chat allowed
 */
const isChatAllowed = (user1, user2) => {
  if (
    typeof user1.plan_id !== 'number' &&
    typeof user1.admin_role_id !== 'number'
  )
    return false
  if (
    typeof user2.plan_id !== 'number' &&
    typeof user2.admin_role_id !== 'number'
  )
    return false

  let allow = false
  if (typeof user1.plan_id === 'number') {
    if (typeof user2.plan_id === 'number') allow = true
    else if (!user2.plan_id && typeof user2.admin_role_id === 'number') {
      if (user2.admin_role_id === 0 || user2.admin_role_id === -1) allow = true
      // админ
      else if (user2.admin_role_id === 1) {
        // диетолог
        if (user1.plan_id > 1) allow = true
      } else if (user2.admin_role_id === 2) {
        // наставник
        if (
          user1.plan_id > 2 &&
          typeof user1.tutor_id === 'number' &&
          user1.tutor_id === user2.id
        )
          allow = true
      }
    }
  }
  return allow
}

const isMessageAllowed = async (fromUserId, toUserId) => {
  if (typeof fromUserId !== 'number' || typeof toUserId !== 'number')
    return false

  const uids = fromUserId + ',' + toUserId
  let query = `SELECT id, admin_role_id, plan_id, tutor_id FROM users WHERE id IN (${uids});`
  try {
    const { rows: users } = await db.query(query)
    if (users.length !== 2) return false

    const fromUser = users.filter(e => e.id === fromUserId)[0]
    const toUser = users.filter(e => e.id === toUserId)[0]

    let chatAllowed = isChatAllowed(fromUser, toUser)
    if (!chatAllowed) chatAllowed = isChatAllowed(toUser, fromUser)
    return chatAllowed
  } catch (e) {
    return null
  }
}

module.exports = {
  isMessageAllowed
}
