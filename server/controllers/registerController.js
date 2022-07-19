const bcrypt = require('bcrypt')
const userModel = require('../model/userModel')

class registerController {
	async handleRegister(req, res, next) {
		try {
			const { nickname, password } = req.body
			if (!nickname || !password) {
				res.status(400).json('complete form')
			}
			const candidate = await userModel.findOne({ nickname })
			if (candidate) {
				res.status(409).json('conflict')
			}

			const bcryptPassword = await bcrypt.hash(password, 10)

			const user = await userModel.create({
				nickname,
				password: bcryptPassword,
			})

			res.json(user)
		} catch (error) {
			next(error)
		}
	}
}

module.exports = new registerController()
