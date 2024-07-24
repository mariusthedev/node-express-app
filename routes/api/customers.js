const express = require('express');
const router = express.Router();
const controller = require('../../controllers/customer-controller');
const verifyRoles = require('../../middleware/verify-roles');
const ALLOWED_ROLES = require('../../config/roles');

router
    .route('/')
    .get(controller.getCustomers)
    .post(
        verifyRoles(ALLOWED_ROLES.admin, ALLOWED_ROLES.editor), 
        controller.createCustomer
    )
    .put(
        verifyRoles(ALLOWED_ROLES.admin, ALLOWED_ROLES.editor),
        controller.updateCustomer
    )
    .delete(
        verifyRoles(ALLOWED_ROLES.admin),
        controller.deleteCustomer
    );

router
    .route('/:id')
    .get(controller.getCustomerById);

module.exports = router;