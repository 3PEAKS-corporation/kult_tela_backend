const { Router } = require('express')
const { Admin } = require('../../controllers/')
const { requireAuth } = require('../../middleware/')

const router = Router()

router.get('/admin/request', requireAuth.adminToken, Admin.Request.getAll())
router.get(
  '/admin/request/history',
  requireAuth.adminToken,
  Admin.Request.getAll(true)
)

router.post('/admin/request', requireAuth.adminToken, Admin.Request.setStatus)

module.exports = router
