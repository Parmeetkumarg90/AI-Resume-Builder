import userModel from '../models/userModel.js';
import authModel from '../models/authModel.js';
import video2Audio from '../config/video2audio.js';
import getTextFromAudio from '../config/audio2text.js';
import path from 'path';
import { fileURLToPath } from 'url';
import sendMail from '../config/nodemailer.js';
import deleteFile from '../utils/deleteFIle.js';
import textIntoProcessesdData from '../config/text2info.js';
import mapProcessedData from '../utils/stageData.js';
import { io } from './socket.js';
import mongoose from "mongoose";

const SessionModel = mongoose.connection.collection("sessions");

import { Queue, Worker } from 'bullmq';
import IORedis from 'ioredis';
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const connection = new IORedis({
    host: "127.0.0.1",  // if Redis is local
    port: 6379,
    maxRetriesPerRequest: null,
    enableReadyCheck: false
});

//Producers
const fileProcessingQueue = new Queue("fileProcessing", { connection });

//Consumers
const fileProcessingWorker = new Worker("fileProcessing", async (job) => {
    const { bodyStage, sessionStage, videoFileName, userId, userEmail, sessionId } = job.data;
    // console.log("work started")
    const isValidStage = bodyStage <= sessionStage;
    if (isValidStage) {
        const audioFile = await video2Audio(path.join(__dirname, '../uploads'), videoFileName);
        if (!audioFile.success) {
            // mail -> "Audio conversion failed" 
            await sendMail(userEmail, userEmail, "Stage Completion Failed", `Dear ${userEmail}, we tried to extract data from your recording but somehow it is not possible. Kindly reupload your recording after relogin. Thankyou for your corporation with this in conveniance.`, "");
            io.emit("videoStage", { status: "Failed", id: userId });
        }
        if (isValidStage && bodyStage === 2) {
            await userModel.findOneAndUpdate({
                accounctId: userId
            }, {
                $set: {
                    earlyLifeRecording: videoFileName,
                    earlyLifeAudio: `${videoFileName}.mp3`
                }
            });
        }
        else if (isValidStage && bodyStage === 4) {
            await userModel.findOneAndUpdate({
                accounctId: userId
            }, {
                $set: {
                    professionalLifeRecording: videoFileName,
                    professionalLifeAudio: `${videoFileName}.mp3`
                }
            });
        }
        else if (isValidStage && bodyStage === 6) {
            await userModel.findOneAndUpdate({
                accounctId: userId
            }, {
                $set: {
                    currentLifeRecording: videoFileName,
                    currentLifeAudio: `${videoFileName}.mp3`
                }
            });
        }
    }
    else {
        try {
            await deleteFile(path.join(__dirname, '../uploads', videoFileName));
            await deleteFile(path.join(__dirname, '../uploads', `${videoFileName}.mp3`));
        }
        catch (e) {
            console.log("Error in video deletion: ", e);
        }
        await sendMail(userEmail, userEmail, "Stage Completion Failed", `Dear ${userEmail}, we have noticed that you are trying to uploading video of an invalid stage. Please relogin after sometime if you are faceing any network issue or any other issue or contact your admin.`, "");
        io.emit("videoStage", { status: "Failed", id: userId });
    }

    let audio2TextData = await getTextFromAudio(path.join(__dirname, '../uploads', videoFileName));
    if (audio2TextData && (bodyStage === 2 || bodyStage === 4 || bodyStage === 6)) {
        const processedData = JSON.parse(await textIntoProcessesdData(audio2TextData, bodyStage));
        const dataTosave = mapProcessedData(bodyStage, processedData);
        await userModel.findOneAndUpdate(
            { accounctId: userId },
            { $set: dataTosave },
            { new: true });
        if (bodyStage === sessionStage) {
            await authModel.findOneAndUpdate({ id: userId }, { $set: { stage: sessionStage + 1 } });
        }
        const sessDoc = await SessionModel.findOne({ _id: sessionId });

        if (sessDoc && bodyStage === sessionStage) {
            let sessionData = JSON.parse(sessDoc.session);
            sessionData.stage = sessionStage + 1;
            await SessionModel.updateOne(
                { _id: sessionId },
                { $set: { session: JSON.stringify(sessionData) } }
            );
        }
        // mail -> data has been extracted
        await sendMail(userEmail, userEmail, "Stage has been completed.", `Dear ${userEmail}, we are excited to share a message with you that we have successfuly extracted you information from you recording and also wanted from you to relogin. Thankyou ${userEmail} for waiting for such a long time.`, "");
        io.emit("videoStage", { status: "Success", id: userId });
    }
    else {
        try {
            await deleteFile(path.join(__dirname, '../uploads', videoFileName));
            await deleteFile(path.join(__dirname, '../uploads', `${videoFileName}.mp3`));
        }
        catch (e) {
            console.log("Error in video deletion: ", e);
            // mail -> data extraction has been failed Invalid Stage or audio has no voice
        }
        await sendMail(`${userEmail}`, userEmail, "Stage Completion Failed", `Dear ${userEmail}, we have tried to extract information from your recording but failed in it. It may be of any reason. Either your recording has no voice or any other issue. Please check your recording again for not facing such consequences further.`, "");
        io.emit("videoStage", { status: "Failed", id: userId });
    }
}, { connection });

export { fileProcessingQueue, fileProcessingWorker };