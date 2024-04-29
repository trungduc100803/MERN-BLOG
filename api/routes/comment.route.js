import express from 'express'
const router = express.Router()
import CommentController from '../controllers/comment.controller.js'
import { verifyToken } from '../utils/verifyUser.js'


router.post('/create-comment', verifyToken, CommentController.createComment)

export default router