const mongoose = require("mongoose");
const URI = "mongodb+srv://anhkhoa999go:PYCe83DKEoH6jDZr@shop.wr5kfoz.mongodb.net/?retryWrites=true&w=majority"
async function connect() {
  try {
    await mongoose.connect(URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
      useCreateIndex: true,
    });
    console.log('Thành công!!!');
  } catch (error) {
    console.log('Thử lại!!!');
  }
}


module.exports = {
  connect
}
