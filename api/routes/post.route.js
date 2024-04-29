import express from 'express'
const router = express.Router()
import postControllers from '../controllers/post.controller.js'
import { verifyToken } from '../utils/verifyUser.js'

//verify
router.post('/create-post', verifyToken, postControllers.createPost)
router.get('/getpost', postControllers.getPost)
router.delete('/delete-post/:postId/:userID', verifyToken, postControllers.deletePost)
router.put('/update-post/:postId/:userID', verifyToken, postControllers.updatePost)

export default router