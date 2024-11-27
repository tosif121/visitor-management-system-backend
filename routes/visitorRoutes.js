const express = require('express');
const { registerVisitor, getVisitorById } = require('../controllers/visitorController');

const router = express.Router();

router.post('/visitor-register', registerVisitor);
router.get('/visitor/:id', getVisitorById);

module.exports = router;
