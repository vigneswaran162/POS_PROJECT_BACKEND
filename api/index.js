const express = require("express");
const bodyParser = require("body-parser");
const cors = require("cors");
const mongoose = require("mongoose");
require("dotenv").config();

const app = express();

// Middleware
app.use(bodyParser.urlencoded({
  limit: "50mb",
  extended: true,
  parameterLimit: 50000
}));

app.use(bodyParser.json({ limit: "50mb" }));
app.use(express.json());

app.use(cors());

// PORT
const PORT = process.env.PORT || 4000;

// MongoDB Connection
const mongoURI = process.env.MONGO_URI;

if (!mongoURI) {
  console.error("MongoDB connection string is missing!");
} else {
  mongoose.connect(mongoURI)
    .then(() => console.log("MongoDB connected successfully"))
    .catch(err => console.error("MongoDB connection error:", err));
}

// Routes (IMPORTANT: correct path)
const userroutes = require("../routes"); // ✅ adjust if needed
app.use("/api", userroutes);

// Test route
app.get("/", (req, res) => {
  res.send("Backend Working ✅");
});

// Start server
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});