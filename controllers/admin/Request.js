const { utils, db } = require('../../services/')

const Request = {
  getAll: (history = false) => async (req, res) => {
    const query = `SELECT requests.id, requests.user_id, requests.tutor, to_char(requests.date_from,'DD.MM.YYYY') as date_from, to_char(requests.date_to,'DD.MM.YYYY') as date_to,
                  to_char(requests.date,'DD.MM.YYYY') as date, requests.status,
                  users.first_name || ' ' || users.last_name as user_name, payments.status as payment_status, payments.id as payment_id FROM requests
                  LEFT JOIN payments ON requests.payment_id = payments.id
                  LEFT JOIN users ON requests.user_id=users.id
                  ${
                    history === true
                      ? 'WHERE requests.status=1 OR requests.status=-1'
                      : 'WHERE requests.status=0'
                  } ORDER BY id DESC`

    try {
      let { rows } = await db.query(query)
      rows = rows.map(e => {
        if (typeof e.payment_id !== 'number') e.payment_status = 'free'
        delete e.payment_id
        return e
      })
      return utils.response.success(res, rows)
    } catch (e) {
      return utils.response.error(res, 'Не удалось загрузить заявки')
    }
  },
  async setStatus(req, res) {
    const id = parseInt(req.body.id)
    const status = parseInt(req.body.status)
    if (typeof id !== 'number' || typeof status !== 'number')
      return utils.response.error(res)

    const query = `UPDATE requests SET status=$1 WHERE id=$2`
    const values = [status, id]

    try {
      await db.query(query, values)
      return utils.response.success(res)
    } catch (e) {
      return utils.response.error(res, 'Ошибка обновления')
    }
  }
}

module.exports = Request
