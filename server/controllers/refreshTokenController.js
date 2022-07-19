const jwt = require('jsonwebtoken')
const userModel = require('../model/userModel')

const handleRefreshToken = async (req, res) => {
	const cookies = req.cookies
	if (!cookies?.jwt) res.sendStatus(401)
	const refreshToken = cookies.jwt
	res.clearCookie('jwt', { httpOnly: true, sameSite: 'None', secure: true })

	const foundUser = await userModel.findOne({ refreshToken }).exec()

	if (!foundUser) {
		jwt.verify(
			refreshToken,
			process.env.JWT_SECRET_REFRESH,
			async (err, decoded) => {
				if (err) return res.sendStatus(403)
				const hackedUser = await userModel
					.findOne({ nickname: decoded.nickname })
					.exec()
				hackedUser.refreshToken = []
				await hackedUser.save()
			}
		)
		return res.sendStatus(403)
	}

	const newRefreshTokenArray = foundUser.refreshToken.filter(
		rt => rt !== refreshToken
	)

	jwt.verify(
		refreshToken,
		process.env.JWT_SECRET_REFRESH,
		async (err, decoded) => {
			if (err) {
				foundUser.refreshToken = [...newRefreshTokenArray]
				await foundUser.save()
			}
			if (err || foundUser.nickname !== decoded.nickname)
				return res.sendStatus(403)

			const accessToken = jwt.sign(
				{ nickname: foundUser.nickname },
				process.env.JWT_SECRET_ACCESS,
				{ expiresIn: '10s' }
			)
			const newRefreshToken = jwt.sign(
				{ nickname: foundUser.nickname },
				process.env.JWT_SECRET_REFRESH,
				{ expiresIn: '120s' }
			)

			foundUser.refreshToken = [...newRefreshTokenArray, newRefreshToken]
			await foundUser.save()
			res.cookie('jwt', newRefreshToken, {
				httpOnly: true,
				sameSite: 'None',
				secure: true,
				maxAge: 24 * 60 * 60 * 1000,
			})

			res.json({ accessToken })
		}
	)
}

module.exports = { handleRefreshToken }
