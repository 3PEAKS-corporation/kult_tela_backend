const { Router } = require('express')
const { Chat } = require('../controllers/')
const { requireAuth, imageUpload } = require('../middleware/')

const router = Router()

router.get('/chat', requireAuth.userToken, Chat.getAll)

module.exports = router
