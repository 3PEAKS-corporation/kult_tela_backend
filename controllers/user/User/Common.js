const { utils, db } = require('../../../services/')
const { DATA } = require('../../../data/')

const Common = {
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
        user.plan_name = DATA.plans.filter(
          item => item.id == user.plan_id
        )[0].name
        delete user.date_signup_formatted
        if (returnPassword === false) delete user.password
        delete user.payments
        delete user.photos
        return user
      } else return null
    } catch (error) {
      return null
    }
  },
  async editProfileData(req, res) {}
}

module.exports = Common
