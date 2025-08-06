const mongoose = require("mongoose");

const connectDB = async () => {
  await mongoose.connect(
    "mongodb+srv://namastedev:zOZ8bTPvdsyfqocN@namastenode.qhup9vn.mongodb.net/devTinder?retryWrites=true&w=majority"
  );
};

module.exports = connectDB;
