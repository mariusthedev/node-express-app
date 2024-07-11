const express = require('express')
const router = express.Router()

const data = {}
data.customers = require('../../data/customers.json')

router
    .route('/')
    .get((req, res) => {
        res.json(data.customers)
    })
    .post((req, res) => {
        res.json({
            "email": req.body.email,
            "name": req.body.name
        })
    })
    .put((req, res) => {
        res.json({
            "email": req.body.email,
            "name": req.body.name
        })
    })
    .delete((req, res) => {
        res.json({
            "id": req.body.id
        })
    })

router
    .route('/:id')
    .get((req, res) => {
        res.json({
            "id": req.params.id
        })
    })

module.exports = router