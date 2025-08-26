import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import multer from 'multer';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const uploadPath = path.join(__dirname, '../uploads');

if (!fs.existsSync(uploadPath)) {
    fs.mkdir(uploadPath, { recursive: true }, (err) => {
        if (err) {
            console.error("Upload Directory Creation Failed");
            return;
        }
        console.log("Upload Directory Created Successfully");
    })
}

const storage = multer.diskStorage({
    destination: (request, file, cb) => {
        cb(null, uploadPath);
    },
    filename: (request, file, cb) => {
        cb(null, file.originalname);
    }
});


function createUploader(allowedTypes) {
    const filter = (request, file, cb) => {
        if (allowedTypes.includes(file.mimetype)) {
            cb(null, true);
        }
        else {
            cb(new Error("File is not allowed"), false);
        }
    }
    return multer({
        storage,
        fileFilter: filter,
        limits: 200 * 1024 * 1024, // 200mb
    });
}

export default createUploader;