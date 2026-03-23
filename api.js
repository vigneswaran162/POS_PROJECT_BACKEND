const express = require("express");
const bodyParser = require('body-parser')
const app = express()
const cors = require('cors');
const mongoose = require("mongoose");
require("dotenv").config(); 

app.use(bodyParser.urlencoded({
    limit: "50mb",
    extended: true,
    parameterLimit: 50000
}))

app.use(bodyParser.json({ limit: "50mb" })); 

app.use(express.json());



app.use(cors({
    origin: '*',
    methods: 'GET, POST, PUT, DELETE',
    allowedHeaders: 'Content-Type, Authorization',
  }));


  

const PORT = process.env.PORT || 4000



const mongoURI = process.env.MONGO_URL; 

if (!mongoURI) {
  console.error("MongoDB connection string is missing!");
  process.exit(1); 
}

mongoose
  .connect(mongoURI, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => console.log("MongoDB connected successfully"))
  .catch((err) => console.error("MongoDB connection error:", err));


// const userroutes = require('./routes')
// app.use(userroutes);

const userroutes = require("../routes"); // ⚠️ path change if needed
app.use("/", userroutes);

// Test route
app.get("/", (req, res) => {
  res.send("Backend Working ✅");
});


    // app.listen(PORT, () => {
    //     console.log(`Server is running on port ${PORT}`);
    //   });
module.exports = app;