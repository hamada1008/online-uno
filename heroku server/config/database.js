const mongoose = require("mongoose");
const Mockgoose = require("mockgoose").Mockgoose;
const mockgoose = new Mockgoose(mongoose);
const databaseConnection = async () => {
  if (process.env.NODE_ENV === "test") {
    mockgoose
      .prepareStorage()
      .then(() => {
        mongoose
          .connect(process.env.MONGO_URI, {
            useNewUrlParser: true,
            useUnifiedTopology: true,
          })
          .then(() => console.log("Connected to test database"))
          .catch((err) => console.log(err.message));
      })
      .catch((err) => console.log(error.message));
  } else {
    mongoose
      .connect(process.env.MONGO_URI, {
        useNewUrlParser: true,
        useUnifiedTopology: true,
      })
      .then(() => console.log("Connected to database"))
      .catch((err) => console.log(err.message));
  }
};
exports.mockgoose;
module.exports = databaseConnection;
