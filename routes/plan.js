const { Router } = require('express')
const { User, Plan } = require('../controllers')
const { requirePlan, requireAuth } = require('../middleware/')

const router = Router()

router.get('/plan/all', Plan.getPublicInfo)
router.get(
  '/plan/change/price',
  requireAuth.userToken(),
  User.Plan.getChangePrices
)
router.post('/plan/change', requireAuth.userToken(), User.Plan.change)

module.exports = router
