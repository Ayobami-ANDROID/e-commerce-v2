var { expressjwt: jwt } = require("express-jwt")
require('dotenv').config()

function authJwt(){
    const secret = process.env.Jwt_Secret
    const api = process.env.API_URL
    return jwt({
       secret ,algorithms:['HS256'],isRevoked:isRevoked
    }).unless({
        path:[
            {url:/\/public\/uploads(.*)/,methods:['GET','OPTIONS']},
            {url:/\/api\/v1\/products(.*)/,methods:['GET','OPTIONS']},
            {url:/\/api\/v1\/categories(.*)/,methods:['GET','OPTIONS']},
            `${api}/user/login`,
            `${api }/user/register`
        ]
    })
}

async function isRevoked(req,payload){
    if(payload.isAdmin === false){
        return true
    }
    return false
}

module.exports = {authJwt}

// const User = require('../models/user')
// const jwt = require('jsonwebtoken')


// const auth = async (req, res, next) => {
//   // check header
//   const authHeader = req.headers.authorization
//   if (!authHeader || !authHeader.startsWith('Bearer')) {
//     res.status(400).json('not authorized')
//   }
//   const token = authHeader.split(' ')[1]

//   try {
//     const payload = jwt.verify(token, process.env.Jwt_Secret)
//     // attach the user to the job routes
//     req.user = { userId: payload.userId, name: payload.name }
//     next()
//   } catch (error) {
//     res.status(400).jon({error})
//   }
// }

// module.exports = auth