const express = require('express');
const router = express.Router();
const cartController = require('../controllers/cartController');
const { verifyToken } = require('../middleware/auth');

router.use(verifyToken); // Protect all cart/wishlist routes

router.get('/', cartController.getCart);
router.post('/add', cartController.addToCart);
router.delete('/:id', cartController.removeFromCart);

router.get('/wishlist', cartController.getWishlist);
router.post('/wishlist/toggle', cartController.toggleWishlist);

module.exports = router;
