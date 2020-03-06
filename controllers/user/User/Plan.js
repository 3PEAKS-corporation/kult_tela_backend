const { utils, kassa } = require('../../../services/')
const { User } = require('../../../utils/')

const Plan = {
  async getChangePrices(req, res) {
    const prices = await User.Plan.getChangePrices(req.currentUser.id)
    if (prices) return utils.response.success(res, prices)
    else return utils.response.error(res, 'Ошибка, попробуйте позже')
  },
  async change(req, res) {
    let { new_plan_id } = req.body
    new_plan_id = parseInt(new_plan_id)

    if (typeof new_plan_id !== 'number') return utils.response.error(res)

    const newPlanPrices = await User.Plan.getChangePrices(
      parseInt(req.currentUser.id)
    )
    if (!newPlanPrices) return utils.response.error(res)

    const newPlan = newPlanPrices.filter(e => e.id === new_plan_id)[0]

    if (!newPlan) return utils.response.error(res)

    console.log(newPlan)

    const metadata = {
      type: 'PLAN_CHANGE',
      new_plan_id: newPlan.id
    }

    try {
      const kassaPayment = await kassa.createPayment({
        value: newPlan.newCost,
        description: `Смена подписки Культ Тела на пакет "${newPlan.name}"`,
        metadata: metadata
      })

      if (!kassaPayment)
        return utils.response.error(res, 'Ошибка при создании платежа')

      const dbpayment = await User.Payment.create(
        req.currentUser.id,
        kassaPayment.id,
        metadata.type,
        parseInt(newPlan.newCost)
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

module.exports = Plan
