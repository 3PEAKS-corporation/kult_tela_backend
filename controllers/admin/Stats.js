const { utils, db } = require('../../services/')
const { copyDATA } = require('../../data/')

const Stats = {
  async get(req, res) {
    const query = `
        SELECT COUNT(*), plan_id
                   FROM users
                   WHERE admin_role_id IS null
                   GROUP BY plan_id;
    SELECT email
    FROM users
    WHERE admin_role_id IS null;`

    try {
      const data = await db.query(query)
      const plans = copyDATA('plans')

      const users_count = plans.map((plan, idx) => {
        const info = { id: idx, plan_name: plan.name }
        const count = data[0].rows.filter(e => e.plan_id === plan.id)[0]
        info.count = count ? count.count : 0
        return info
      })
      const emails = data[1].rows.map(e => e.email)

      return utils.response.success(res, { users_count, emails })
    } catch (e) {
      console.log(e)
      return utils.response.error(res, 'Не удалось собрать статистику')
    }
  }
}

module.exports = Stats
