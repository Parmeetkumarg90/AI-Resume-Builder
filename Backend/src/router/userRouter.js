import express from 'express';
import { allDataGetHandler, stage1PostHandler, stage357PostHandler, videoStagePostHandler } from '../controllers/userController.js';

const userRouter = express.Router();

userRouter.get('/', allDataGetHandler);
userRouter.post('/stage1', stage1PostHandler);
userRouter.post('/stage357', stage357PostHandler);
userRouter.post('/videoStage246', videoStagePostHandler);

export default userRouter;