import React, { useEffect, useRef, useState } from 'react';
import RecordRTC, { invokeSaveAsDialog } from 'recordrtc';
import sessionStore from '../../store';
import { Flex, Button, Typography, message, Upload } from 'antd';
import { PostRequest } from '../../serivces/auth';
import type { UploadFile } from "antd/es/upload/interface";
import { CloudUploadOutlined } from '@ant-design/icons';
import socket from '../../config/socket';

const Record: React.FC<{ title: string, description: string[], name_of_video: string; uploadApi: string, stage: number }> = ({ title, description, name_of_video, uploadApi, stage }) => {
    const videoRef = useRef<HTMLVideoElement>(null); // point to video element
    const recorderRef = useRef<RecordRTC | null>(null); // store RecordRtc element
    const [messageApi, contextHolder] = message.useMessage();
    const [blob, setBlob] = useState<Blob | null>(null); // store recording
    const [recording, setRecording] = useState(false); // track recording active or not
    const [fileList, setFileList] = useState<UploadFile<any>[]>([]);

    const stopCamera = () => {
        const tracks = (videoRef.current?.srcObject as MediaStream)?.getTracks();
        tracks?.forEach(t => t.stop());
        if (videoRef.current) videoRef.current.srcObject = null;
    };

    const start = async () => {
        setBlob(null);
        const stream = await navigator.mediaDevices.getUserMedia({ video: true, audio: true });
        videoRef.current!.srcObject = stream;
        videoRef.current!.play();
        const recorder = new RecordRTC(stream, { type: 'video', mimeType: 'video/webm' });
        recorder.startRecording();
        recorderRef.current = recorder;
        setRecording(true);
    };

    const stop = () => recorderRef.current?.stopRecording(() => {
        const recorded = recorderRef.current?.getBlob();
        setBlob(recorded || null);
        stopCamera();
        if (videoRef.current && recorded) {
            videoRef.current.src = URL.createObjectURL(recorded);
            videoRef.current.srcObject = null;
        }
        recorderRef.current = null;
        setRecording(false);
    });

    const upload = async () => {
        if ((!fileList.length && !blob) || recording) {
            if (recording) {
                messageApi.error("Video is currently recording.");
                return;
            }
            else if (!fileList.length && !blob) {
                messageApi.error("Either record your video or upload your video.");
                return;
            }
        }
        if (blob && fileList.length) {
            messageApi.error("Either upload video or record video.You have selected both");
            return;
        }
        const form = new FormData();
        form.append("stage", `${stage}`);
        if (blob) {
            const cleanBlob = new Blob([blob], { type: "video/webm" });
            form.append("video", cleanBlob, `${name_of_video}.webm`);
        }
        else if (fileList.length) {
            const videoData = fileList?.[0]?.originFileObj;
            if (videoData) {
                const renamedFile = new File([videoData], `${name_of_video}.webm`, { type: videoData.type });
                form.append("video", renamedFile);
            }
        }
        else {
            messageApi.error("Either record your video or upload your video.");
            return;
        }
        const result = await PostRequest(uploadApi, form);
        if (result) {
            // console.log(stage+1);
            messageApi.success(result.status);
            // sessionStore.getState().updateStage(stage + 1);
            // sessionStore.getState().updateDBStage(stage + 1);
        }
        else {
            messageApi.error("Error occured while uploading your recording");
        }
        if (blob) {
            setBlob(null);
            recorderRef.current = null;
            stopCamera();
        }
    };

    useEffect(() => {
        socket.on("videoStage", (data) => {
            if (data.id === sessionStore.getState().session?.Credential.userId) {
                if (data.status === "Failed") {
                    messageApi.error("Video Processing Failed");
                }
                else {
                    messageApi.success("Video Processing Stage");
                    sessionStore.getState().updateStage(stage + 1);
                    sessionStore.getState().updateDBStage(stage + 1);
                }
            }
        });
        return () => {
            socket.off("videoStage");
        };
    }, []);

    return (
        <Flex className=' w-full justify-center items-center' vertical>
            {contextHolder}
            <Typography.Title
                level={4}
                className='text-white text-center shadow-xl bg-blue-500 w-full p-5 rounded-2xl'
            >
                {title}
            </Typography.Title>
            <video ref={videoRef} controls className="w-3/4" />
            <Flex
                className='p-5 w-fit md:w-full flex-col md:flex-row md:justify-between bg-slate-800 m-5 rounded-xl'
            >
                <Flex
                    vertical
                    className='w-full md:w-1/2 px-3 border-white md:border-r-2'
                >
                    <Typography.Title level={2} className='text-white text-center'>
                        Instructions
                    </Typography.Title>
                    {description.map((eachDesc) => (
                        <Typography.Paragraph
                            key={eachDesc}
                            className='text-white text-lg list-item'
                        >
                            {eachDesc}
                        </Typography.Paragraph>
                    ))}
                </Flex>
                <Flex vertical className='w-full md:w-1/2 justify-evenly items-center border-white md:border-l-2'>
                    <Button
                        onClick={recording ? stop : start}
                        className='text-white hover:bg-blue-500 w-fit py-5 px-8'
                    >
                        {recording ? '🛑 Stop' : '🎬 Start'} Recording
                    </Button>
                    {blob &&
                        <Flex className="flex-col md:flex-row justify-evenly">
                            <Button
                                onClick={() => { invokeSaveAsDialog(blob, `${name_of_video}.webm`); stopCamera(); }}
                                className='text-white hover:bg-blue-500 w-fit py-5 px-8'
                            >
                                💾 Download
                            </Button>
                            <Button
                                onClick={() => {
                                    setBlob(null);
                                    stopCamera();
                                    if (videoRef.current) {
                                        videoRef.current.src = '';
                                        videoRef.current.srcObject = null;
                                    }
                                    recorderRef.current = null;
                                }}
                                className='text-white hover:bg-blue-500 w-fit py-5 px-8'
                            >
                                🗑️ Delete
                            </Button>
                        </Flex>
                    }
                    <Upload beforeUpload={() => false} accept='' maxCount={1}
                        fileList={fileList} // controlled file list
                        onChange={({ fileList }) => setFileList(fileList)} // update list
                        onRemove={() => setFileList([])} // remove file 
                        className='text-white'>
                        <Button className='h-fit text-white hover:bg-blue-500 w-fit py-2 px-5 text-5xl flex flex-col'>
                            <CloudUploadOutlined />
                            <Typography.Paragraph className='text-white'>Upload Recording</Typography.Paragraph>
                        </Button>
                    </Upload>
                    <Button
                        onClick={upload}
                        className='text-white hover:bg-blue-500 w-fit py-5 px-8'
                    >
                        📤 Submit
                    </Button>
                </Flex>
            </Flex>
        </Flex >
    );
};

export default Record;