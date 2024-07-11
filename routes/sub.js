const path = require('path')
const express = require('express')
const router = express.Router()

const FILE_PATH = path.join(__dirname, '..', 'views', 'sub', 'index.html')

router.get('^/$|index(.html)?', (req, res) => {
    res.sendFile(FILE_PATH)
})

module.exports = router