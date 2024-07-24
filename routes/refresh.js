const express = require('express');
const router = express.Router();
const controller = require('../controllers/refresh-controller');

router.get('/', controller.refreshToken);

module.exports = router;