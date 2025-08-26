import express from 'express';
import authRouter from './authRouter.js';
import adminRouter from './adminRouter.js';
import userRouter from './userRouter.js';
import otherRouter from './otherRouter.js';
import { authAdmin, authUser, loginCheck } from '../middlewares/auth.js';

const apiRoute = express.Router();

apiRoute.use('/auth', authRouter);
apiRoute.use('/admin', authAdmin, adminRouter);
apiRoute.use('/user', authUser, userRouter);
apiRoute.use('/other', loginCheck, otherRouter);

export default apiRoute;