import fs from 'fs';

async function deleteFile(path) {
    try {
        fs.unlink(path, (err) => {
            if (err) {
                console.log("Error in file deletion: ", err);
                return;
            }
        })
    }
    catch (e) {
        console.log("Error in deleteFile: ", e);
    }
}

export default deleteFile;