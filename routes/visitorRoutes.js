const express = require('express');
const { registerVisitor } = require('../controllers/visitorController');

const router = express.Router();

router.post('/visitor-register', registerVisitor);

module.exports = router;
