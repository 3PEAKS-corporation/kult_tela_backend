const { Router } = require('express')
const { Chat } = require('../controllers/')
const { requireAuth, imageUpload } = require('../middleware/')

const router = Router()

router.get('/chat', requireAuth.userToken, Chat.getAll)
router.get('/chat/:user_id', requireAuth.userToken, Chat.getById)

module.exports = router
