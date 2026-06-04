// models/Schema.js

const mongoose = require('mongoose');

const circularSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true
  },

  pdfUrl: {
    type: String,
    required: true
  },

  createdAt: {
    type: Date,
    default: Date.now
  }
});

const videoSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true
  },

  link: {
    type: String,
    required: true
  },

  platform: {
    type: String,
    enum: ['youtube', 'facebook', 'instagram'],
    required: true
  },

  createdAt: {
    type: Date,
    default: Date.now
  }
});

const gallerySchema = new mongoose.Schema({
  title: {
    type: String,
    required: true
  },

  imageUrl: {
    type: String,
    required: true
  },

  createdAt: {
    type: Date,
    default: Date.now
  }
});

const newsSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true
  },

  description: {
    type: String,
    required: true
  },

  createdAt: {
    type: Date,
    default: Date.now
  }
});

const Circular = mongoose.model('Circular', circularSchema);
const Video = mongoose.model('Video', videoSchema);
const Gallery = mongoose.model('Gallery', gallerySchema);
const News = mongoose.model('News', newsSchema);

module.exports = {
  Circular,
  Video,
  Gallery,
  News
};