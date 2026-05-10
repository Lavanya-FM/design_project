const express = require('express');
const router = express.Router();
const fabricController = require('../controllers/fabricController');

router.get('/', fabricController.getAllFabrics);
router.get('/requests', fabricController.getMaterialRequests);
router.post('/requests/:orderId/dispatch', fabricController.dispatchMaterial);
router.post('/', fabricController.createFabric);

module.exports = router;
