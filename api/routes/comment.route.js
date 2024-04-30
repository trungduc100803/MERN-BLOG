import express from 'express'
const router = express.Router()
import CommentController from '../controllers/comment.controller.js'
import { verifyToken } from '../utils/verifyUser.js'


router.post('/create-comment', verifyToken, CommentController.createComment)
router.get('/get-post-comment/:postId', CommentController.getPostComment)
router.put('/like-comment/:commentId', verifyToken, CommentController.likeComment)
router.put('/edit-comment/:commentId', verifyToken, CommentController.editComment)
router.delete('/delete-comment/:commentId', verifyToken, CommentController.deleteComment)


export default router