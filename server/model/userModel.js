const { Schema, model } = require('mongoose')

const userModel = new Schema({
	nickname: { type: String, required: true },
	password: { type: String, required: true },
	refreshToken: [String],
})

module.exports = model('user', userModel)
