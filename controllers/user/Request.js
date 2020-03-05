const { utils, db, kassa } = require('../../services/')
const { User } = require('../../utils/')

const consultationPrice = 1000

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
      if (request.type === 0) {
        query = `INSERT INTO requests(user_id, type, date_from, date_to) VALUES ($1, $2,  TO_DATE($3, 'YYYY-MM-DD'), TO_DATE($4, 'YYYY-MM-DD'))`
        values = [userId, request.type, request.date_from, request.date_to]

        await db.query(query, values)
        await User.Notification.add(userId, {
          title:
            'Ваша заявка успешно принята, наш администратор позже свяжется с вами.'
        })
        return utils.response.success(res)
      } else if (request.type === 1) {
        const metadata = {
          type: 'CONSULTATION_BUY'
        }

        const kassaPayment = await kassa.createPayment({
          value: consultationPrice,
          description: `Оплата онлайн-консультации Культ Тела`,
          metadata: metadata
        })

        if (!kassaPayment)
          return utils.response.error(res, 'Ошибка при создании платежа')

        const dbpayment = await User.Payment.create(
          userId,
          kassaPayment.id,
          metadata.type,
          consultationPrice
        )

        if (!dbpayment)
          return utils.response.error(res, 'Ошибка при создании платежа')

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
        return utils.response.success(res, {
          url: kassaPayment.confirmation.confirmation_url
        })
      }
    } catch (e) {
      console.log(e)
      return utils.response.error(
        res,
        'Ошибка при создании заявки, попробуйте позже'
      )
    }
  }
}

module.exports = Request
