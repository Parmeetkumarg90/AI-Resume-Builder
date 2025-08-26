import userModel from '../models/userModel.js';
import authModel from '../models/authModel.js';
import createUploader from '../config/multer.js';
import path from 'path';
import { isValidMobileNumber } from '../utils/basic utils.js';
import deleteFile from '../utils/deleteFIle.js';
import { fileURLToPath } from 'url';
import { fileProcessingQueue } from '../config/bullMq.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const videoMimetypes = ["video/mp4", "video/x-msvideo", "video/quicktime", "video/x-ms-wmv", "video/x-flv", "video/x-matroska", "video/webm", "video/mpeg", "video/3gpp", "video/x-m4v", "video/mp2t", "video/ogg"];

const imageMimetypes = ["image/jpeg", "image/png", "image/gif", "image/bmp", "image/webp", "image/tiff", "image/svg+xml", "image/x-icon", "image/heif", "image/avif", "image/vnd.microsoft.icon", "image/vnd.wap.wbmp", "image/x-pcx", "image/x-ppm", "image/x-cmu-raster", "image/x-pict", "image/x-raw", "image/x-nikon-nef", "image/x-canon-cr2", "image/x-sony-arw", "image/x-adobe-dng"];

async function allDataGetHandler(request, response) {
    try {
        const userId = request.session.userId;
        if (!userId) {
            return response.status(401).json({ status: "LogIn First" });
        }
        const user = await userModel.findOne({ accounctId: userId }, { accounctId: 0, _id: 0, __v: 0 }).lean();
        if (!user) {
            return response.status(404).json({ status: "Invalid User" });
        }
        user.userImage = `${process.env.BACKEND_URL}/upload/${user.userImage}`;
        user.email = request.session.email;
        return response.status(200).json({ status: "User Data Fetched Successfully", allProfileData: user });
    }
    catch (e) {
        console.log("Error in allDataGetHandler: ", e);
        return response.status(500).json({ status: "Something Unexpected Occurred" });
    }
}

async function stage1PostHandler(request, response) {
    createUploader(imageMimetypes).single("userImage")(request, response, async (error) => {
        if (error) {
            console.log("Multer Error in stage1PostHandler: \n", error);
            return response.status(500).json({ status: "Error Occured During Uploading Profile Image" });
        }
        const profileDetail = await userModel.findOne({ accounctId: request.session.userId });
        try {
            const { phoneNumber } = request.body;
            // console.log(phoneNumber, typeof (phoneNumber))
            if (!isValidMobileNumber(phoneNumber)) {
                return response.status(404).json({ status: "Invalid Mobile Number" });
            }
            // console.log(request.body, request.file);
            // console.log(profileDetail)
            if (!request.body || (!request.file && !profileDetail.userImage && (profileDetail.userImage).trim() === "")) {
                return response.status(400).json({ status: "Data or image is missing" });
            }
            // console.log(request.file)
            // console.log(request.body)
            const updateData = {};
            for (const [key, value] of Object.entries(request.body)) {
                updateData[key] = value ?? "";
            }

            if (request.file && request.file.originalname) {
                if (profileDetail?.userImage !== request.file.originalname)
                    try {
                        await deleteFile(path.join(__dirname, '../uploads', profileDetail.userImage));
                    }
                    catch (e) {
                        console.log("Error in file deletion stage1PostHandler: ", e);
                    }
                updateData["userImage"] = request.file.originalname;
            }

            if (Object.keys(updateData).length === 0) {
                return response.status(400).json({ status: "No valid data to update" });
            }

            updateData.email = request.session.email;

            await userModel.findOneAndUpdate(
                { accounctId: request.session.userId },
                { $set: updateData },
                { upsert: true }
            );

            if (request.session.stage === 1) {
                await authModel.findOneAndUpdate(
                    { id: request.session.userId },
                    { $set: { stage: request.session.stage + 1 } }
                );
                request.session.stage += 1;
            }

            return response.status(200).json({ status: "Data recorded successfully" });
        } catch (e) {
            if (profileDetail?.userImage !== request.file.originalname) {
                try {
                    await deleteFile(path.join(__dirname, '../uploads', request.file.originalname));
                }
                catch (e) {
                    console.log("Error in video deletion: ", e);
                }
            }
            console.log("Error in stage1PostHandler: ", e);
            return response.status(500).json({ status: "Something Unexpected Occurred" });
        }
    });
}

async function stage357PostHandler(request, response) {
    try {
        if (!request.body) {
            return response.status(404).json({ status: "Data is missing" });
        }
        const { stage } = request.body;
        // console.log(stage, request.session.stage);
        // console.log((stage != 3 && stage != 5 && stage != 7));
        if (!stage || (stage != 3 && stage != 5 && stage != 7) || stage > request.session.stage) {
            return response.status(400).json({ status: "Invalid Stage Data Submission" });
        }
        await userModel.findOneAndUpdate({ accounctId: request.session.userId }, { $set: request.body });
        if (stage === request.session.stage) {
            await authModel.findOneAndUpdate({ id: request.session.userId }, { $set: { stage: request.session.stage + 1 } });
            request.session.stage += 1;
        }
        return response.status(200).json({ status: "Data has been submitted successfully" });
    }
    catch (e) {
        console.log("Error in stage357PostHandler: ", e);
        return response.status(500).json({ status: "Something Unexpected Occurred" });
    }
}

async function videoStagePostHandler(request, response) {
    createUploader(videoMimetypes).single("video")(request, response, async (error) => {
        if (error) {
            console.log("Multer Error in videoStagePostHandler: \n", error);
            return response.status(500).json({ status: "Error Occured During Uploading Pdf" });
        }
        try {
            if (!request.file) {
                return response.status(500).json({ status: "Recording is missing" });
            }
            // console.log(request.file)
            const stage = JSON.parse(request.body.stage);
            if (!stage || (stage != 2 && stage != 4 && stage != 6) || stage > request.session.stage) {
                return response.status(400).json({ status: "Invalid Stage Data Submission" });
            }
            await fileProcessingQueue.add("processRecording", {
                bodyStage: stage,
                sessionStage: request.session.stage,
                videoFileName: request.file.originalname,
                userId: request.session.userId,
                userEmail: request.session.email,
                sessionId: request.sessionID
            });

            // console.log("All task completed");
            return response.status(200).json({ status: "Your Recording has been submitted. Shortly you will receive an email for further steps." });

        } catch (e) {
            try {
                await deleteFile(path.join(__dirname, '../uploads', request.file.originalname));
            }
            catch (e) {
                console.log("Error in video deletion: ", e);
            }
            console.log("Error in videoStagePostHandler: ", e);
            return response.status(500).json({ status: "Something Unexpected Occurred" });
        }
    });
}

export { allDataGetHandler, stage1PostHandler, stage357PostHandler, videoStagePostHandler };