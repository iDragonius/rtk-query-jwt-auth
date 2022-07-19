const express = require('express')
require('dotenv').config()
const connectDB = require('./config/dbConn')
const cors = require('cors')
const corsOptions = require('./config/corsOptions')
const app = express()
const mongoose = require('mongoose')
const credentials = require('./middleware/credentials')
const cookieParser = require('cookie-parser')
const registerRoutes = require('./routes/register')
const loginRoutes = require('./routes/auth')
const usersRoutes = require('./routes/users')
const refreshTokenRoutes = require('./routes/refresh')
const verifyJWT = require('./middleware/verifyJWT')
connectDB()

app.use(credentials)

app.use(cors(corsOptions))

app.use(express.urlencoded({ extended: false }))

app.use(express.json())
app.use(cookieParser())
app.use('/api', registerRoutes)
app.use('/api', loginRoutes)
app.use('/api', refreshTokenRoutes)

app.use(verifyJWT)

app.use('/api', usersRoutes)
mongoose.connection.once('open', () => {
	console.log('Connected to DB')
	app.listen(process.env.PORT, () =>
		console.log(`server started at ${process.env.PORT}`)
	)
})
