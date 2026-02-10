const express = require('express');
const router = express.Router();
const designController = require('../controllers/designController');

router.get('/', designController.getAllDesigns);
router.post('/', designController.createDesign);
// router.get('/:id', designController.getDesignById);

module.exports = router;
