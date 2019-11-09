const { Router } = require('express')
const { Plan } = require('../controllers/')
//const { requirePlan, requireAuth } = require('../middleware/')

const router = Router()

router
  .route('/plans')
  //.put(Plan.createWithSQL) //TODO: admin middleware
  .get(Plan.getPublicInfo)

module.exports = router
