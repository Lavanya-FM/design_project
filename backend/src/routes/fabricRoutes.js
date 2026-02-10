const express = require('express');
const router = express.Router();
const fabricController = require('../controllers/fabricController');

router.get('/', fabricController.getAllFabrics);
router.post('/', fabricController.createFabric);

module.exports = router;
