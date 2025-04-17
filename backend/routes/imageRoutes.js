const express = require('express');
const router = express.Router();
const cloudinary = require('../cloudinary'); // ← Correct import

router.post('/delete', async (req, res) => {
  const { public_id } = req.body;
  console.log('Received public_id:', public_id);

  if (!public_id) {
    return res.status(400).json({ success: false, error: 'public_id is required' });
  }

  try {
    const result = await cloudinary.uploader.destroy(public_id);
    console.log('Cloudinary destroy result:', result);
    res.status(200).json({ success: true, result });
  } catch (error) {
    console.error('Cloudinary error:', error);
    res.status(500).json({ success: false, error: error.message });
  }
});

router.post('/delete-multiple', async (req, res) => {
    const { public_ids } = req.body;
    console.log('Received public_ids:', public_ids);
  
    if (!Array.isArray(public_ids) || public_ids.length === 0) {
      return res.status(400).json({ success: false, error: 'public_ids array is required' });
    }
  
    try {
      const results = await Promise.all(
        public_ids.map(id => cloudinary.uploader.destroy(id))
      );
      res.status(200).json({ success: true, results });
    } catch (error) {
      console.error('Error deleting multiple images:', error);
      res.status(500).json({ success: false, error: error.message });
    }
  });
  

module.exports = router;
