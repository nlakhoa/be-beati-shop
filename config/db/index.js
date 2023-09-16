const mongoose = require("mongoose");

async function connect() {
  try {
    await mongoose.connect(
      process?.env?.MONGODB_CONNECT_URI
        ? process?.env?.MONGODB_CONNECT_URI
        : "mongodb://localhost:27017/men-store",
      {
        useNewUrlParser: true,
        useUnifiedTopology: true,
        useCreateIndex: true,
      }
    );
    console.log("Thành công!!!");
  } catch (error) {
    console.log("Thử lại!!!",error);
  }
}

module.exports = {
  connect,
};
