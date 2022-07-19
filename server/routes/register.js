const Router = require('express')
const registerController = require('../controllers/registerController')

router = new Router()

router.post('/register', registerController.handleRegister)

module.exports = router
