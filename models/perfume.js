const mongoose = require('mongoose');
const Schema = mongoose.Schema;
var mongoose_delete = require('mongoose-delete');


const slug = require('mongoose-slug-generator');
mongoose.plugin(slug)



const Perfume = new Schema({
    name: {
        type: String,
        require: true
    },
    type: {
        type: String
    },
    status: {
        type: Boolean,
    },
    price: {
        type: String,
    },

    sale: {
        type: String
    },
    img: {
        type: String
    },
    currentSold: {
        type: Number
    },
    sizeS: {
        type: Number
    },
    sizeL: {
        type: Number
    },
    sizeM: {
        type: Number
    },
    color: {
        type: String
    },
    date: {
        type: String
    },
    updateDate: {
        type: String
    }


}, {

    timestamps: true
});




var mongoose_delete = require('mongoose-delete');
Perfume.plugin(mongoose_delete);
Perfume.plugin(mongoose_delete, { overrideMethods: 'all' });

module.exports = mongoose.model('Perfume', Perfume, 'perfume');