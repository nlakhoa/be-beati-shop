const mongoose = require('mongoose');
const Schema = mongoose.Schema;
var mongoose_delete = require('mongoose-delete');


const slug = require('mongoose-slug-generator');
mongoose.plugin(slug)

const User = new mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    account: {
        type: String,
        required: true
    },
    password: {
        type: String,
        required: true
    },
    numberPhone: {
        type: String,
        required: true
    },
    address: {
        type: String,
        required: true
    },
    birthday: {
        type: String,
        required: true
    },
    sex: {
        type: String,
        enum: ['Male', 'Female'],
        required: true
    },
    role: {
        type: String,
        enum: ['Admin', 'Client'],
        required: true
    }
}, {

    timestamps: true
});







var mongoose_delete = require('mongoose-delete');
User.plugin(mongoose_delete);
User.plugin(mongoose_delete, { overrideMethods: 'all' });

module.exports = mongoose.model('User', User, 'user');