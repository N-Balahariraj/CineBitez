// Imports
const express = require('express')
const bodyParser = require('body-parser')
const cors = require('cors')
const dotenv = require('dotenv')
const connectToDb = require('./configs/dbConfig.js')
const cookieParser = require('cookie-parser')


// Creating App
const app = express()

// Middlewares
dotenv.config()
app.use(bodyParser.json())
app.use(cors({credentials : true}))
app.use(cookieParser())

// DB Connection
connectToDb()

// Listening App
const port = process.env.PORT
app.listen(port,()=>{
    console.log(`Listening the server at port ${port}...`)
})

// Connecting Routes
require('./routes/user.route.js')(app)
require('./routes/movie.route.js')(app)