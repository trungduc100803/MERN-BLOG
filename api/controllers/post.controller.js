import Post from "../models/post.model.js"
import { errorHandler } from "../utils/error.js"


const postControllers = {
    createPost: async (req, res, next) => {
        if(!req.user.isAdmin){
            return next(errorHandler(403, "You are not allowed to create a post"))
        }

        if(!req.body.title || !req.body.content){
            return next(errorHandler(400, "Please provide all require fields"))
        }

        const slug = req.body.title.split(' ').join('-').toLowerCase().replace(/[^a-zA-Z0-9-]/g, '-')
        const newPost = new Post({
            ...req.body,
            slug,
            userID: req.user.id
        })

        try {
            const savedPost = await newPost.save()
            return res.status(200).send({
                success: true,
                post: savedPost,
                message: 'Create successfully'
            })
        } catch (error) {
            next(error)
        }
    }
}


export default postControllers