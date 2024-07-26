const customerModel = require('../models/customer');

const getCustomers = async (req, res) => {
    const customersInDatabase = await customerModel.find();
    if (!customersInDatabase) {
        return res.status(204).json({"message": "No items found in database"});
    }
    res.json(customersInDatabase);
}

const getCustomerById = async (req, res) => {
    const customerItem = await customerModel.findById(req.body.id).exec();
    if (!customerItem) {
        return res.status(400).json({"message": `Customer with ID ${req.body.id} not found`});
    }
    res.json(customerItem);
}

const createCustomer = async (req, res) => {
    if (!req?.body?.email || !req?.body?.name) {
        return res.status(400).json({"message": "Email and/or name not provided"})
    }
    
}

const updateCustomer = (req, res) => {
    const customerItem = data.customers.find(item => item.id === parseInt(req.body.id));
    if (customerItem === undefined) {
        return res.status(400).json({
            "message": `Customer with ID ${req.body.id} not found`
        });
    }
    if (req.body.email) {
        customerItem.email = req.body.email;
    }
    if (req.body.name) {
        customerItem.name = req.body.name;
    }
    const customerItemsNotMatchingRequestID = data.customers.filter(item => item.id !== parseInt(req.body.id));
    const allCustomerItems = [...customerItemsNotMatchingRequestID, customerItem];
    data.initializeCustomerData(allCustomerItems.sort((a, b) => a.id > b.id ? 1 : a.id < b.id ? -1 : 0));
    res.json(data.customers);
}

const deleteCustomer = (req, res) => {
    const customerItem = data.customers.find(item => item.id === parseInt(req.body.id));
    if (customerItem === undefined) {
        return res.status(400).json({"message": `Customer with ID ${req.body.id} not found`});
    }
    const customerItemsNotMatchingRequestID = data.customers.filter(item => item.id !== parseInt(req.body.id));
    data.initializeCustomerData([...customerItemsNotMatchingRequestID]);
    res.json(data.customers);
}

module.exports = {
    getCustomers,
    getCustomerById,
    createCustomer,
    updateCustomer,
    deleteCustomer
}