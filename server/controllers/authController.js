const bcrypt = require('bcrypt')
const userModel = require('../model/userModel')
const jwt = require('jsonwebtoken')
class authController {
	async handleLogin(req, res) {
		const cookies = req.cookies
		const { nickname, password } = req.body
		if (!nickname || !password) {
			res.status(400).json('complete form')
		}
		const foundUser = await userModel.findOne({ nickname })
		if (!foundUser) {
			res.status(400).json('complete form')
		}
		const match = await bcrypt.compare(password, foundUser.password)
		if (match) {
			const newRefreshToken = jwt.sign(
				{ nickname: foundUser.nickname },
				process.env.JWT_SECRET_REFRESH,
				{ expiresIn: '120s' }
			)
			const accessToken = jwt.sign(
				{ nickname: foundUser.nickname },
				process.env.JWT_SECRET_ACCESS,
				{ expiresIn: '15s' }
			)

			let newRefreshTokenArray = !cookies?.jwt
				? foundUser.refreshToken
				: foundUser.refreshToken.filter(rt => rt !== cookies.jwt)
			if (cookies?.jwt) {
				const refreshToken = cookies.jwt
				const foundToken = await userModel.findOne({ refreshToken }).exec()
				if (!foundToken) {
					newRefreshTokenArray = []
				}
				res.clearCookie('jwt', {
					httpOnly: true,
					sameSite: 'None',
					secure: true,
				})
			}
			foundUser.refreshToken = [...newRefreshTokenArray, newRefreshToken]
			await foundUser.save()

			res.cookie('jwt', newRefreshToken, {
				httpOnly: true,
				secure: true,
				sameSite: 'None',
				maxAge: 24 * 60 * 60 * 1000,
			})

			res.json({ accessToken })
		} else {
			res.sendStaus(401)
		}
	}
}

module.exports = new authController()
