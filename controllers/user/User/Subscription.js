const { utils, db, kassa } = require('../../../services/')
const { User } = require('../../../utils/')
const { copyDATA } = require('../../../data/')

const Subscription = {
  async extend(req, res) {
    const { plan_id } = req.body
    let plans = copyDATA('plans')
    let plan = plans.filter(e => parseInt(e.id) === plan_id)[0]

    if (req.currentUser.plan_id === 0 && plan.id === 1 && plan.trial) {
      const query = `UPDATE users SET subscription_exp = current_timestamp + '${plan.trial} days', plan_id=1 WHERE id=$1`
      const values = [req.currentUser.id]
      try {
        await db.query(query, values)
        await User.Notification.add(req.currentUser.id, {
          title: 'Ваша подписка успешно продлена!'
        })
        return utils.response.success(res)
      } catch (e) {
        return utils.response.error(res, 'Не удалось продлить подписку')
      }
    }

    plans = plans.map(e => {
      if (e.trial) delete e.trial
      return e
    })
    plan = plans.filter(e => parseInt(e.id) === plan_id)[0]

    const metadata = {
      type: 'PLAN_EXTEND',
      new_plan_id: plan.id
    }

    try {
      const kassaPayment = await kassa.createPayment({
        value: plan.cost,
        description: `Продление подписки Культ Тела на пакет "${plan.name}"`,
        metadata: metadata
      })

      if (!kassaPayment)
        return utils.response.error(res, 'Ошибка при создании платежа')

      const dbpayment = await User.Payment.create(
        req.currentUser.id,
        kassaPayment.id,
        metadata.type,
        parseInt(plan.cost)
      )

      if (!dbpayment)
        return utils.response.error(res, 'Ошибка при создании платежа')
      return utils.response.success(res, {
        url: kassaPayment.confirmation.confirmation_url
      })
    } catch (e) {
      return utils.response.error(res, 'Ошибка при создании платежа')
    }
  }
}

module.exports = Subscription
