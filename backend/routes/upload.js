const express = require('express');
const router = express.Router();
const multer = require('multer');
const { S3Client, PutObjectCommand } = require('@aws-sdk/client-s3');

// Authentication middleware
const isAuthenticated = (req, res, next) => {
  if (req.session && req.session.adminId) {
    return next();
  }
  return res.status(401).json({ message: 'Unauthorized' });
};

// Setup multer for memory storage
const upload = multer({ storage: multer.memoryStorage() });

// Check Cloudflare R2 credentials
const accountId = process.env.CLOUDFLARE_ACCOUNT_ID;
const accessKeyId = process.env.CLOUDFLARE_R2_ACCESS_KEY_ID;
const secretAccessKey = process.env.CLOUDFLARE_R2_SECRET_ACCESS_KEY;
const bucketName = process.env.CLOUDFLARE_R2_BUCKET_NAME;
const publicUrlBase = process.env.CLOUDFLARE_R2_PUBLIC_URL;

let s3Client = null;
if (accountId && accessKeyId && secretAccessKey) {
  s3Client = new S3Client({
    region: 'auto',
    endpoint: `https://${accountId}.r2.cloudflarestorage.com`,
    credentials: {
      accessKeyId,
      secretAccessKey,
    }
  });
}

router.post('/', isAuthenticated, upload.single('image'), async (req, res) => {
  if (!s3Client || !bucketName || !publicUrlBase) {
    return res.status(500).json({ message: 'Cloudflare R2 credentials are not fully configured in the backend environment variables' });
  }

  try {
    const file = req.file;
    if (!file) {
      return res.status(400).json({ message: 'No image file provided' });
    }

    const fileExt = file.originalname.split('.').pop();
    const fileName = `${Date.now()}-${Math.random().toString(36).substring(7)}.${fileExt}`;
    const filePath = `gallery/${fileName}`;

    const command = new PutObjectCommand({
      Bucket: bucketName,
      Key: filePath,
      Body: file.buffer,
      ContentType: file.mimetype,
    });

    await s3Client.send(command);

    // Construct the public URL using the provided base URL
    const publicUrl = `${publicUrlBase.replace(/\/$/, '')}/${filePath}`;

    res.json({ imageUrl: publicUrl });
  } catch (err) {
    console.error('Upload route error:', err);
    res.status(500).json({ message: 'Server error during Cloudflare R2 upload' });
  }
});

module.exports = router;
