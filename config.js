module.exports = {
  port: process.env.PORT || 5000, // Server port
  mongoURI: process.env.MONGO_URI, // MongoDB connection URI
  allowedOrigins: [
    "http://localhost:5173",
    "http://192.168.0.114:5173",
    "http://192.168.56.1:5173", // replace with your local IP address
  ],
  // Add any other configuration options here (e.g., secret keys)
};
