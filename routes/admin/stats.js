const { Router } = require('express')
const { admin } = require('../../controllers/')
const { requireAuth } = require('../../middleware/')

const router = Router()

router.get('/admin/stats', requireAuth.adminToken, admin.Stats.get)

module.exports = router
