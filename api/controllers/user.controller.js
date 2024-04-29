import User from "../models/user.model.js"
import bcrypt from 'bcrypt'
import { errorHandler } from "../utils/error.js"

const userController = {
    updateUser: async (req, res, next) => {
        if(req.user.id !== req.params.userID){
            return next(errorHandler(401, "You are not allowed to update this user"))
        }

        if(req.body.password){
            if(req.body.password.length < 6){
                return next(errorHandler(400, "Password must be at least6 characters"))
            }
            req.body.password = bcrypt.hashSync(req.body.password, 10)
        }

        if(req.body.username){
            if(req.body.username.length < 7 || req.body.username > 20){
                return next(errorHandler(400, "Username must be between 7 and 20 characters"))
            }
            if(req.body.username.match(/^[a-zA-Z0-9]+$/)){
                return next(errorHandler(400, "Username can only contain letters and numbers"))
            }
        }

        try {
            const updatedUser  = await User.findByIdAndUpdate(req.params.userID, {
                $set: {
                    username: req.body.username,
                    password: req.body.password,
                    email: req.body.email,
                    profilePicture: req.body.profilePicture
                },
            }, {new: true})

            const{password, ...rest} = updatedUser._doc
            return res.status(200).send({
                success: true,
                message: "User update successfull",
                user: rest
            })
         } catch (error) {
            next(error)
        }
    }  ,
    deleteUser: async (req, res, next) => {
        if(!req.user.isAdmin && req.user.id !== req.params.userID){
            return next(errorHandler(400, 'You are not allowed to delete this user'))
        }

        try {
            await User.findByIdAndDelete(req.user.id)
            return res.status(200).send({
                success: true,
                message: 'User has been deleted'
            })
        } catch (error) {
            next(error)
        }
    } ,
    signOut: async (req, res, next) => {
        try {
            return res
                .clearCookie('access_token')
                .status(200)
                .send({
                    success: true,
                    message: 'User has been logout'
                })
        } catch (error) {
            next(error)
        }
    },
    getUser: async (req, res, next) => {
        if(!req.user.isAdmin){
            return next(errorHandler(403, "You are not allowed to see all users"))
        }

        try {
            const startIndex = parseInt(req.query.startIndex) || 0
            const limit = parseInt(req.query.limit) || 9
            const sortDirection = req.query.sort === "asc" ? 1 : -1

            const users = await User.find()
                .sort({createdAt: sortDirection})
                .skip(startIndex)
                .limit(limit)

            const userWithoutPassword = users.map(user => {
                const {password, ...rest} = user._doc
                return rest
            })
            const totalUser = await User.countDocuments()
            const now = new Date()
            const oneMonthAgo = new Date(
                now.getFullYear(),
                now.getMonth() -1,
                now.getDate()
            )
            const lastMonthUser = await User.countDocuments({
                createdAt: {$gte: oneMonthAgo}
            })

            return res.status(200).send({
                users: userWithoutPassword,
                totalUser,
                lastMonthUser,
                success: true,
                message: 'get user successfully'
            })
        } catch (error) {
            next(error)
        }
    }
}

export default userController