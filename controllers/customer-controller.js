const data = {}
data.customers = require('../../models/customers.json')

const getCustomers = (req, res) => {
    res.json(data.customers)
}

const getCustomerById = (req, res) => {
    res.json({
        "id": req.params.id
    })
}

const createCustomer = (req, res) => {
    res.json({
        "email": req.body.email,
        "name": req.body.name
    })
}

const updateCustomer = (req, res) => {
    res.json({
        "email": req.body.email,
        "name": req.body.name
    })
}

const deleteCustomer = (req, res) => {
    res.json({
        "id": req.body.id
    })
}

module.exports = {
    getCustomers,
    getCustomerById,
    createCustomer,
    updateCustomer,
    deleteCustomer
}