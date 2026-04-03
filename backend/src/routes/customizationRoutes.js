const express = require('express');
const router = express.Router();
const customizationController = require('../controllers/customizationController');

router.post('/', customizationController.saveCustomization);
router.get('/:id', customizationController.getCustomizationById);

module.exports = router;
