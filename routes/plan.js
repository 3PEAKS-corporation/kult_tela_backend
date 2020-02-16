const { Router } = require('express')
const { Plan } = require('../controllers')
//const { requirePlan, requireAuth } = require('../middleware/')

const router = Router()

router.get('/plan/all', Plan.getPublicInfo)

module.exports = router
