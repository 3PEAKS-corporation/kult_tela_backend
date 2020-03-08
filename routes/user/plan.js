const { Router } = require('express')
const { user } = require('../../controllers')
const { requirePlan, requireAuth } = require('../../middleware')

const router = Router()

router.get('/plan/all', user.Plan.getPublicInfo)
router.get(
  '/plan/change/price',
  requireAuth.userToken(),
  user.User.Plan.getChangePrices
)
router.post('/plan/change', requireAuth.userToken(), user.User.Plan.change)

module.exports = router
