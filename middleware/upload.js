const multer = require('multer');
const path = require('path');

const storage = multer.memoryStorage();
const fileFilter = (req, file, cb) => {
  const allowed = ['image/jpeg', 'image/png'];
  if (allowed.includes(file.mimetype)) {
    cb(null, true);
  } else {
    cb(new Error('Only JPEG and PNG files are allowed'), false);
  }
};

module.exports = multer({ storage, fileFilter });
