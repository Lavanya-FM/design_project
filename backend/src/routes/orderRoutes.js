const express = require('express');
const router = express.Router();
const orderController = require('../controllers/orderController');

const { validate } = require('../middleware/validate');
const { createOrderSchema } = require('../validators/schemas');

router.post('/', validate(createOrderSchema), orderController.createOrder);
router.get('/', orderController.getAllOrders);
router.get('/:id', orderController.getOrderById);
router.get('/user/:userId', orderController.getOrdersByUser);

module.exports = router;
