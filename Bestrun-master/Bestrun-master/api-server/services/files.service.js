'use strict';

const {Storage} = require('@google-cloud/storage');

const CLOUD_BUCKET = 'files-bestrun';

const storage = new Storage({
    keyFilename: 'thermal-outlet-227216-9cab3c2a9afb.json',
    projectId: 'thermal-outlet-227216',
});
const bucket = storage.bucket(CLOUD_BUCKET);

function getPublicUrl(filename) {
    if (filename)
        return `https://storage.googleapis.com/${CLOUD_BUCKET}/${filename}`;
    return null;
}

function sendFileToGCS(requestFile) {
    return new Promise((resolve,reject)=>{
        const gcsname = Date.now() + requestFile.originalname;
        const file = bucket.file(gcsname);

        const stream = file.createWriteStream({
            metadata: {
                contentType: requestFile.mimetype,
            },
            resumable: false,
        });

        stream.on('error', err => {
            console.log(err);
            reject(Error('Error uploading image'));
        });

        stream.on('finish', () => {
            file.makePublic().then(() => {
                resolve(gcsname);
            });
        });

        stream.end(requestFile.buffer);
    });
}

async function deleteFileToGCS(gcsname) {
    try {
        return bucket.file(gcsname).delete();
    } catch (e) {
        console.log(e);
        throw Error("Error Occured while Deleting the file")
    }
}

const Multer = require('multer');
const multerFile = Multer({
    storage: Multer.MemoryStorage,
    limits: {
        fileSize: 15 * 1024 * 1024, // no larger than 15mb
    },
});

const multerImage = Multer({
    storage: Multer.MemoryStorage,
    limits: {
        fileSize: 5 * 1024 * 1024, // no larger than 5mb
    },
});

module.exports = {
    getPublicUrl,
    sendFileToGCS,
    deleteFileToGCS,
    multerFile,
    multerImage
};
