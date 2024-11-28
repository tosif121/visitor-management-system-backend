const express = require('express');
const { authController } = require('../controllers/authController');
const { signinController } = require('../controllers/authController');

const router = express.Router();

router.post('/signin', authController, signinController);

module.exports = router;
