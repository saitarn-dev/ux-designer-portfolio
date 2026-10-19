const mongoose = require('mongoose');

const uri = "mongodb+srv://saitarartchompoo_db_user:pi9AsZgTnC3VHft7@oummy.vesxwvh.mongodb.net/portfolio_db?retryWrites=true&w=majority&appName=oummy";

async function testConnection() {
  console.log("Connecting to MongoDB Atlas...");
  try {
    await mongoose.connect(uri, {
      serverSelectionTimeoutMS: 5000,
    });
    console.log("Connected successfully to MongoDB Atlas!");
    const collections = await mongoose.connection.db.listCollections().toArray();
    console.log("Available collections:", collections.map(c => c.name));
    await mongoose.disconnect();
    console.log("Connection closed gracefully.");
  } catch (err) {
    console.error("Connection error:", err.message);
    process.exit(1);
  }
}

testConnection();
