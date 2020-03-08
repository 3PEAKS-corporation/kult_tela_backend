const { Router } = require('express')
const { admin } = require('../../controllers/')
const { requireAuth } = require('../../middleware/')

const router = Router()

router.get('/admin/roles', admin.Roles.getAll)

module.exports = router
