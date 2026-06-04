const {
  Circular,
  Video,
  Gallery,
  News
} = require('../models/Schema');

const multer = require('multer');
const path = require('path');
const fs = require('fs');

const storage = multer.diskStorage({

  destination: (req, file, cb) => {

    cb(null, 'uploads/');

  },

  filename: (req, file, cb) => {

    cb(
      null,
      Date.now() +
      path.extname(
        file.originalname
      )
    );

  }

});

const upload = multer({
  storage
});

exports.upload = upload;

// ======================
// Circular
// ======================

exports.uploadCircular = async (
  req,
  res
) => {

  try {

    const circular =
      await Circular.create({

        title:
          req.body.title,

        pdfUrl:
          `/uploads/${req.file.filename}`

      });

    res.status(201).json(
      circular
    );

  } catch (error) {

    res.status(500).json({
      message:
        error.message
    });

  }

};

exports.getCirculars = async (
  req,
  res
) => {

  try {

    const circulars =
      await Circular.find()
        .sort({
          createdAt: -1
        });

    res.json(circulars);

  } catch (error) {

    res.status(500).json({
      message:
        error.message
    });

  }

};

exports.deleteCircular = async (
  req,
  res
) => {

  try {

    const circular =
      await Circular.findById(
        req.params.id
      );

    if (!circular) {

      return res
        .status(404)
        .json({
          message:
            'Circular not found'
        });

    }

    const filePath =
      path.join(
        __dirname,
        '..',
        circular.pdfUrl
      );

    if (
      fs.existsSync(filePath)
    ) {

      fs.unlinkSync(
        filePath
      );

    }

    await Circular.findByIdAndDelete(
      req.params.id
    );

    res.json({
      message:
        'Circular deleted successfully'
    });

  } catch (error) {

    res.status(500).json({
      message:
        error.message
    });

  }

};

// ======================
// Videos
// ======================

exports.uploadVideo = async (
  req,
  res
) => {

  try {

    const video =
      await Video.create({

        title:
          req.body.title,

        link:
          req.body.link,

        platform:
          req.body.platform

      });

    res.status(201).json(
      video
    );

  } catch (error) {

    res.status(500).json({
      message:
        error.message
    });

  }

};

exports.getVideos = async (
  req,
  res
) => {

  try {

    const videos =
      await Video.find()
        .sort({
          createdAt: -1
        });

    res.json(videos);

  } catch (error) {

    res.status(500).json({
      message:
        error.message
    });

  }

};

exports.deleteVideo = async (
  req,
  res
) => {

  try {

    await Video.findByIdAndDelete(
      req.params.id
    );

    res.json({
      message:
        'Video deleted successfully'
    });

  } catch (error) {

    res.status(500).json({
      message:
        error.message
    });

  }

};

// ======================
// Gallery
// ======================

exports.uploadGallery = async (
  req,
  res
) => {

  try {

    const gallery =
      await Gallery.create({

        title:
          req.body.title,

        imageUrl:
          `/uploads/${req.file.filename}`

      });

    res.status(201).json(
      gallery
    );

  } catch (error) {

    res.status(500).json({
      message:
        error.message
    });

  }

};

exports.getGallery = async (
  req,
  res
) => {

  try {

    const gallery =
      await Gallery.find()
        .sort({
          createdAt: -1
        });

    res.json(gallery);

  } catch (error) {

    res.status(500).json({
      message:
        error.message
    });

  }

};

exports.deleteGallery = async (
  req,
  res
) => {

  try {

    const gallery =
      await Gallery.findById(
        req.params.id
      );

    if (!gallery) {

      return res
        .status(404)
        .json({
          message:
            'Gallery image not found'
        });

    }

    const filePath =
      path.join(
        __dirname,
        '..',
        gallery.imageUrl
      );

    if (
      fs.existsSync(filePath)
    ) {

      fs.unlinkSync(
        filePath
      );

    }

    await Gallery.findByIdAndDelete(
      req.params.id
    );

    res.json({
      message:
        'Gallery image deleted successfully'
    });

  } catch (error) {

    res.status(500).json({
      message:
        error.message
    });

  }

};

// ======================
// News
// ======================

exports.uploadNews = async (
  req,
  res
) => {

  try {

    const news =
      await News.create({

        title:
          req.body.title,

        description:
          req.body.description

      });

    res.status(201).json(
      news
    );

  } catch (error) {

    res.status(500).json({
      message:
        error.message
    });

  }

};

exports.getNews = async (
  req,
  res
) => {

  try {

    const news =
      await News.find()
        .sort({
          createdAt: -1
        });

    res.json(news);

  } catch (error) {

    res.status(500).json({
      message:
        error.message
    });

  }

};

exports.deleteNews = async (
  req,
  res
) => {

  try {

    await News.findByIdAndDelete(
      req.params.id
    );

    res.json({
      message:
        'News deleted successfully'
    });

  } catch (error) {

    res.status(500).json({
      message:
        error.message
    });

  }

};