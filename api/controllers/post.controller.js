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
    },
    getPost: async (req, res, next) => {
        try {
            const startIndex = parseInt(req.query.startIndex) || 0
            const limit = parseInt(req.query.limit) || 9
            const sortDirection = req.query.order  === 'asc' ? 1: -1
            const posts = await Post.find({
                ...(req.query.userID && {userID: req.query.userID}),
                ...(req.query.category && { category: req.query.category}),
                ...(req.query.slug && { slug: req.query.slug}),
                ...(req.query.postId && { _id: req.query.postId}),
                ...(req.query.searchTerm && { 
                    $or: [
                        {title: {$regex: req.query.searchTerm, $options: 'i'}},
                        {content: {$regex: req.query.searchTerm, $options: 'i'}},
                    ]    
                })
            }).sort({updateAt: sortDirection}).skip(startIndex).limit(limit)

            const totalPost = await Post.countDocuments()
            const now = new Date()
            const oneMonthAgo = new Date(
                now.getFullYear(),
                now.getMonth() -1,
                now.getDate()
            )
            const lastMonthPost = await Post.countDocuments({
                createdAt: {$gte: oneMonthAgo}
            })

            return res.status(200).send({
                posts,
                totalPost,
                lastMonthPost,
                success: true,
                message: 'get post successfully'
            })
        } catch (error) {
            next(error)
        }
    },
    deletePost: async (req, res, next) => {
        if(!req.user.isAdmin || !req.user.id || !req.params.userID){
            return next(errorHandler(403, "You are not allowed to delete this post"))
        }

        try {
            await Post.findByIdAndDelete(req.params.postId)
            return res.status(200).send({
                success: true,
                message: 'The post has been deleted'
            })
        } catch (error) {
            next(error)
        }
    },
    updatePost: async (req, res, next) => {
        if(!req.user.isAdmin || req.user.id !== req.params.userID ){
            return next(errorHandler(403, "You are not allowed to updated this post"))
        }

        try {
            const updatedPost = await Post.findByIdAndUpdate(
                req.params.postId,
                {
                    $set: {
                        title: req.body.title,
                        content: req.body.content,
                        category: req.body.category,
                        image: req.body.image,
                    }
                },
                {new: true}
            )

            return res.status(200).send({
                success: true,
                message: "update post successfully",
                posts: updatedPost
            })
        } catch (error) {
            
        }
    }
}


export default postControllers