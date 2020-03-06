const { db, utils } = require('../../services/')
const { DATA } = require('./../../data/')
const Food = require('./Food')
const Chat = require('./Chat')
const Notification = require('./Notification')

const Common = {
  async getPublicUserData(userId) {
    const query = `SELECT * FROM users_public WHERE id=$1 AND name IS NOT NULL`
    const values = [userId]

    try {
      const { rows } = await db.query(query, values)
      const user = rows[0]
      if (user) {
        user.avatar_src = utils.getImageUrl(user.avatar_src)
        if (typeof user.admin_role_id !== 'number') delete user.admin_role_id
        return user
      } else return null
    } catch (error) {
      return null
    }
  },
  async getUserData(key, isEmail = false, returnPassword = false) {
    let query
    if (!isEmail)
      query = `SELECT *, to_char(date_signup,'DD.MM.YYYY') as date_signup_formatted, to_char(subscription_exp,'DD.MM.YYYY') as subscription_exp_formatted, subscription_exp > current_timestamp as is_subscription  FROM users WHERE id=$1`
    else
      query = `SELECT *, to_char(date_signup,'DD.MM.YYYY') as date_signup_formatted, to_char(subscription_exp,'DD.MM.YYYY') as subscription_exp_formatted,  subscription_exp > current_timestamp as is_subscription  FROM users WHERE email=$1`

    const values = [key]

    try {
      const { rows } = await db.query(query, values)
      if (rows[0]) {
        let user = rows[0]
        if (typeof user.admin_role_id === 'number') {
          let admin = {
            id: user.id,
            first_name: user.first_name,
            last_name: user.last_name,
            admin_role_id: user.admin_role_id
          }
          if (returnPassword === true) admin.password = user.password
          return admin
        } else {
          user.date_signup = user.date_signup_formatted
          user.subscription_exp = user.subscription_exp_formatted

          user.avatar_src = utils.getImageUrl(user.avatar_src)
          const plans = JSON.parse(JSON.stringify(DATA.plans))

          user.plan_name = plans.filter(
            item => item.id === user.plan_id
          )[0].name

          delete user.date_signup_formatted
          delete user.subscription_exp_formatted
          if (returnPassword === false) delete user.password
          delete user.payments
          delete user.food_reports
          delete user.photos
          delete user.history
          delete user.food_menu_id
          delete user.workout.schedule
          return user
        }
      } else return null
    } catch (error) {
      return null
    }
  },
  async resetBeforeNewMonth(userId) {
    await Food.setCurrentFoodMenu(userId)
    const query = `UPDATE users SET workout='{}', food_menu_id=NULL, tutor_id=NULL WHERE id=$1`
    const values = [userId]

    try {
      await db.query(query, values)
      return true
    } catch (error) {
      return false
    }
  },
  async setUserDataByPlan(userId, planId, fromPlanId = false) {
    if (planId > 1 && (!fromPlanId || fromPlanId < 2)) {
      const dietolog = await Chat.InitRooms.withDietolog(userId)
      if (dietolog)
        await Notification.add(userId, {
          title:
            'Вам доступен персональный диетолог. Связаться с ним можно в разделе "Сообщения"',
          url: '/messages'
        })
    }

    if (planId > 0 && (!fromPlanId || fromPlanId < 1)) {
      await Food.setCurrentFoodMenu(userId)
      await Notification.add(userId, {
        title:
          'Заполните данные для составления персональной программы тренировок',
        url: '/workout/fill-info'
      })
      await Notification.add(userId, {
        title: 'Персональный план питания уже готов!',
        url: '/food/personal'
      })
    }
  },
  async deleteUserByHash(hash) {
    const query = `DELETE FROM users WHERE id=(SELECT user_id FROM signup_info WHERE hash=$1 AND used=false)`
    const values = [hash]

    try {
      await db.query(query, values)
    } catch (e) {}
  }
}

module.exports = Common
