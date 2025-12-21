const multer = require('multer');
const path = require('path');
const fs = require('fs');

// Create uploads directory if it doesn't exist
const uploadsDir = path.join(__dirname, '../uploads');
if (!fs.existsSync(uploadsDir)) {
  fs.mkdirSync(uploadsDir, { recursive: true });
}

const videoDir = path.join(uploadsDir, 'videos');
const pdfDir = path.join(uploadsDir, 'pdfs');

if (!fs.existsSync(videoDir)) {
  fs.mkdirSync(videoDir, { recursive: true });
}
if (!fs.existsSync(pdfDir)) {
  fs.mkdirSync(pdfDir, { recursive: true });
}

// Configure storage for videos
const videoStorage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, videoDir);
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1e9);
    cb(null, 'video-' + uniqueSuffix + path.extname(file.originalname));
  },
});

// Configure storage for PDFs
const pdfStorage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, pdfDir);
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1e9);
    cb(null, 'pdf-' + uniqueSuffix + path.extname(file.originalname));
  },
});

// File filter for videos
const videoFilter = (req, file, cb) => {
  const allowedMimes = ['video/mp4', 'video/webm', 'video/ogg', 'video/quicktime'];
  if (allowedMimes.includes(file.mimetype)) {
    cb(null, true);
  } else {
    cb(new Error('Invalid video file type. Only MP4, WebM, Ogg, and MOV are allowed.'), false);
  }
};

// File filter for PDFs
const pdfFilter = (req, file, cb) => {
  if (file.mimetype === 'application/pdf') {
    cb(null, true);
  } else {
    cb(new Error('Only PDF files are allowed for documents.'), false);
  }
};

// Create multer instances
const videoUpload = multer({
  storage: videoStorage,
  fileFilter: videoFilter,
  limits: { fileSize: 5000 * 1024 * 1024 }, // 5GB limit for videos
});

const pdfUpload = multer({
  storage: pdfStorage,
  fileFilter: pdfFilter,
  limits: { fileSize: 500 * 1024 * 1024 }, // 500MB limit for PDFs
});

// Middleware to handle mixed file uploads
const uploadMiddleware = multer({
  storage: multer.diskStorage({
    destination: (req, file, cb) => {
      if (file.fieldname.includes('videoFile')) {
        cb(null, videoDir);
      } else if (file.fieldname.includes('pdfFile')) {
        cb(null, pdfDir);
      } else {
        cb(null, uploadsDir);
      }
    },
    filename: (req, file, cb) => {
      const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1e9);
      const prefix = file.fieldname.includes('videoFile') ? 'video-' : 'pdf-';
      cb(null, prefix + uniqueSuffix + path.extname(file.originalname));
    },
  }),
  fileFilter: (req, file, cb) => {
    if (file.fieldname.includes('videoFile')) {
      videoFilter(req, file, cb);
    } else if (file.fieldname.includes('pdfFile')) {
      pdfFilter(req, file, cb);
    } else {
      cb(null, true);
    }
  },
  limits: { fileSize: 5000 * 1024 * 1024 }, // 5GB limit
});

module.exports = {
  videoUpload,
  pdfUpload,
  uploadMiddleware,
};
