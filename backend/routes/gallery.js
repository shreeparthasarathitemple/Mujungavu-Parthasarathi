const express = require('express');
const router = express.Router();
const multer = require('multer');
const { S3Client, PutObjectCommand, DeleteObjectCommand } = require('@aws-sdk/client-s3');
const Gallery = require('../models/Gallery');
const auth = require('../middleware/auth');

// Setup multer for memory storage
const storage = multer.memoryStorage();
const upload = multer({ storage: storage });

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

// Get all gallery images
router.get('/', async (req, res) => {
  try {
    const images = await Gallery.find().sort({ createdAt: -1 });
    res.json(images);
  } catch (err) {
    res.status(500).json({ message: 'Server Error' });
  }
});

// Upload a new image (Protected)
router.post('/upload', auth, upload.single('image'), async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ message: 'No file uploaded' });
    }

    if (!s3Client || !bucketName || !publicUrlBase) {
      return res.status(500).json({ message: 'Cloudflare R2 credentials missing' });
    }

    const fileExt = req.file.originalname.split('.').pop();
    const fileName = `${Date.now()}-${Math.round(Math.random() * 1E9)}.${fileExt}`;
    const filePath = `gallery/${fileName}`;
    
    // Upload to Cloudflare R2
    const command = new PutObjectCommand({
      Bucket: bucketName,
      Key: filePath,
      Body: req.file.buffer,
      ContentType: req.file.mimetype,
    });

    try {
      await s3Client.send(command);
    } catch (error) {
      console.error('Cloudflare R2 upload error:', error);
      return res.status(500).json({ message: 'Failed to upload image' });
    }

    // Construct the public URL
    const publicUrl = `${publicUrlBase.replace(/\/$/, '')}/${filePath}`;

    // Save to MongoDB
    const mediaType = req.file.mimetype.startsWith('video/') ? 'video' : 'image';
    const newImage = new Gallery({ imageUrl: publicUrl, mediaType });
    await newImage.save();

    res.status(201).json(newImage);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server Error' });
  }
});

// Delete an image (Protected)
router.delete('/:id', auth, async (req, res) => {
  try {
    const image = await Gallery.findById(req.params.id);
    if (!image) return res.status(404).json({ message: 'Image not found' });

    // Try to delete from Cloudflare R2 (extract path from URL)
    if (s3Client && bucketName) {
      try {
        const urlObj = new URL(image.imageUrl);
        const filePath = urlObj.pathname.substring(1); // Remove leading slash
        
        const deleteCommand = new DeleteObjectCommand({
          Bucket: bucketName,
          Key: filePath,
        });
        
        await s3Client.send(deleteCommand);
      } catch (deleteErr) {
        console.error('Cloudflare R2 delete error:', deleteErr);
      }
    }

    await Gallery.findByIdAndDelete(req.params.id);
    res.json({ message: 'Image deleted' });
  } catch (err) {
    res.status(500).json({ message: 'Server Error' });
  }
});

module.exports = router;
