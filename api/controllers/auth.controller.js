import User from "../models/user.model.js"
import bcrypt from 'bcrypt'
import JWT from 'jsonwebtoken'


import { errorHandler } from "../utils/error.js"

const authController = {
    signUp: async (req, res, next) => {
        const { username, email, password } = req.body

        try {
            if (!username || !email || !password || username === '' || email === '' || password === '') {
                return next(errorHandler(400, "All fields are required"))
            }

            const hashedPassword = bcrypt.hashSync(password, 10)
            // create new user when for fit
            const newUser = new User({
                username,
                email,
                password: hashedPassword
            })

            await newUser.save()
            return res.status(200).send({
                success: true,
                message: 'Signup successful'
            })

        } catch (error) {
            return next(error)
        }
    },
    signIn: async (req, res, next) => {
        const { email, password } = req.body
        if (!email || !password || email === '' || password === '') {
            return next(errorHandler(400, "All fields are required"))
        }

        try {
            const validUser = await User.findOne({ email })
            if (!validUser) {
                return next(errorHandler(404, 'User not found'))
            }

            const validPassword = bcrypt.compare(password, validUser.password)
            if (!validPassword) {
                return next(errorHandler(400, 'Invalidd password'))
            }

            const token = JWT.sign(
                { id: validUser._id },
                process.env.SECRETKEY,
                { expiresIn: '1d' }
            )

            const { password: pass, ...rest } = validUser._doc

            return res
                .status(200)
                .cookie('access-token', token, {
                    httpOnly: true
                })
                .send({
                    success: true,
                    message: 'Sign In Successfull',
                    user: rest
                })
        } catch (error) {
            return next(error)
        }
    },
    google: async (req, res, next) => {
        const { email, name, googlePhoroUrl } = req.body
        try {
            const user = await User.findOne({ email })
            if (user) {
                const token = JWT.sign(
                    {
                        id: user._id,
                    },
                    process.env.SECRETKEY
                )
                const { password, ...rest } = user._doc
                return res
                    .status(200)
                    .cookie('access_token', token, { httpOnly: true })
                    .send({
                        success: true,
                        message: 'success',
                        user: rest
                    })
            } else {
                const generatedPassword = Math.random().toString(36).slice(-8) + Math.random().toString(36).slice(-8)
                const hashedPassword = bcrypt.hash(generatedPassword, 10)
                const newUser = new User({
                    email,
                    username: name,
                    password: hashedPassword,
                    profilePicture: googlePhoroUrl
                })
                await newUser.save()
                const token = JWTsign(
                    { id: user._id },
                    process.env.SECRETKEY
                )
                const { password, ...rest } = user._doc
                return res
                    .status(200)
                    .cookie('access_token', token, { httpOnly: true })
                    .send({
                        success: true,
                        message: 'success',
                        user: rest
                    })
            }
        } catch (error) {

        }
    }
}


export default authController