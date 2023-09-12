const mongoose = require('mongoose');
const Schema = mongoose.Schema;
var mongoose_delete = require('mongoose-delete');


const slug = require('mongoose-slug-generator');
mongoose.plugin(slug)



const Bill = new Schema({

    user: {
        type: String
    },
    arrProduct: {
        type: String,
    },
    price: {
        type: String,
    },
    status: {
        type: Number // 0 đã đặt, 1 Đang vận chuyển, 2 đã nhận hàng
    },
    time: {
        type: String
    }

}, {

    timestamps: true
});




var mongoose_delete = require('mongoose-delete');
Bill.plugin(mongoose_delete);
Bill.plugin(mongoose_delete, { overrideMethods: 'all' });

module.exports = mongoose.model('Bill', Bill, 'bill');