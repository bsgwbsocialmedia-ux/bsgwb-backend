const {
  Circular,
  Video,
  Gallery,
  News
} = require('../models/Schema');

const multer = require('multer');
const path = require('path');
const fs = require('fs');

// Ensure uploads directory exists
const uploadDir = path.join(__dirname, '..', 'uploads');
if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir, { recursive: true });
}

// Configure multer for file uploads
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, uploadDir);
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    cb(null, uniqueSuffix + path.extname(file.originalname));
  }
});

// ========================================== //
// FILE FILTERS - Separate for different types
// ========================================== //

// 1. Image Filter (for Gallery & News)
const imageFilter = (req, file, cb) => {
  if (file.mimetype.startsWith('image/')) {
    cb(null, true);
  } else {
    cb(new Error('Only images are allowed'), false);
  }
};

// 2. PDF Filter (for Circulars)
const pdfFilter = (req, file, cb) => {
  if (file.mimetype === 'application/pdf') {
    cb(null, true);
  } else {
    cb(new Error('Only PDF files are allowed'), false);
  }
};

// 3. Global Upload (Default - Image)
const upload = multer({
  storage,
  limits: {
    fileSize: 10 * 1024 * 1024 // 10MB limit
  },
  fileFilter: imageFilter
});

// 4. PDF Upload (For Circulars only)
const uploadPDF = multer({
  storage,
  limits: {
    fileSize: 10 * 1024 * 1024 // 10MB limit
  },
  fileFilter: pdfFilter
});

exports.upload = upload;
exports.uploadPDF = uploadPDF;

// ======================
// Circular (PDF Only)
// ======================

