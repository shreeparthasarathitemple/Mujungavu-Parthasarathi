const express = require('express');
const router = express.Router();
const multer = require('multer');
const { createClient } = require('@supabase/supabase-js');
// Authentication middleware
const isAuthenticated = (req, res, next) => {
  if (req.session && req.session.adminId) {
    return next();
  }
  return res.status(401).json({ message: 'Unauthorized' });
};

// Setup multer for memory storage
const upload = multer({ storage: multer.memoryStorage() });

// Check Supabase credentials
const supabaseUrl = process.env.SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_KEY;

let supabase = null;
if (supabaseUrl && supabaseKey) {
  supabase = createClient(supabaseUrl, supabaseKey);
}

router.post('/', isAuthenticated, upload.single('image'), async (req, res) => {
  if (!supabase) {
    return res.status(500).json({ message: 'Supabase credentials are not configured in the backend' });
  }

  try {
    const file = req.file;
    if (!file) {
      return res.status(400).json({ message: 'No image file provided' });
    }

    const fileExt = file.originalname.split('.').pop();
    const fileName = `${Date.now()}-${Math.random().toString(36).substring(7)}.${fileExt}`;
    const filePath = `${fileName}`;

    const { data, error } = await supabase.storage
      .from('gallery')
      .upload(filePath, file.buffer, {
        contentType: file.mimetype,
        cacheControl: '3600',
        upsert: false
      });

    if (error) {
      console.error('Supabase upload error:', error);
      return res.status(500).json({ message: 'Failed to upload to Supabase', error: error.message });
    }

    const { data: { publicUrl } } = supabase.storage
      .from('gallery')
      .getPublicUrl(filePath);

    res.json({ imageUrl: publicUrl });
  } catch (err) {
    console.error('Upload route error:', err);
    res.status(500).json({ message: 'Server error during upload' });
  }
});

module.exports = router;
