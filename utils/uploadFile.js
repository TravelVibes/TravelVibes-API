import AWS from 'aws-sdk';
import multer from 'multer';
import express from 'express';
import { removeSpaceInFileName } from './removeSpaceInFileName.js';

const uploadRoutes = express.Router();

AWS.config.update({
  region: 'ap-southeast-1',
  accessKeyId: process.env.S3_ACCESS_KEY,
  secretAccessKey: process.env.S3_SECRET_KEY,
});

// Create an S3 service object
const s3 = new AWS.S3();

// normal upload
const upload = multer({
  storage: multer.memoryStorage(),
  limits: {
    fileSize: 10 * 1024 * 1024, // limit file size to 10MB
  },
});

// making a service for upload image to S3
const s3Upload = (files) => {
  const uploadPromises = files.map((file) => {
    return new Promise((resolve, reject) => {
      const [fileName, extension] = file.originalname.split('.'); // Get the file extension
      const uniqueFilename =
        removeSpaceInFileName(fileName) +
        Date.now() +
        '-' +
        Math.round(Math.random() * 1e9);
      const key = 'uploads/' + uniqueFilename + '.' + extension;
      const params = {
        Bucket: process.env.S3_BUCKET_NAME,
        Key: key,
        Body: file.buffer,
      };

      s3.upload(params, (error, data) => {
        if (error) {
          console.error(error);
          reject('Error uploading file ');
        } else {
          resolve({
            fileName: data.Key,
            // url: data.Location,
          });
        }
      });
    });
  });

  return Promise.all(uploadPromises);
};

// for testing only
uploadRoutes.post('/', upload.single('image'), async (req, res) => {
  try {
    const params = {
      Bucket: process.env.S3_BUCKET_NAME,
      Key: req.file.originalname,
      Body: req.file.buffer,
    };
    // second way
    s3.upload(params, (err, data) => {
      if (err) {
        console.error(err);
        return res.status(500).send('Error uploading file');
      }

      res.json({
        message: 'Image saved',
        url: data.Location,
        fileName: data.Key,
      });
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

export { uploadRoutes, s3Upload };
