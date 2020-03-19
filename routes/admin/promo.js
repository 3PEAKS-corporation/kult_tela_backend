const { Router } = require('express')
const { admin } = require('../../controllers/')
const { requireAuth } = require('../../middleware/')

const router = Router()

router.get('/admin/promo', requireAuth.adminToken, admin.Promo.get)

router.post('/admin/promo', requireAuth.adminToken, admin.Promo.create)

router.post('/admin/promo/delete', requireAuth.adminToken, admin.Promo.delete)

module.exports = router
