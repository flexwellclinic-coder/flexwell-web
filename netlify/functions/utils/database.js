const mongoose = require('mongoose');

// Global variables to maintain connection across function invocations
let isConnected = false;
let connection = null;

const connectDB = async () => {
  // If already connected, reuse the connection
  if (isConnected && connection) {
    console.log('Reusing existing database connection');
    return connection;
  }

  try {
    // Set mongoose options for serverless
    mongoose.set('strictQuery', false);
    
    // Connect to MongoDB with optimized settings for serverless
    const conn = await mongoose.connect(process.env.MONGODB_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
      serverSelectionTimeoutMS: 10000, // 10 seconds
      socketTimeoutMS: 45000, // 45 seconds
      maxPoolSize: 10, // Maintain up to 10 socket connections
      bufferCommands: false, // Disable mongoose buffering
      bufferMaxEntries: 0, // Disable mongoose buffering
    });

    isConnected = true;
    connection = conn;
    console.log(`MongoDB Connected: ${conn.connection.host}`);
    return conn;
  } catch (error) {
    console.error('MongoDB connection error:', error);
    isConnected = false;
    connection = null;
    throw error;
  }
};

// Handle connection events
mongoose.connection.on('connected', () => {
  console.log('Mongoose connected to MongoDB');
  isConnected = true;
});

mongoose.connection.on('error', (err) => {
  console.error('Mongoose connection error:', err);
  isConnected = false;
  connection = null;
});

mongoose.connection.on('disconnected', () => {
  console.log('Mongoose disconnected');
  isConnected = false;
  connection = null;
});

module.exports = { connectDB, mongoose }; 