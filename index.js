require("dotenv").config({ path: "./config/.env" });
const express = require("express");
const databaseConnection = require("./config/database");
const errorHandler = require("./middleware/error");
const User = require("./model/user");
const cors = require("cors");

const app = express();
app.use(express.json());
app.use(cors());
const PORT = process.env.PORT || 5000;

app.use("/api", require("./routes/auth.js"));
app.use(errorHandler);
const server = app.listen(PORT, () => {
  databaseConnection();
  console.log(`app is running at port ${PORT}`);
});

process.on("unhandledRejection", (err, promise) => {
  console.log(`Logged Error: ${err.message}`);
  server.close(() => process.exit(1));
});
