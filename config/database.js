const mongoose = require("mongoose");
const databaseConnection = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    console.log("Connected to database");
  } catch (error) {
    console.log(error.message);
  }
};
module.exports = databaseConnection;
