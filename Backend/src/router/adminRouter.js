import express from 'express';
import { allUsersGetHandler, newUserPostHandler, userActivationGetHandler, userAccountDeletionHandler, allProfilesGetHandler, profileApproveGetHandler, profileRejectGetHandler } from '../controllers/adminController.js';

const adminRouter = express.Router();

adminRouter.get('/getAllUsers', allUsersGetHandler);
adminRouter.get('/getallProfiles', allProfilesGetHandler);
adminRouter.post('/user', newUserPostHandler);

adminRouter.get('/user/:id', userActivationGetHandler);
adminRouter.delete('/user/:id', userAccountDeletionHandler);

adminRouter.get('/approve/:id', profileApproveGetHandler);
adminRouter.get('/reject/:id', profileRejectGetHandler);

export default adminRouter;