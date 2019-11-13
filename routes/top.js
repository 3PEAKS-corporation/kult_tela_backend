const { Router } = require('express')
const { Top } = require('../controllers/')
const { requireAuth } = require('../middleware/')

const router = Router()

router.route('/top').get(requireAuth, Top.current)

module.exports = router
