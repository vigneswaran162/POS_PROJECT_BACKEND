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

// Routes
const userroutes = require("../routes");
app.use("/api", userroutes);

// Test route
app.get("/", (req, res) => {
  res.send("Backend Working ✅");
});

// ✅ Proper DB + Server start
async function startServer() {
  try {
    const mongoURI = process.env.MONGO_URI;

    if (!mongoURI) {
      console.error("❌ MongoDB connection string is missing!");
      process.exit(1);
    }

    await mongoose.connect(mongoURI, {
      useNewUrlParser: true,
      useUnifiedTopology: true
    });

    console.log("✅ MongoDB connected successfully");

    app.listen(PORT, () => {
      console.log(`🚀 Server running on port ${PORT}`);
    });

  } catch (err) {
    console.error("❌ MongoDB connection error:", err);
    process.exit(1);
  }
}

startServer();