exports.uploadCircular = async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({
        success: false,
        message: 'PDF file is required'
      });
    }

    // Extra validation
    if (req.file.mimetype !== 'application/pdf') {
      return res.status(400).json({
        success: false,
        message: 'Only PDF files are allowed. Please upload a PDF file.'
      });
    }

    const circular = await Circular.create({
      title: req.body.title,
      pdfUrl: `/uploads/${req.file.filename}`
    });

    res.status(201).json({
      success: true,
      message: 'Circular uploaded successfully',
      data: circular
    });

  } catch (error) {
    console.error('Error in uploadCircular:', error);
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

exports.getCirculars = async (req, res) => {
  try {
    const circulars = await Circular.find().sort({ createdAt: -1 });
    res.json({
      success: true,
      data: circulars
    });
  } catch (error) {
    console.error('Error in getCirculars:', error);
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

exports.deleteCircular = async (req, res) => {
  try {
    const circular = await Circular.findById(req.params.id);

    if (!circular) {
      return res.status(404).json({
        success: false,
        message: 'Circular not found'
      });
    }

    const filePath = path.join(__dirname, '..', circular.pdfUrl);
    if (fs.existsSync(filePath)) {
      fs.unlinkSync(filePath);
    }

    await Circular.findByIdAndDelete(req.params.id);

    res.json({
      success: true,
      message: 'Circular deleted successfully'
    });

  } catch (error) {
    console.error('Error in deleteCircular:', error);
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

// ======================
// Videos
// ======================

exports.uploadVideo = async (req, res) => {
  try {
    const { title, link, platform } = req.body;

    if (!title || !link) {
      return res.status(400).json({
        success: false,
        message: 'Title and link are required'
      });
    }

    const video = await Video.create({
      title,
      link,
      platform: platform || 'youtube'
    });

    res.status(201).json({
      success: true,
      message: 'Video uploaded successfully',
      data: video
    });

  } catch (error) {
    console.error('Error in uploadVideo:', error);
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

exports.getVideos = async (req, res) => {
  try {
    const videos = await Video.find().sort({ createdAt: -1 });
    res.json({
      success: true,
      data: videos
    });
  } catch (error) {
    console.error('Error in getVideos:', error);
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

exports.deleteVideo = async (req, res) => {
  try {
    const video = await Video.findById(req.params.id);
    
    if (!video) {
      return res.status(404).json({
        success: false,
        message: 'Video not found'
      });
    }

    await Video.findByIdAndDelete(req.params.id);

    res.json({
      success: true,
      message: 'Video deleted successfully'
    });

  } catch (error) {
    console.error('Error in deleteVideo:', error);
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

// ======================
// Gallery (Images Only - No PDF)
// ======================

exports.uploadGallery = async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({
        success: false,
        message: 'Image file is required'
      });
    }

    // Extra validation - ensure it's an image
    if (!req.file.mimetype.startsWith('image/')) {
      return res.status(400).json({
        success: false,
        message: 'Only image files are allowed. Please upload an image file.'
      });
    }

    const { title } = req.body;

    const gallery = await Gallery.create({
      title: title || 'Gallery Image',
      imageUrl: `/uploads/${req.file.filename}`
    });

    res.status(201).json({
      success: true,
      message: 'Gallery image uploaded successfully',
      data: gallery
    });

  } catch (error) {
    console.error('Error in uploadGallery:', error);
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

exports.getGallery = async (req, res) => {
  try {
    const gallery = await Gallery.find().sort({ createdAt: -1 });
    res.json({
      success: true,
      data: gallery
    });
  } catch (error) {
    console.error('Error in getGallery:', error);
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

exports.deleteGallery = async (req, res) => {
  try {
    const gallery = await Gallery.findById(req.params.id);

    if (!gallery) {
      return res.status(404).json({
        success: false,
        message: 'Gallery image not found'
      });
    }

    const filePath = path.join(__dirname, '..', gallery.imageUrl);
    if (fs.existsSync(filePath)) {
      fs.unlinkSync(filePath);
    }

    await Gallery.findByIdAndDelete(req.params.id);

    res.json({
      success: true,
      message: 'Gallery image deleted successfully'
    });

  } catch (error) {
    console.error('Error in deleteGallery:', error);
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

// ======================
// News (FULLY UPDATED)
// ======================

exports.uploadNews = async (req, res) => {
  try {
    console.log('===== UPLOAD NEWS =====');
    console.log('Request Body:', req.body);
    console.log('Request File:', req.file);

    const { title, location, date, description, tags } = req.body;

    // Validation - Required fields
    if (!title) {
      return res.status(400).json({
        success: false,
        message: 'Title is required'
      });
    }

    if (!description) {
      return res.status(400).json({
        success: false,
        message: 'Description is required'
      });
    }

    if (!date) {
      return res.status(400).json({
        success: false,
        message: 'Date is required'
      });
    }

    // Validate word counts
    const titleWords = title.trim().split(/\s+/).filter(w => w.length > 0).length;
    if (titleWords > 100) {
      return res.status(400).json({
        success: false,
        message: `Title must be 100 words or less. Current: ${titleWords} words`
      });
    }

    const descWords = description.trim().split(/\s+/).filter(w => w.length > 0).length;
    if (descWords > 500) {
      return res.status(400).json({
        success: false,
        message: `Description must be 500 words or less. Current: ${descWords} words`
      });
    }

    if (tags) {
      const tagWords = tags.trim().split(/\s+/).filter(w => w.length > 0).length;
      if (tagWords > 80) {
        return res.status(400).json({
          success: false,
          message: `Tags must be 80 words or less. Current: ${tagWords} words`
        });
      }
    }

    // Prepare news data
    const newsData = {
      title: title.trim(),
      location: location ? location.trim() : '',
      date: new Date(date),
      description: description.trim(),
      tags: tags ? tags.trim() : ''
    };

    // Add image if uploaded
    if (req.file) {
      // Extra validation - ensure it's an image
      if (!req.file.mimetype.startsWith('image/')) {
        return res.status(400).json({
          success: false,
          message: 'Only image files are allowed for news'
        });
      }
      newsData.imageUrl = `/uploads/${req.file.filename}`;
      console.log('Image saved at:', newsData.imageUrl);
    }

    // Create news in database
    const news = await News.create(newsData);
    console.log('News created successfully:', news._id);

    res.status(201).json({
      success: true,
      message: 'News uploaded successfully',
      data: news
    });

  } catch (error) {
    console.error('Error in uploadNews:', error);
    res.status(500).json({
      success: false,
      message: 'Error uploading news',
      error: error.message
    });
  }
};

exports.getNews = async (req, res) => {
  try {
    const news = await News.find()
      .sort({ date: -1, createdAt: -1 });
    
    console.log(`Fetched ${news.length} news items`);

    res.status(200).json({
      success: true,
      data: news
    });
  } catch (error) {
    console.error('Error in getNews:', error);
    res.status(500).json({
      success: false,
      message: 'Error fetching news',
      error: error.message
    });
  }
};

exports.deleteNews = async (req, res) => {
  try {
    console.log('Deleting news with ID:', req.params.id);

    const news = await News.findById(req.params.id);
    
    if (!news) {
      return res.status(404).json({
        success: false,
        message: 'News not found'
      });
    }

    // Delete image file if exists
    if (news.imageUrl) {
      const filePath = path.join(__dirname, '..', news.imageUrl);
      console.log('Looking for image at:', filePath);
      
      if (fs.existsSync(filePath)) {
        fs.unlinkSync(filePath);
        console.log('Image deleted successfully');
      } else {
        console.log('Image file not found at path:', filePath);
      }
    }

    await News.findByIdAndDelete(req.params.id);

    res.status(200).json({
      success: true,
      message: 'News deleted successfully'
    });

  } catch (error) {
    console.error('Error in deleteNews:', error);
    res.status(500).json({
      success: false,
      message: 'Error deleting news',
      error: error.message
    });
  }
};

// ======================
// Additional helper for serving uploaded files (if needed)
// ======================

exports.getUploadedFile = (req, res) => {
  try {
    const filename = req.params.filename;
    const filePath = path.join(__dirname, '..', 'uploads', filename);
    
    if (fs.existsSync(filePath)) {
      res.sendFile(filePath);
    } else {
      res.status(404).json({
        success: false,
        message: 'File not found'
      });
    }
  } catch (error) {
    console.error('Error in getUploadedFile:', error);
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

#testing