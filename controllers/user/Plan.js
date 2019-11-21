const { utils, db, token: _token, mail } = require('../../services/')

const Plans = [
  {
    id: 0,
    name: 'Пехота',
    description: 'Доступ к видео тренировок и советам по питанию',
    cost: 399,
    color: '#b4bac2'
  },
  {
    id: 1,
    name: 'Кавалерия',
    description:
      'Доступ к видео тренировок + советы по питанию + универсальные меню в зависимости от веса (7 видов)',
    cost: 399,
    color: '#3593db'
  },
  {
    id: 2,
    name: 'Артиллерия',
    description:
      'Доступ к расширенным видео тренировок + советы Генерала похудения + советы по питанию + персональное меню',
    cost: 599,
    color: '#9635db'
  },
  {
    id: 3,
    name: 'Суперсолдат',
    description:
      'Доступ к расширенным видео тренировок + советы Генерала похудения + советы по питанию + персональное меню + чат с диетологом (в личном кабинете, в формате общего чата)',
    cost: 699,
    color: '#d42f42'
  }
]

const Plan = {
  getPublicInfo(req, res) {
    return utils.response.success(res, Plans)
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

module.exports = { Plan, Plans }
