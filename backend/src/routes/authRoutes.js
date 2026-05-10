const express = require('express');
const router = express.Router();
const authController = require('../controllers/authController');


const { validate } = require('../middleware/validate');
const { loginSchema } = require('../validators/schemas');

router.post('/register', authController.register);
router.post('/login', validate(loginSchema), authController.login);
// router.get('/me', authController.getMe); // Profile route

module.exports = router;
