const Router = require('express')
const authController = require('../controllers/authController')

router = new Router()

router.post('/auth', authController.handleLogin)

module.exports = router
