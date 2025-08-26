import express from 'express';
import { profileGetHandler, profileApproveGetHandler, profileChangeGetHandler, allApprovedProfiles } from '../controllers/otherController.js';

const otherRouter = express.Router();

otherRouter.get('/profile/:id', profileGetHandler);
otherRouter.get('/profile/change/:id', profileChangeGetHandler);
otherRouter.get('/profile/approve/:id', profileApproveGetHandler);
otherRouter.get('/community', allApprovedProfiles);

export default otherRouter;