import JWT from 'jsonwebtoken'
import {errorHandler} from './error.js'

export const verifyToken = async (req, res, next) => {
    const token = req.cookies.access_token

    if(!token){
        return next(errorHandler(401, "Unthorization"))
    }
    JWT.verify(token, process.env.SECRETKEY, (err, user) => {
        if(err){
        return next(errorHandler(401, "Unthorization"))
        }
        req.user = user
        next()
    })
}