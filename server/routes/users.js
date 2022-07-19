const Router = require('express')
const userModel = require('../model/userModel')

router = new Router()

router.get('/users', async (req, res) => {
	const users = await userModel.find()
	if (!users) res.status(204).json({ message: 'no users found ' })
	res.json(users)
})

module.exports = router
