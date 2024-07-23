const express = require('express');
const router = express.Router();
const controller = require('../../controllers/customer-controller');

router
    .route('/')
    .get(controller.getCustomers)
    .post(controller.createCustomer)
    .put(controller.updateCustomer)
    .delete(controller.deleteCustomer);

router
    .route('/:id')
    .get(controller.getCustomerById);

module.exports = router;