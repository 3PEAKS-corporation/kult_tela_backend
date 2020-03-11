const { utils, db } = require('../../../services/')
const { User, Admin } = require('../../../utils/')

const Tutor = {
  async getAll(req, res) {
    const query = `SELECT id, first_name || ' ' || last_name as name, admin_description FROM users WHERE admin_role_id = 2`
    try {
      const { rows } = await db.query(query)
      return utils.response.success(res, rows)
    } catch (e) {
      return utils.response.error(
        res,
        'Не удалось загрузить наставников, попробуйте позже'
      )
    }
  },
  async set(req, res) {
    const tutor_id = parseInt(req.body.tutor_id)
    if (typeof tutor_id !== 'number') return utils.response.error(res)

    let query = `UPDATE users SET tutor_id=$1 WHERE id=$2 AND tutor_id IS NULL AND EXISTS(SELECT id FROM users WHERE id=$1 AND admin_role_id=2) RETURNING (SELECT email FROM users WHERE id=$1)`
    let values = [tutor_id, parseInt(req.currentUser.id)]

    try {
      const { rows } = await db.query(query, values)
      if (rows[0] && rows[0].email) {
        const tutorEmail = rows[0].email
        await User.Chat.Message.addMessage({
          fromUserId: tutor_id,
          toUserId: parseInt(req.currentUser.id),
          text:
            '\n' +
            'Здравия желаю! С сегодняшнего дня я являюсь вашим персональным диетологом! По любым вопросам касательно питания - можете спрашивать меня! У нас чат тет-а-тет. Рекомендую также высылать отчеты по питанию!'
        })
        await User.Notification.add(req.currentUser.id, {
          title:
            'Вам доступен персональный наставник. Связаться с ним можно в разделе "Сообщения"',
          url: '/messages'
        })
        await Admin.Email.newStudent(tutorEmail)
        return utils.response.success(res, { tutor_id: tutor_id })
      } else throw 'to catch'
    } catch (e) {
      console.log(e)
      return utils.response.error(res, 'Ошибка запроса. Попробуйте позже')
    }
  }
}

module.exports = Tutor
