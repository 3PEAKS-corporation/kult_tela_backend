const { Router } = require('express')
const { user } = require('../../controllers')
const { requireAuth } = require('../../middleware')

const router = Router()

router.get('/chat', requireAuth.userToken(), user.Chat.getAll)
router.get('/chat/:user_id', requireAuth.userToken(), user.Chat.getById)

module.exports = router
