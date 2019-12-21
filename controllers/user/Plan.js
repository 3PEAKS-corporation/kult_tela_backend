const { utils, db, token: _token, mail } = require('../../services/')
const { DATA } = require('../../data/')

const Plan = {
  getPublicInfo(req, res) {
    return utils.response.success(res, DATA.plans)
  },
  async getPublicInfoWithSQL(req, res) {
    const query = `SELECT id, name, description, cost, color FROM plans`
    try {
      const { rows: plans } = await db.query(query)
      if (plans) return utils.response.success(res, plans)
      else return utils.response.error(res, 'Загрузка не удалась')
    } catch (error) {
      return utils.response.error(res, 'Загрузка не удалась')
    }
  },
  async createWithSQL(req, res) {
    const { name, description, cost, color } = req.body

    if (!utils.verify([name, description, cost, color]))
      return utils.response.error(res)

    const query = `INSERT INTO plans(name, description, cost, color) VALUES($1,$2,$3,$4) RETURNING *`
    const values = [name, description, cost, color]

    try {
      const { rows } = await db.query(query, values)
      if (rows[0]) return utils.response.success(res, { plan: rows[0] })
      else return utils.response.error(res, 'Ошибка при работе с БД')
    } catch (error) {
      return utils.response.error(res, 'Ошибка подключения')
    }
  }
}

module.exports = Plan
