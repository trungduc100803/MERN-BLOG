import express from 'express';
import { verifyToken } from '../utils/verifyUser.js';
const router = express.Router();


import userController from '../controllers/user.controller.js';


router.put('/update/:userID',verifyToken, userController.updateUser)
router.delete('/delete/:userID',verifyToken, userController.deleteUser)


export default router