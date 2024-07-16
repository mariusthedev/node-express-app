const data = {
    customers: require('../../models/customers.json'),
    initializeCustomerData: function(data) {
        this.customers = data
    }
}

const getCustomers = (req, res) => {
    res.json(data.customers)
}

const getCustomerById = (req, res) => {
    res.json({
        "id": req.params.id
    })
}

const createCustomer = (req, res) => {
    const newCustomer = {
        id: data.customers?.length ? data.customers.at(-1).id + 1 : 1,
        email: req.body.email,
        name: req.body.name
    }

    if (!newCustomer.email || !newCustomer.name) {
        return res.status(400).json({
            'message': 'Email and/or name was not provided!'
        })
    }

    data.initializeCustomerData([...data.customers, newCustomer])
    res.json(data.customers)
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