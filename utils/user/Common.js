const { db, utils } = require('../../services/')
const { DATA } = require('./../../data/')
const Food = require('./Food')

const Common = {
  async getPublicUserData(userId) {
    const query = `SELECT * FROM users_public WHERE id=$1 AND name IS NOT NULL`
    const values = [userId]

    try {
      const { rows } = await db.query(query, values)
      const user = rows[0]
      if (user) {
        user.avatar_src = utils.getImageUrl(user.avatar_src)
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
        user.date_signup = user.date_signup_formatted
        user.subscription_exp = user.subscription_exp_formatted

        user.avatar_src = utils.getImageUrl(user.avatar_src)
        const plans = JSON.parse(JSON.stringify(DATA.plans))

        user.plan_name = plans.filter(item => item.id === user.plan_id)[0].name

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
      } else return null
    } catch (error) {
      return null
    }
  },
  async resetBeforeNewMonth(userId) {
    await Food.setCurrentFoodMenu(userId)
    const query = `UPDATE users SET workout='{}' WHERE id=$1`
    const values = [userId]

    try {
      await db.query(query, values)
      return true
    } catch (error) {
      return false
    }
  }
}

module.exports = Common
