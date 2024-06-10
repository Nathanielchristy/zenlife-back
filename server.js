const dotenv = require("dotenv").config();
const express = require("express");
const mongoose = require("mongoose");
const bodyParser = require("body-parser");
const cors = require("cors");
const errorHandler = require("./middleware/errorMiddlware");
const userAuthRoutes = require("./routes/userAuthRoutes");
const userDataRoutes = require("./routes/userDataRoute");
const roleRoutes = require("./routes/roleRoutes");
const jobRoutes = require("./routes/jobRoute");
const jobStatusRoutes = require("./routes/jobStatusRoutes");
const notificationRoutes = require("./routes/notificationRoutes");
const cookieParser = require("cookie-parser");
const http = require("http");
const { Server } = require("socket.io");
const config = require("./config");

const app = express();
const server = http.createServer(app);

// Allow requests from a specific origin
// app.use(
//   cors({
//     origin: "http://localhost:5173",
//     credentials: true,
//   })
// );
const socketIO = new Server(server, {
  cors: {
    origin: "http://3.29.133.152:4173",
    credentials: true,
    allowedHeaders: "Access-Control-Allow-Credentials",
    methods: ["GET", "POST", "PUT", "DELETE"],
  },
});
socketIO.use(async (socket, next) => {
  if (config.allowedOrigins.includes(socket.request.headers.origin)) {
    return next();
  }
  return next(new Error("Not allowed by CORS"));
});

socketIO.on("connection", (socket) => {
  console.log(`⚡: ${socket.id} user just connected!`);
  socket.on("disconnect", () => {
    console.log("🔥: A user disconnected");
  });

  socket.on("event", (event) => {
    console.log("received event", event);
    io.emit("event", event); // Broadcast the event to all clients
  });
});

// CORS configuration
app.use(
  cors({
    origin: function (origin, callback) {
      if (!origin) return callback(null, true);
      if (config.allowedOrigins.indexOf(origin) === -1) {
        const msg =
          "The CORS policy for this site does not allow access from the specified Origin.";
        return callback(new Error(msg), false);
      }
      return callback(null, true);
    },
    credentials: true,
  })
);

//Middlewares
app.use(express.json());
app.use(cookieParser());
app.use(express.urlencoded({ extended: false }));
app.use(bodyParser.json());

//Route middleware
app.use("/api/authUser", userAuthRoutes);
app.use("/api/jobs", jobRoutes);
app.use("/api/users", userDataRoutes);
app.use("/api/roles", roleRoutes);
app.use("/api/dashboard", jobRoutes);
app.use("/api/notifications", notificationRoutes);
app.use("/api/jobstatus", jobStatusRoutes);
// //Routes
// app.get("/", (req, res) => {
//   res.send("Home Page");
// });

//Error Middle ware
app.use(errorHandler);

const PORT = process.env.PORT || 5000;

// Connect to Db and start server

mongoose
  .connect(process.env.MONGO_URI)
  .then(() => {
    server.listen(PORT, () => {
      console.log(`Server running on port ${PORT}`);
    });
  })
  .catch((err) => console.log(err));
