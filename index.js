const express = require('express')
const bodyParser = require('body-parser')
const app = express()
const morgan = require('morgan')
const cors = require('cors')
const connectDb = require('./db/connectDb')
const categoriesRoute = require('./routes/categories')
const productRoute = require('./routes/product')
const usersRoute = require('./routes/user')
const orderRoute = require('./routes/order')
const {authJwt} = require('./middleware/auth')
require('dotenv').config()

const api = process.env.API_URL 
//middleware
app.use(cors())
app.options('*',cors())
// app.use(bodyParser.json())
app.use(express.json())
app.use(morgan('tiny'))
app.use(authJwt()) 
app.use(`${api}/products`,productRoute)
app.use(`${api}/categories`,categoriesRoute)
app.use(`${api}/user`,usersRoute)
app.use(`${api}/order`,orderRoute)



const start = async () =>{
    await connectDb(process.env.Mongo_Url)
    app.listen(3000,()=>{
        console.log('server is running on http://localhost:3000')
    })
}

start()

