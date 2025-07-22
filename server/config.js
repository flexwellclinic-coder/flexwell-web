// Environment Configuration for FlexWell App
// Create a .env file in the root directory with these variables:

/*
# MongoDB Connection
# Replace with your MongoDB Atlas connection string
MONGODB_URI=mongodb+srv://your-username:your-password@your-cluster.mongodb.net/flexwell?retryWrites=true&w=majority

# JWT Secret for authentication
JWT_SECRET=flexwell-super-secret-jwt-key-2024

# Server Configuration
PORT=5000
NODE_ENV=development

# Admin Configuration
ADMIN_USERNAME=admin
ADMIN_PASSWORD=flexwell2024

# CORS Configuration
FRONTEND_URL=http://localhost:3000
*/

module.exports = {
  // MongoDB Configuration
  mongoURI: process.env.MONGODB_URI || 'mongodb://localhost:27017/flexwell',
  
  // JWT Configuration
  jwtSecret: process.env.JWT_SECRET || 'flexwell-default-secret-key',
  jwtExpiration: '24h',
  
  // Server Configuration
  port: process.env.PORT || 5001,
  nodeEnv: process.env.NODE_ENV || 'development',
  
  // Admin Configuration
  adminUsername: process.env.ADMIN_USERNAME || 'admin',
  adminPassword: process.env.ADMIN_PASSWORD || 'flexwell2024',
  
  // CORS Configuration
  frontendURL: process.env.FRONTEND_URL || 'http://localhost:3000',
  
  // Database Options
  mongoOptions: {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  }
}; 