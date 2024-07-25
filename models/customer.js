const mongoose = require('mongoose');
const schema = mongoose.Schema;

const customerSchema = new schema({
    email: {
        type: String,
        required: true
    },
    name: {
        type: String
    }
});

module.exports = mongoose.model('customer', customerSchema);