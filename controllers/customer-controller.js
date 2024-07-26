const customerModel = require('../models/customer');

const getCustomers = async (req, res) => {
    const customerDatabaseItems = await customerModel.find();
    if (!customerDatabaseItems) {
        return res.status(204).json({"message": "No items found in database"});
    }
    res.json(customerDatabaseItems);
}

const getCustomerById = async (req, res) => {
    if (!req?.params?.id) {
        return res.status(400).json({"message": "ID not provided"})
    }
    try {
        const foundItem = await customerModel.findById(req.params.id);
        if (!foundItem) {
            return res.status(400).json({"message": "Item not found"});
        }
        res.json(foundItem);
    } catch (error) {
        console.error(`[ERROR] ${error}`);
    }
}

const createCustomer = async (req, res) => {
    if (!req?.body?.email || !req?.body?.name) {
        return res.status(400).json({"message": "Email and/or name not provided"})
    }
    try {
        const createResult = await customerModel.create({
            email: req.body.email,
            name: req.body.name
        });
        res.status(201).json(createResult);
    } catch (error) {
        console.error(`[ERROR] ${error}`);
    }
}

const updateCustomer = async (req, res) => {
    if (!req?.body?.id) {
        return res.status(400).json({"message": "ID not provided"})
    }
    const itemToUpdate = await customerModel.findById(req.body.id);
    if (!itemToUpdate) {
        return res.status(204).json({"message": "Item not found"});
    }
    if (req.body?.email) {
        itemToUpdate.email = req.body.email;
    }
    if (req.body?.name) {
        itemToUpdate.name = req.body.name;
    }
    const updateResult = await itemToUpdate.save();
    res.json(updateResult);
}

const deleteCustomer = async (req, res) => {
    if (!req?.body?.id) {
        return res.status(400).json({"message": "ID not provided"})
    }
    const deleteResult = await customerModel.findByIdAndDelete(req.body.id);
    //const deleteResult = await itemToDelete.deleteOne(req.params.id);
    res.json(deleteResult);
}

module.exports = {
    getCustomers,
    getCustomerById,
    createCustomer,
    updateCustomer,
    deleteCustomer
}