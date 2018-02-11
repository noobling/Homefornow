const admin = require('firebase-admin');
const Multer = require('multer');

if (!(process.env.NODE_ENV === 'test')) {
  const serviceAccount = require('../../homefornow-fd495-firebase-adminsdk-xy17w-62ee8ab849.json');
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

  const splitName = req.file.originalname.split('.');
  console.log('splitName = ', splitName);
  let result = '';
  const possible = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';

  for (let i = 0; i < 5; i += 1) {
    result += possible.charAt(Math.floor(Math.random() * possible.length));
  }
  splitName[splitName.length - 2] += '-' + result;

  let newName = '';
  for (let i = 0; i < splitName.length; i += 1) {
    if (i === splitName.length - 1) {
      newName += '.';
    }
    newName += splitName[i];
  }

  const firebaseName = 'images/' + req.params.serviceUri + "/" + newName;
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
