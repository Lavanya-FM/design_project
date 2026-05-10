const express = require('express');
const router = express.Router();
const designController = require('../controllers/designController');

const { validate } = require('../middleware/validate');
const { createDesignSchema } = require('../validators/schemas');

router.get('/', designController.getAllDesigns);
router.get('/search', designController.searchDesigns);
router.get('/trending', designController.getTrendingDesigns);
router.post('/estimate', designController.estimatePrice);
router.get('/:id', designController.getDesignById);
router.get('/:id/similar', designController.getSimilarDesigns);
router.post('/wishlist/:id', designController.trackWishlist);
router.post('/:id/review', designController.addReview);
router.patch('/:id/moderate', designController.moderateDesign);

module.exports = router;
