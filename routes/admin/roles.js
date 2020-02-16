const { Router } = require('express')
const { Admin } = require('../../controllers/')
const { requireAuth } = require('../../middleware/')

const router = Router()

router.get('/admin/roles', Admin.Roles.getAll)

module.exports = router
