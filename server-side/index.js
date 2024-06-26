require("dotenv").config();
require("./db");
require("express-async-error");

const express = require("express");
const morgan = require("morgan");
const app = express();
const port = process.env.PORT;
const cors = require("cors");
const http = require("http"); 
const socketIo = require("socket.io");
const server = http.createServer(app); 
const io = socketIo(server, {
  cors: {
    origin: ["http://localhost:5173","https://connect-silk-pi.vercel.app"],
  },
});



// import routes
const usersRoutes = require("./src/routes/userRoutes");
const postRoutes = require("./src/routes/postRoutes");

// parsing incoming requests
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(morgan("dev"));
app.use(cors());
// Routes
app.use("/users", usersRoutes);

app.use("/posts", postRoutes);



// Global Error Handler
app.use((err, req, res, next) => {
  const statusCode = err.statusCode || 500;
  res.status(statusCode).send({
    status: statusCode,
    message: err?.message || "Internal Server Error!",
    errors: err?.errors || []
  });
});

server.listen(port, () => {
  console.log(`Server is running on port ${port}! ✅`);
});
