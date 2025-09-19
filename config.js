module.exports = {
  port: process.env.PORT || 5000, // Server port
  mongoURI: process.env.MONGO_URI, // MongoDB connection URI
  allowedOrigins: [
    "http://3.28.60.31:4173",
    "http://localhost:5174",
    "http://localhost:5173",
    "http://3.29.133.152:4173",
    "http://localhost:4173",
    "http://192.168.0.113:5174",
    "http://172.26.16.1:5174",
    "https://zenlife-front.vercel.app",
    "http://192.168.56.1:5174", // replace with your local IP address
  ],
  // Add any other configuration options here (e.g., secret keys)
};
