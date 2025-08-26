import express from 'express';
import { sessionGetHandler, loginPostHandler, logoutGetHandler, signUpPostHandler, adminGetHandler, accountCreationPostHandler, generateOtpPostHandler, resetPasswordPostHandler } from '../controllers/authController.js';

const authRouter = express.Router();

authRouter.post('/login', loginPostHandler);
// authRouter.post('/signUp', signUpPostHandler);
authRouter.get('/logout', logoutGetHandler);
authRouter.get('/session', sessionGetHandler);
authRouter.get('/getAllAdmin', adminGetHandler);
authRouter.post('/contactAdminForAccount', accountCreationPostHandler);
authRouter.post('/generateOtp', generateOtpPostHandler);
authRouter.post('/resetPassword', resetPasswordPostHandler);

export default authRouter;