const mongoose = require('mongoose');
const schema = mongoose.Schema;

const userSchema = new schema({
    username: {
        type: String,
        required: true
    },
    roles: {
        user: {
            type: Number,
            default: 300
        },
        editor: {
            type: Number
        },
        admin: {
            type: Number
        }
    },
    password: {
        type: String,
        required: true
    },
    refreshToken: {
        type: String
    }
});

module.exports = mongoose.model('user', userSchema);