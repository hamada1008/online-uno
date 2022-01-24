require("dotenv").config({ path: "./config/.env" });
const express = require("express");
const http = require("http");
const databaseConnection = require("./config/database");
const errorHandler = require("./middleware/error");
const User = require("./model/user");
const cors = require("cors");
const app = express();
const { instrument } = require("@socket.io/admin-ui");

app.use(express.json());
const PORT = process.env.PORT || 5000;

app.use(cors());
app.use("/api", require("./routes/auth"));
app.use("/api", require("./routes/rating"));
app.use("/api", require("./routes/private"));
app.use(errorHandler);
const server = http.createServer(app);
const io = require("./socket/socket")(server, {
  cors: { origin: ["http://localhost:3000/", "https://admin.socket.io"] },
});
instrument(io, {
  auth: false,
});

server.listen(PORT, () => {
  databaseConnection();
  console.log(`app is running at port ${PORT}`);
});

process.on("unhandledRejection", (err, promise) => {
  console.log(`Logged Error: ${err.message}`);
  server.close(() => process.exit(1));
});

module.exports = server;
