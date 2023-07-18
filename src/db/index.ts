import { dbURI } from "../utils/config";
const mongoose = require("mongoose");
const { MongoClient, ServerApiVersion } = require("mongodb");

const connectDB = async () => {
  try {
    const uri = dbURI;
    console.log(uri);
    await mongoose.connect(uri, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });

    
    
    console.log("MongoDB connected!");
  } catch (error) {
    console.error("Error connecting to MongoDB:", error);
    process.exit(1);
  }
};

module.exports = connectDB;
