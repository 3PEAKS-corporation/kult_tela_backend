const { db, utils } = require('../../services/')
const { DATA } = require('./../../data/')

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
      query = `SELECT *, to_char(date_signup,'DD.MM.YYYY') as date_signup_formatted FROM users WHERE id=$1`
    else
      query = `SELECT *, to_char(date_signup,'DD.MM.YYYY') as date_signup_formatted FROM users WHERE email=$1`

    const values = [key]

    try {
      const { rows } = await db.query(query, values)
      if (rows[0]) {
        let user = rows[0]
        user.date_signup = user.date_signup_formatted
        user.avatar_src = utils.getImageUrl(user.avatar_src)
        user.plan_name = DATA.plans.filter(
          item => item.id == user.plan_id
        )[0].name
        delete user.date_signup_formatted
        if (returnPassword === false) delete user.password
        delete user.payments
        delete user.food_reports
        delete user.photos
        return user
      } else return null
    } catch (error) {
      return null
    }
  }
}

module.exports = Common
