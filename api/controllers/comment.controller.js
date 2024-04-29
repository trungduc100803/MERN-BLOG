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
    }
}


export default CommentController