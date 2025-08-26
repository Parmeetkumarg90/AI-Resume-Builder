import ffmpeg from 'fluent-ffmpeg';
import ffmpegInstaller from '@ffmpeg-installer/ffmpeg';

ffmpeg.setFfmpegPath(ffmpegInstaller.path);

const video2Audio = (path, videoFile) => {
    return new Promise((resolve, reject) => {
        const videoPath = `${path}/${videoFile}`;
        const outputFile = `${videoPath}.mp3`;

        ffmpeg(videoPath)
            .toFormat('mp3')
            .on('end', () => {
                // console.log("File converted from video to audio successfully");
                resolve({ success: true });
            })
            .on('error', (err) => {
                console.log("File conversion from video to audio failed: ", err);
                reject({ success: false });
            })
            .save(outputFile);
    });
}

export default video2Audio;