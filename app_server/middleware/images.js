// Dont run this file when in test environment because we don't have the firebase json file
if (!(process.env.NODE_ENV === 'test')) {
  const admin = require('firebase-admin');
  const Multer = require('multer');
  const mongoose = require('mongoose');
  const Service = mongoose.model('Service');

  const serviceAccount = require('../../homefornow-fd495-firebase-adminsdk-xy17w-62ee8ab849.json');
  admin.initializeApp({
    credential: admin.credential.cert(serviceAccount),
    storageBucket: 'homefornow-fd495.appspot.com',
  });


  const bucket = admin.storage().bucket();

  function sendUploadToFirebase(req, res, next) {
    if (!req.file) {
      return next();
    }

    const splitName = req.file.originalname.split('.');
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

  function getImagesForService(service, serviceUri) {
    return new Promise((resolve, reject) => {
      let metadataCount = 0;
      let listCount = 0;
      const imageDict = [];

      if (service.img != null && service.img.length > 0) {
        listCount = service.img.length;
        const bucket = admin.storage().bucket();

        service.img.forEach((image) => {
          // Get the metadata for each image reference
          bucket.file(image).getMetadata().then((data) => {
            // Add the media link for the image to 'imageList'
            imageDict[service.img.indexOf(image)] = data[0].mediaLink;
            metadataCount += 1;

            // If all the images have been added to imageList, render the page with these images
            if (metadataCount === listCount) {
              resolve({
                name: service.name,
                uri: serviceUri,
                images: imageDict,
              });
            }
          }).catch((err) => {
            console.log('[ERROR]: Could not get metadata: '.concat(err));
            reject(err);
          });
        });
      } else {
        resolve({
          name: service.name,
          uri: serviceUri,
        });
      }
    });
  }

  function deleteImageFromService(service, serviceUri, index) {
    return new Promise((resolve, reject) => {
      // Delete the image specified by 'index' from Firebase
      const bucket = admin.storage().bucket();
      bucket.file(service.img[index]).delete().then(() => {
        // After deleting the image from Firebase, delete the image from MongoDB
        const len = service.img.length;
        const result = [];

        // Remove the reference to the image from the list of images
        for (let i = 0; i < len; i += 1) {
          if (i < index) {
            result[i] = service.img[i];
          }
          if (i > index) {
            result[i - 1] = service.img[i];
          }
        }

        // Update the MongoDB database with the new list of images, returning
        // when succesful
        Service.findOneAndUpdate(
          { uri: serviceUri },
          { $set: { img: result } },
          { runValidators: true, new: true }
        ).exec().then(() => {
          resolve();
        }).catch((err) => {
          console.log('[ERROR]: Failed to update service.img: '.concat(err));
          reject(err);
        });
      }).catch((err) => {
        console.log('[ERROR]: Could not delete image from Firebase: '.concat(err));
        reject(err);
      });
    });
  }

  function deleteLogoFromService(serviceLogo, serviceUri) {
    return new Promise((resolve, reject) => {
      const bucket = admin.storage().bucket();
      bucket.file(serviceLogo).delete().then(() => {
        // Update the MongoDB database with the new list of images, returning
        // when succesful
        Service.findOneAndUpdate(
          { uri: serviceUri },
          { $set: { logo: '' } },
          { runValidators: true, new: true }
        ).exec().then(() => {
          resolve();
        }).catch((err) => {
          console.log('[ERROR]: Failed to update service.img: '.concat(err));
          reject(err);
        });
      }).catch((err) => {
        console.log('[ERROR]: Could not delete image from Firebase: '.concat(err));
        reject(err);
      });
    });
  }

  function getLogoForService(serviceLogo, serviceUri) {
    return new Promise((resolve, reject) => {
      if (serviceLogo == null || serviceLogo == '') {
        resolve(null);
      }
      const bucket = admin.storage().bucket();
      bucket.file(serviceLogo).getMetadata().then((data) => {
        resolve(data[0].mediaLink);
      }).catch((err) => {
        console.log('[ERROR]: Could not get image from Firebase: '.concat(err));
        reject(err);
      });
    });
  }

  // Multer handles parsing multipart/form-data requests.
  // This instance is configured to store images in memory.
  // This makes it straightforward to upload to Cloud Storage.
  const multer = Multer({
    storage: Multer.MemoryStorage,
    limits: {
      fileSize: 2 * 1024 * 1024, // no larger than 2mb
    },
    fileFilter: (req, file, cb) => {
      if (file.mimetype !== 'image/png'
          && file.mimetype !== 'image/jpg'
          && file.mimetype !== 'image/jpeg'
          && file.mimetype !== 'image/bmp') {
        return cb(null, false);
      }

      return cb(null, true);
    },
  });

  module.exports = {
    sendUploadToFirebase,
    getImagesForService,
    deleteImageFromService,
    getLogoForService,
    deleteLogoFromService,
    multer,
  };
}
