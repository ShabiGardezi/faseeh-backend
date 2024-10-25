const mongoose = require("mongoose");

// Replace with your MongoDB connection string
const uri = "mongodb://localhost:27017/yourDatabaseName";

// Connect to MongoDB
mongoose.connect(uri, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

const db = mongoose.connection;

// Connection event listeners
db.on("connected", () => {
  console.log("MongoDB connection established successfully");
});

db.on("error", (error) => {
  console.error("Error in MongoDB connection: ", error);
});

db.on("disconnected", () => {
  console.log("MongoDB connection disconnected");
});

// Export the connection
module.exports = db;
