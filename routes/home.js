const path = require('path')
const express = require('express')
const router = express.Router()

const INDEX_PATH = path.join(__dirname, '..', 'views', 'index.html')
const REDIRECT_PATH = path.join(__dirname, '..', 'views', 'new.html')

router.get('^/$|index(.html)?', (req, res) => {
    res.sendFile(INDEX_PATH)
})

router.get('/new(.html)?', (req, res) => {
    res.sendFile(REDIRECT_PATH)
})

router.get('/old(.html)?', (req, res) => {
    res.redirect(301, '/new.html')
})

module.exports = router