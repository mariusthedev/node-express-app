const express = require('express')
const router = express.Router()
const customerController = require('../../controllers/customer-controller')

router
    .route('/')
    .get(customerController.getCustomers)
    .post(customerController.createCustomer)
    .put(customerController.updateCustomer)
    .delete(customerController.deleteCustomer)

router
    .route('/:id')
    .get(customerController.getCustomerById)

module.exports = router