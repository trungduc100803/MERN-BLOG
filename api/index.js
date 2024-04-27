import express from 'express'
import mongoose from 'mongoose'
import dotenv from 'dotenv'
import cors from 'cors'
import cookie_parser from 'cookie-parser'

import userRouter from './routes/user.route.js'
import authController from './routes/auth.route.js'

dotenv.config()
const app = express()
app.use(express.json())
app.use(cors())
app.use(cookie_parser())


mongoose
    .connect('mongodb+srv://trungduc:huystinhbovo123@mern-blog.nrbswgf.mongodb.net/?retryWrites=true&w=majority&appName=mern-blog')
    .then(() => {
        app.listen(3000, () => {
            console.log(`Server running on port 3000`)
        })
    })
    .catch(err => {
        console.log(err)
    })


app.use('/api/user', userRouter)
app.use('/api/auth', authController)

app.use((err, req, res, next) => {
    const statusCode = err.statusCode || 500
    const message = err.message || "Server Error"

    return res.status(statusCode).send({
        status: statusCode,
        success: false,
        message
    })
})