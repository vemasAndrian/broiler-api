import express from 'express';
import { getUserProfile, loginUser, registerUser, createUserProfile, getProfile, updateProfile } from '../controllers/userController.js';

const userRouter = express.Router();

userRouter.post('/register', registerUser);
userRouter.get('/profile/:id', getProfile);
userRouter.put('/profile/:id', updateProfile);
userRouter.post('/login', loginUser);
userRouter.post('/profile', createUserProfile);


export default userRouter;