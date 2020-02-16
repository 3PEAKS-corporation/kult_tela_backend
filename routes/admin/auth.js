const { Router } = require('express')
const { Admin } = require('../../controllers/')
const { requireAuth } = require('../../middleware/')

const router = Router()

module.exports = router
