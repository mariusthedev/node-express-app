const data = {
    customers: require('../models/customers.json'),
    initializeCustomerData: function(data) {
        this.customers = data;
    }
}

const getCustomers = (req, res) => {
    res.json(data.customers);
}

const getCustomerById = (req, res) => {
    const customerItem = data.customers.find(item => item.id === parseInt(req.params.id));
    if (customerItem === undefined) {
        return res.status(400).json({
            "message": `Customer with ID ${req.body.id} not found`
        });
    }

    res.json(customerItem);
}

const createCustomer = (req, res) => {
    
    const newCustomer = {
        id: data.customers?.length ? data.customers.at(-1).id + 1 : 1,
        email: req.body.email,
        name: req.body.name
    }

    if (!newCustomer.email || !newCustomer.name) { 
        return res.status(400).json({
            "message": 'Email and/or name not provided'
        });
    }

    data.initializeCustomerData([...data.customers, newCustomer]);
    res.status(201).json(data.customers);
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

    // Sort array of customer items and initialize stored data
    const customerItemsNotMatchingRequestID = data.customers.filter(item => item.id !== parseInt(req.body.id));
    const allCustomerItems = [...customerItemsNotMatchingRequestID, customerItem];
    data.initializeCustomerData(allCustomerItems.sort((a, b) => a.id > b.id ? 1 : a.id < b.id ? -1 : 0));
    
    res.json(data.customers);
}

const deleteCustomer = (req, res) => {
    
    const customerItem = data.customers.find(item => item.id === parseInt(req.body.id));
    if (customerItem === undefined) {
        return res.status(400).json({
            "message": `Customer with ID ${req.body.id} not found`
        });
    }

    // Sort array of customer items and initialize stored data
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