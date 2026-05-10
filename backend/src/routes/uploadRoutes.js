const express = require('express');
const router = express.Router();
const uploadController = require('../controllers/uploadController');
const { upload } = require('../middleware/upload');
const { validate } = require('../middleware/validate');
const { uploadSchema } = require('../validators/schemas');

// Single image upload
router.post('/single', upload.single('image'), validate(uploadSchema), uploadController.uploadSingle);

// Multiple image upload (up to 10)
router.post('/multiple', upload.array('images', 10), validate(uploadSchema), uploadController.uploadMultiple);

module.exports = router;
