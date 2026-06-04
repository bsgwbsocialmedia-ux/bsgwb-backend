const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const path = require("path");
const config = require("./config");
const routes = require("./route/route");

const app = express();

// Middleware
app.use(cors());
app.use(express.json());
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// Routes
app.use("/api", routes);

// Connect to MongoDB
mongoose.connect(config.DB_URL)
  .then(() => console.log("MongoDB connected"))
  .catch(err => console.log(err));

const PORT = config.PORT;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));