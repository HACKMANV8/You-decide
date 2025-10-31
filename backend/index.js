const dotenv = require("dotenv");
dotenv.config(); // Load environment variables

const config = require("./config.json");
const mongoose = require("mongoose");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const cors = require("cors");
const express = require("express");
const path = require('path');
const app = express();
const port = 8000;
//imports
const connectDB = require("./config/db.js");
const authRoutes = require("./routes/authRoute.js");


//connect to db:
connectDB();

//middleware:
app.use(express.json());
app.use(
  cors({
    origin: process.env.CLIENT_URL || "*",
    methods: ["GET", "POST", "PUT", "DELETE"],
    allowedHeaders: ["Content-Type", "Authorization"],
  })
);

//create user:
app.use("/api/auth", authRoutes);



app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
