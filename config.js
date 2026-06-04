const dotenv = require("dotenv");
dotenv.config();

const config = {
  DB_URL: process.env.MONGO_URI,
  PORT: process.env.PORT || 7000,
  JWT_SECRET: process.env.JWT_SECRET,
  ADMIN_KEY: process.env.ADMIN_KEY,
};

// # Add comment

module.exports = config;