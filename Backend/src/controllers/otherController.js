import authModel from '../models/authModel.js';
import userModel from '../models/userModel.js';
import { io } from '../config/socket.js';

async function profileGetHandler(request, response) {
    try {
        const userId = request.params.id;
        if (!userId) {
            return response.status(404).json({ status: "Profile ID is undefined" });
        }
        const user = await authModel.findOne({ id: userId });
        if (!user) {
            return response.status(400).json({ status: "Invalid Profile" });
        }
        let userDetail = null;
        if ((userId === request.session.userId) ||
            (request.session.role === "admin" && request.session.userId === user.createdBy && user.isSendForApproval >= 1) ||
            (request.session.stage === 9 && user.isSendForApproval === 2)
        ) {
            userDetail = await userModel.findOne({ accounctId: userId }, { accounctId: 0, _id: 0, __v: 0 }).lean();
        }
        if (!userDetail) {
            return response.status(404).json({ status: "Profile is either invalid or doesn't exists." });
        }
        userDetail.userImage = `${process.env.BACKEND_URL}/upload/${userDetail.userImage}`;
        userDetail.isSendForApproval = user.isSendForApproval;
        return response.status(200).json({ status: "Profile is valid", result: userDetail });
    }
    catch (e) {
        console.log("Error in profileGetHandler: ", e);
        return response.status(400).json({ status: "Something Unexpected Occured" });
    }
}

async function profileChangeGetHandler(request, response) {
    try {
        const userId = request.params.id;
        if (!userId || userId !== request.session.userId || request.session.stage !== 8) {
            return response.status(400).json({ status: "Either you are not allowed to do this operation or invalid profile" });
        }
        const result = await authModel.findOneAndUpdate({ id: userId, isSendForApproval: { $in: [0, 3], stage: 8 } }, { $set: { stage: request.session.stage - 1 } });
        if (!result) {
            return response.status(400).json({ status: "You are not allowed to reverse the stages" });
        }
        request.session.stage -= 1;
        return response.status(200).json({ status: "You are allowed to modify your profile." });
    }
    catch (e) {
        console.log("Error in profileChangeGetHandler: ", e);
        return response.status(400).json({ status: "Something Unexpected Occured" });
    }
}

async function profileApproveGetHandler(request, response) {
    try {
        const userId = request.params.id;
        if (!userId || userId !== request.session.userId || request.session.stage !== 8) {
            return response.status(400).json({ status: "Either you are not allowed to do this operation or invalid profile" });
        }
        const user = await authModel.findOneAndUpdate(
            { id: userId, isSendForApproval: { $in: [0, 3] } },
            { $set: { isSendForApproval: 1 } },
            { new: false }
        );
        if (!user) {
            return response.status(404).json({ status: "Either Profile has been sent for approval to admin or User is invalid." });
        }
        io.emit("sendForApproval", { id: user.createdBy });
        return response.status(200).json({ status: "Your profile has been sent to admin for approval." });
    }
    catch (e) {
        console.log("Error in profileApproveGetHandler: ", e);
        return response.status(400).json({ status: "Something Unexpected Occured" });
    }
}

async function allApprovedProfiles(request, response) {
    try {
        if (!request.session || !request.session.userId || !request.session.email || !request.session.stage) {
            return response.status(401).json({ status: "Login First" });
        }
        console.log("allApprovedProfiles: ", request.session);
        if (request.session.stage !== 9 && request.session.role === 'user') {
            return response.status(400).json({ status: "Currently you are not allowed for getting all profiles" });
        }
        const userIds = await authModel.find({ stage: 9, isSendForApproval: 2 }, { id: 1, _id: 0 }).lean();
        const arrayIds = userIds.map((item) => item.id);
        const userDetail = await userModel.find({ accounctId: { $in: arrayIds } }, { _id: 0, accounctId: 1, firstName: 1, middleName: 1, lastName: 1, userImage: 1, email: 1, phoneNumber: 1 });
        return response.status(200).json({ status: "All approved profiles", result: userDetail });
    }
    catch (e) {
        console.log("Error in allApprovedProfiles: ", e);
        return response.status(400).json({ status: "Something Unexpected Occured" });
    }
}

export { profileGetHandler, profileApproveGetHandler, profileChangeGetHandler, allApprovedProfiles };