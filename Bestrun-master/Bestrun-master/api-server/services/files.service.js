'use strict';

const {Storage} = require('@google-cloud/storage');

const CLOUD_BUCKET = 'files-bestrun';

const fs = require('fs');

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

async function storeInBBDD(requestFile) {

    try {

        var data = Buffer.from(requestFile.buffer).toString('utf-8');
        data = data.toString('base64');

        return data;
    }
    catch (e) {
        throw Error(e);
    }

}

function _arrayBufferToBase64(buffer) {
    var binary = '';
    var bytes = new Uint8Array(buffer);
    var len = bytes.byteLength;
    for (var i = 0; i < len; i++) {
        binary += String.fromCharCode(bytes[i]);
    }
    return window.btoa(binary);
}

function _base64ToArrayBuffer(base64) {
    var binary_string = window.atob(base64);
    var len = binary_string.length;
    var bytes = new Uint8Array(len);
    for (var i = 0; i < len; i++) {
        bytes[i] = binary_string.charCodeAt(i);
    }
    return bytes.buffer;
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
    storeInBBDD,
    //sendFileToGCS,
    deleteFileToGCS,
    multerFile,
    multerImage
};
