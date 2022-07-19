const jwt = require('jsonwebtoken')

const verifyJWT = (req, res, next) => {
	const authHeader = req.headers.authorization || req.headers.Authorization
	if (!authHeader?.startsWith('Bearer ')) return res.sendStatus(401)
	const token = authHeader.split(' ')[1]
	jwt.verify(token, process.env.JWT_SECRET_ACCESS, (err, decoded) => {
		console.log('aassa')
		if (err) return res.sendStatus(403) //invalid token
		req.nickname = decoded.nickname
		next()
	})
}

module.exports = verifyJWT
