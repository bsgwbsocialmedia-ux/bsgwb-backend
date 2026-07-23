const express = require('express');
const router = express.Router();

const {
  upload,
  uploadPDF,
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
  getUploadedFile
} = require('../controllers/controllers');

router.post('/admin/circular', uploadPDF.single('pdf'), uploadCircular);
router.get('/circulars', getCirculars);
router.delete('/admin/circular/:id', deleteCircular);

router.post('/admin/video', uploadVideo);
router.get('/videos', getVideos);
router.delete('/admin/video/:id', deleteVideo);

router.post('/admin/gallery', upload.single('image'), uploadGallery);
router.get('/gallery', getGallery);
router.delete('/admin/gallery/:id', deleteGallery);

router.post('/admin/news', upload.single('image'), uploadNews);
router.get('/news', getNews);
router.delete('/admin/news/:id', deleteNews);

router.get('/uploads/:filename', getUploadedFile);

module.exports = router;