const admin = require('firebase-admin');
const Multer = require('multer');

const serviceAccount = require('../../homefornow-fd495-firebase-adminsdk-xy17w-62ee8ab849.json');

if (!(process.env.NODE_ENV === 'test')) {
  admin.initializeApp({
    credential: admin.credential.cert(serviceAccount),
    storageBucket: 'homefornow-fd495.appspot.com',
  });
}

const bucket = admin.storage().bucket();

function sendUploadToFirebase(req, res, next) {

  if (!req.file) {
    return next();
  }

  console.log("Made it here!");

  const firebaseName = 'images/{}'.format(req.file.originalname); // TODO fix so in the right folder too
  const file = bucket.file(firebaseName);

  const stream = file.createWriteStream({
    metadata: {
      contentType: req.file.mimetype,
    },
  });

  stream.on('error', (err) => {
    req.file.storageError = err;
    next(err);
  });

  stream.on('finish', () => {
    req.file.storageObject = firebaseName;
    next();
  });

  stream.end(req.file.buffer);
}

// Multer handles parsing multipart/form-data requests.
// This instance is configured to store images in memory.
// This makes it straightforward to upload to Cloud Storage.
const multer = Multer({
  storage: Multer.MemoryStorage,
  limits: {
    fileSize: 10 * 1024 * 1024, // no larger than 10mb
  },
});

module.exports = {
  sendUploadToFirebase,
  multer,
};
