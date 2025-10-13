const mongoose = require('mongoose')
const dotenv = require('dotenv')

//Middleware
dotenv.config()

const dbUrl = process.env.DATABASE_URL

// DB Connection
async function connectToDb(){
    try{
        await mongoose.connect(dbUrl) 
        console.log("DB Connection established :)")
    }
    catch(e){
        console.log("DB Connection Couldn't be established")
        console.log(e);
    }
}

module.exports = connectToDb