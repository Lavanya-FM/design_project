const express = require('express');
const router = express.Router();
const fulfillmentController = require('../controllers/fulfillmentController');
const { verifyToken, isDesigner, isAdmin, isTailor } = require('../middleware/auth');

// Designer view
router.get('/designer/orders', verifyToken, isDesigner, fulfillmentController.getDesignerOrders);

// Admin view
router.get('/admin/stats', verifyToken, isAdmin, fulfillmentController.getAdminStats);

// Order specific actions
router.post('/:id/accept', verifyToken, isDesigner || isTailor, fulfillmentController.acceptOrder);
router.patch('/:id/status', verifyToken, fulfillmentController.updateOrderStatus);
router.post('/:id/messages', verifyToken, fulfillmentController.sendMessage);
router.get('/:id/messages', verifyToken, fulfillmentController.getMessages);
router.post('/:id/rate', verifyToken, fulfillmentController.rateOrder);

module.exports = router;
