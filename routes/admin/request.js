const { Router } = require('express')
const { admin } = require('../../controllers/')
const { requireAuth } = require('../../middleware/')

const router = Router()

router.get('/admin/request', requireAuth.adminToken, admin.Request.getAll())
router.get(
  '/admin/request/history',
  requireAuth.adminToken,
  admin.Request.getAll(true)
)

router.post('/admin/request', requireAuth.adminToken, admin.Request.setStatus)

module.exports = router
