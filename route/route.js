const express = require('express');
const router = express.Router();

const {
  upload,
  uploadCircular,
  getCirculars,
  deleteCircular,
  uploadVideo,
  getVideos,
  deleteVideo,
  uploadGallery,
  getGallery,
  deleteGallery,
  uploadNews,
  getNews,
  deleteNews,
  getUploadedFile // Add this if you want a file serving endpoint
} = require('../controllers/controllers');

// ======================
// Circular Routes
// ======================

router.post('/admin/circular', upload.single('pdf'), uploadCircular);
router.get('/circulars', getCirculars);
router.delete('/admin/circular/:id', deleteCircular);

// ======================
// Video Routes
// ======================

router.post('/admin/video', uploadVideo);
router.get('/videos', getVideos);
router.delete('/admin/video/:id', deleteVideo);

// ======================
// Gallery Routes
// ======================

router.post('/admin/gallery', upload.single('image'), uploadGallery);
router.get('/gallery', getGallery);
router.delete('/admin/gallery/:id', deleteGallery);

// ======================
// News Routes
// ======================

router.post('/admin/news', upload.single('image'), uploadNews);
router.get('/news', getNews);
router.delete('/admin/news/:id', deleteNews);
         
// ======================
// Optional: File serving route
// ======================

// router.get('/uploads/:filename', getUploadedFile);

module.exports = router;