const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const userSchema = new Schema({
    name: {
        type: String,
        required: true,
        unique: true
    },
    email: {
        type: String,
        unique: true,
        required: true
    },
    passport: {
        type: String,
        required: true
    },
    admin: {
        type: Boolean,
        default: false
    }
},{
    timestamps: true
});

const Users = mongoose.model('User', userSchema);

module.exports = Users;
