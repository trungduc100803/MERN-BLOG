import Comment from "../models/comment.model.js";
import { errorHandler } from "../utils/error.js";

const CommentController = {
    createComment: async (req, res, next) => {
        const {content, postId, userID} = req.body
    
        if(userID !== req.user.id){
            return next(errorHandler(403, "You are not allowed to create this comment"))
        }
        try {
            const newComment = new Comment({
                content, postId, userID
            })
            await newComment.save()

            return res.status(200).send({
                success: true,
                message: "Create comment successfully",
                comment: newComment
            })
        } catch (error) {
            next(error)
        }
    },
    getPostComment: async (req, res, next) => {
        try {
            const comments = await Comment.find({postId: req.params.postId})
                .sort({createdAt: -1})

            return res.status(200).send({
                success: true,
                message: "get post comment successfully",
                comments
            })
        } catch (error) {
            next(error)
        }
    },
    likeComment: async (req, res, next) => {
        try {
            const comment = await Comment.findById(req.params.commentId)
            if(!comment) return next(errorHandler(404, 'Comment not found'))

            const userIndex = comment.likes.indexOf(req.user.id)
            if(userIndex === -1){
                comment.numberOfLikes += 1
                comment.likes.push(req.user.id)
            }else{
                comment.numberOfLikes -= 1
                comment.likes.splice(userIndex, 1)
            }

            await comment.save()
            return res.status(200).send({
                success: true,
                message: 'like comment success',
                comment
            })
        } catch (error) {
            
        }
    },
    editComment:  async (req, res, next) => {
        try {
            const comment = await Comment.findById(req.params.commentId)
            if(!comment) return next(errorHandler(404, 'Comment not found'))
            if(comment.userID !== req.user.id && !req.user.isAdmin){
                return next(errorHandler(403, "You are not allowed to edit this comment"))
            }

            const editedComment = await Comment.findByIdAndUpdate(
                req.params.commentId,
                {
                    content: req.body.content
                },
                { new: true }
            )
            return res.status(200).send({
                success: true,
                message: 'edit comment success',
                comment: editedComment
            }) 
        } catch (error) {
            next(error)
        }
    },
    deleteComment: async (req, res, next) => {
        try {
            const comment = await Comment.findById(req.params.commentId)
            if(!comment){
                return next(errorHandler(404, 'Comment not found'))
            }
            if(comment.userID !== req.user.id && !req.user.isAdmin){
                return next(errorHandler(403, "You are not allowed to delete this comment"))
            }
            await Comment.findByIdAndDelete(req.params.commentId)

            return res.status(200).send({
                success: true,
                message: 'delete comment success'
            })
        } catch (error) {
            next(error)
        }
    },
    getComments: async (req, res, next) => {
        if(!req.user.isAdmin) return next(errorHandler(403, "You are not allowed to get all comments"))
        try {
            const startIndex = parseInt(req.query.startIndex) || 0
            const limit = parseInt(req.query.limit)
            const sortDirection = req.query.sortDirection === 'desc' ? -1 : 1

            const comments = await Comment.find()
                .sort({ createdAt: sortDirection })
                .limit(limit)
                .skip(startIndex)
            const totalComments = await Comment.countDocuments()
            const now = new Date()
            const oneMonthAgo = new Date(
                now.getFullYear(),
                now.getMonth() -1 ,
                now.getDate()
            )
            const lastMonthComments = await Comment.countDocuments(
                { createdAt: { $gte: oneMonthAgo } }
            )

            return res.status(200).send({
                comments,
                totalComments,
                lastMonthComments
            })
        } catch (error) {
            next(error)
        }
    }
}


export default CommentController