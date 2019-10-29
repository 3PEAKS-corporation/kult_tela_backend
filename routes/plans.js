const { Router } = require('express')
const { Plan } = require('../controllers/')

const router = Router()

router
  .route('/plans')
  .put(Plan.create) //TODO: admin middleware
  .get(Plan.getPublicInfo)

module.exports = router
