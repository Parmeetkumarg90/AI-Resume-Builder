import authModel from "../models/authModel.js";
import userModel from '../models/userModel.js';
import deleteFile from '../utils/deleteFIle.js';
import path from "path";
import { generateUniqueText, isValidGmail, isValidMobileNumber } from "../utils/basic utils.js";
import sendMail from '../config/nodemailer.js';
import { encryptPassword } from '../config/bcrypt.js';
import { io } from '../config/socket.js';
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

//email,mobileNumber,createdAt,status
async function allUsersGetHandler(request, response) {
    try {
        const allUsers = await authModel.find({ createdBy: request.session.userId, role: 'user' }, { _id: 0, id: 1, email: 1, mobileNumber: 1, isSendForApproval: 1, createdAt: 1, isAccountActive: 1 });
        // console.log(allUsers)
        return response.status(200).json({ status: "All Users Fetched Successfully", allUsers });
    }
    catch (e) {
        console.log("Error in allAdminGetHandler: ", e);
        return response.status(400).json({ status: "Something Unexpected Occured" });
    }
}

async function newUserPostHandler(request, response) {
    try {
        let { email, mobileNumber } = request.body;
        email = email.trim();
        if (!request.body || !email || !mobileNumber) {
            return response.status(404).json({ status: "Please fill all Email, Mobile Number and Choose Admin" });
        }
        if (!isValidGmail(email)) {
            return response.status(404).json({ status: "Invalid Email Address" });
        }
        if (!isValidMobileNumber(mobileNumber)) {
            return response.status(404).json({ status: "Invalid Mobile Number" });
        }
        const checkUser = await authModel.findOne({ email: email });
        if (checkUser) {
            return response.status(400).json({ status: "Account is already present" });
        }
        const password = generateUniqueText().toString();
        const hashPassword = await encryptPassword(password);
        const user = await authModel.create({ email: email, password: hashPassword, mobileNumber: mobileNumber, createdBy: request.session.userId, isAccountActive: true });
        sendMail("Hello user", user.email, "Account has been created", "Your accounct has been created now you can login", `<h1>Your Email: ${user.email}</h1><br><h3>Your temporary password: ${password}</h3>`);
        // console.log(otpRsult)
        // console.log(user)
        return response.status(200).json({
            status: "Account Created successfully", data: {
                email: user.email,
                mobileNumber: user.mobileNumber,
                role: user.role,
                isAccountActive: user.isAccountActive,
                id: user.id,
                createdAt: user.createdAt,
            }
        });
    }
    catch (e) {
        console.log("Error in newUserPostHandler: ", e);
        return response.status(400).json({ status: "Something Unexpected Occured" });
    }
}

// id -> userid
async function userActivationGetHandler(request, response) {
    try {
        const userId = request.params.id;
        if (!userId) {
            return response.status(400).json({ status: "Invalid User Activation/Deactivation Request" });
        }
        const userDetail = await authModel.findOne({ id: userId });
        if (!userDetail) {
            return response.status(400).json({ status: "Invalid User Activation/Deactivation Request" });
        }
        if (request.session.userId !== userDetail.createdBy) {
            return response.status(401).json({ status: "You are not authorized to do this operation" });
        }
        userDetail.isAccountActive = !userDetail.isAccountActive;
        await userDetail.save();
        return response.status(200).json({ status: `Account ${userDetail.isAccountActive ? "Activated" : "Deactivated"} Successfully` });
    }
    catch (e) {
        console.log("Error in userActivationGetHandler: ", e);
        return response.status(400).json({ status: "Something Unexpected Occured" });
    }
}

async function userAccountDeletionHandler(request, response) {
    try {
        const userId = request.params.id;
        if (!userId) {
            return response.status(400).json({ status: "Invalid User Account Deletion Request" });
        }
        let userDetail = await authModel.findOneAndDelete({ id: userId, createdBy: request.session.userId });
        if (!userDetail) {
            return response.status(400).json({ status: "Invalid User Account Deletion Request" });
        }
        userDetail = await userModel.findOneAndDelete({ accounctId: userDetail.id });
        if (userDetail) {
            try {
                Promise.allSettled([
                    await deleteFile((path.join(__dirname, '../uploads', userDetail.earlyLifeRecording))),
                    await deleteFile((path.join(__dirname, '../uploads', userDetail.earlyLifeAudio))),
                    await deleteFile((path.join(__dirname, '../uploads', userDetail.professionalLifeRecording))),
                    await deleteFile((path.join(__dirname, '../uploads', userDetail.professionalLifeAudio))),
                    await deleteFile((path.join(__dirname, '../uploads', userDetail.currentLifeRecording))),
                    await deleteFile((path.join(__dirname, '../uploads', userDetail.currentLifeAudio))),
                ]);
            }
            catch (e) {
                console.log("Error in file deletion userAccounctDeletionHandler: ", e);
            }
        }
        return response.status(200).json({ status: `Account deleted Successfully` });
    }
    catch (e) {
        console.log("Error in userAccounctDeletionHandler: ", e);
        return response.status(400).json({ status: "Something Unexpected Occured" });
    }
}

async function allProfilesGetHandler(request, response) {
    try {
        const allProfiles = await authModel.find(
            { createdBy: request.session.userId, role: 'user', isAccountActive: 1, isSendForApproval: { $gt: 0 } },
            { _id: 0, id: 1, email: 1, mobileNumber: 1, createdAt: 1, isSendForApproval: 1 }
        );
        return response.status(200).json({ status: "All profiles fetched successfully", allProfiles });
    }
    catch (e) {
        console.log("Error in allProfilesGetHandler: ", e);
        return response.status(400).json({ status: "Something Unexpected Occured" });
    }
}

async function profileApproveGetHandler(request, response) {
    try {
        const profile = await authModel.findOneAndUpdate(
            { createdBy: request.session.userId, role: 'user', isAccountActive: 1, isSendForApproval: 1 },
            { $set: { isSendForApproval: 2, stage: 9 } },
            { new: true, projection: { _id: 0, id: 1, stage: 1 } },
        );
        if (!profile) {
            return response.status(400).json({ status: "Approval Failed" });
        }
        request.session.stage = profile.stage;
        io.emit("approve", { id: profile.id });
        return response.status(200).json({ status: "Profile has been approved successfully" });
    }
    catch (e) {
        console.log("Error in profileApproveGetHandler: ", e);
        return response.status(400).json({ status: "Something Unexpected Occured" });
    }
}

async function profileRejectGetHandler(request, response) {
    try {
        const profile = await authModel.findOneAndUpdate(
            { createdBy: request.session.userId, role: 'user', isAccountActive: 1, isSendForApproval: 1 },
            { isSendForApproval: 3 },
            { _id: 0, id: 1, email: 1, mobileNumber: 1, createdAt: 1, isAccountActive: 1 }
        );
        if (profile) {
            io.emit("reject", { id: profile.id });
            return response.status(200).json({ status: "Profile has been rejected successfully" });
        }
        return response.status(400).json({ status: "Rejection Failed" });
    }
    catch (e) {
        console.log("Error in profileRejectGetHandler: ", e);
        return response.status(400).json({ status: "Something Unexpected Occured" });
    }
}

export { allUsersGetHandler, newUserPostHandler, userActivationGetHandler, userAccountDeletionHandler, allProfilesGetHandler, profileApproveGetHandler, profileRejectGetHandler };