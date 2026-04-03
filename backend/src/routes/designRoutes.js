const express = require('express');
const router = express.Router();
const designController = require('../controllers/designController');

router.get('/', designController.getAllDesigns);
router.get('/search', designController.searchDesigns);
router.get('/trending', designController.getTrendingDesigns);
router.post('/estimate', designController.estimatePrice);
router.get('/:id', designController.getDesignById);
router.get('/:id/similar', designController.getSimilarDesigns);
router.post('/wishlist/:id', designController.trackWishlist);
router.post('/', designController.createDesign);

module.exports = router;
