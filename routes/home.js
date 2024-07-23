const express = require('express');
const router = express.Router();
const path = require('path');

const INDEX_PATH = path.join(__dirname, '..', 'views', 'index.html');

router.get('^/$|index(.html)?', (req, res) => {
    res.sendFile(INDEX_PATH);
});

module.exports = router;