const { utils, db } = require('../../services/')
const { Admin } = require('../../utils/')
const { copyDATA } = require('../../data')

const Promo = {
  async create(req, res) {
    const { key, infinite, plan_id, subscription_duration } = req.body

    const query = `INSERT INTO promo_codes(key, infinite, plan_id, subscription_duration) VALUES($1,$2,$3,$4) RETURNING *`
    const values = [key, infinite, plan_id, subscription_duration]

    try {
      const { rows } = await db.query(query, values)
      return utils.response.success(res, rows[0])
    } catch (e) {
      console.log(e)
      return utils.response.error(res, 'Промокод с таким ключом уже существует')
    }
  },
  async get(req, res) {
    const query = `SELECT * FROM promo_codes WHERE infinite=true OR used=false`

    try {
      const { rows } = await db.query(query)
      return utils.response.success(res, {
        codes: rows,
        plans: copyDATA('plans')
      })
    } catch (e) {
      console.log(e)
      return utils.response.error(res)
    }
  },
  async delete(req, res) {
    const id = parseInt(req.body.id)

    const query = `DELETE FROM promo_codes WHERE id=$1`
    const values = [id]

    try {
      const r = await db.query(query, values)
      return utils.response.success(res)
    } catch (e) {
      console.log(e)
      return utils.response.error(res, 'Не удалось удалить промокод')
    }
  }
}

module.exports = Promo
