const { utils, db, kassa } = require('../../services/')
const { User } = require('../../utils/')
const { copyDATA } = require('../../data/')

const consultationPrice = 960
const freeTimesForBestPlan = 2

const getPrice = async user => {
  if (user.plan_id < 3) {
    return { price: consultationPrice }
  } else if (user.plan_id === 3) {
    const query = `SELECT count(requests.*) FROM users
          LEFT JOIN requests 
          ON requests.user_id=users.id
          WHERE users.id=$1 AND requests.date >= (users.subscription_exp - interval '31days') AND requests.date < current_timestamp`
    const values = [user.id]

    try {
      const { rows } = await db.query(query, values)
      const count = rows[0] ? parseInt(rows[0].count) : null
      if (typeof count === 'number') {
        if (freeTimesForBestPlan - count > 0)
          return { price: 0, free_times_left: freeTimesForBestPlan - count }
        else return { price: consultationPrice }
      }
    } catch (e) {
      return { price: consultationPrice }
    }
  }
}

const Request = {
  async add(req, res) {
    const request = req.body
    request.type = parseInt(request.type)
    const userId = req.currentUser.id

    if (
      ![0, 1].includes(request.type) ||
      !utils.verify([
        request.tutor,
        request.type,
        request.date_from,
        request.date_to
      ])
    )
      return utils.response.error(res)

    let query, values

    try {
      if (parseInt(request.type) === 1) {
        const price = await getPrice(req.currentUser)

        let dbpayment = { id: null },
          kassaPayment = null

        if (parseInt(price.price) > 0) {
          const metadata = {
            type: 'CONSULTATION_BUY'
          }

          kassaPayment = await kassa.createPayment({
            value: consultationPrice,
            description: `Оплата онлайн-консультации Культ Тела`,
            metadata: metadata
          })

          if (!kassaPayment)
            return utils.response.error(res, 'Ошибка при создании платежа')

          dbpayment = await User.Payment.create(
            userId,
            kassaPayment.id,
            metadata.type,
            consultationPrice
          )

          if (!dbpayment)
            return utils.response.error(res, 'Ошибка при создании платежа')
        } else {
          await User.Notification.add(userId, {
            title:
              'Ваша заявка на онлайн-консультацтю успешно принята, позже с вами свяжется администратор!'
          })
        }

        query = `INSERT INTO requests(user_id, payment_id, type, tutor, date_from, date_to) VALUES ($1, $2, $3, $4, TO_DATE($5, 'YYYY-MM-DD'), TO_DATE($6, 'YYYY-MM-DD'))`
        values = [
          userId,
          dbpayment.id,
          request.type,
          request.tutor,
          request.date_from,
          request.date_to
        ]

        await db.query(query, values)
        return utils.response.success(
          res,
          kassaPayment && {
            url: kassaPayment.confirmation.confirmation_url
          }
        )
      }
    } catch (e) {
      console.log(e)
      return utils.response.error(
        res,
        'Ошибка при создании заявки, попробуйте позже'
      )
    }
  },
  async getInfo(req, res) {
    const info = await getPrice(req.currentUser)
    return utils.response.success(res, {
      tutors: copyDATA('tutors').map(e => {
        e.img_src = utils.getImageUrl(e.img_src, 'public')
        return e
      }),
      price: info
    })
  }
}

module.exports = Request
