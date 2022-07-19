const Router = require('express')
const { handleRefreshToken } = require('../controllers/refreshTokenController')

router = new Router()

router.get('/refresh', handleRefreshToken)

module.exports = router
