const mongoose = require("mongoose");

const userSchema = mongoose.mongoose.Schema({
    firstName: {
        type: String,
        required: true
    },
    lastName: {
        type: String,
        required: true
    },
    DDN: Date,
    email: {
        type: String,
        unique: true,
        required: true
    },
    password: {
        type: String,
        required: true
    },
    token: {
        type: String,
        unique: true,
        required: true
    },
    inscriptionDate: {
        type: Date,
        default: new Date(),
        required: true
    },
    lastConnection: {
        type: Date,
        default: new Date(),
        required: true
    }
});

const User = mongoose.model('users', userSchema);

module.exports = User;