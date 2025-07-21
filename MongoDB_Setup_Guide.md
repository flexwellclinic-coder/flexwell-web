# MongoDB Atlas Setup Guide for Flex Well

This guide will help you set up MongoDB Atlas (cloud database) for your Flex Well appointment system.

## 🚀 Quick Setup

### Step 1: Create MongoDB Atlas Account
1. Go to [MongoDB Atlas](https://cloud.mongodb.com/)
2. Click "Try Free" or "Sign Up"
3. Create your account (free tier available)

### Step 2: Create a New Cluster
1. Click "Create" to create a new deployment
2. Choose **M0 FREE** tier (perfect for development)
3. Select your preferred cloud provider and region
4. Name your cluster (e.g., "flexwell-cluster")
5. Click "Create Deployment"

### Step 3: Create Database User
1. Go to "Database Access" in the left sidebar
2. Click "Add New Database User"
3. Choose "Password" authentication
4. Username: `flexwell-admin` (or your choice)
5. Password: Aasi2ON4lr4MkpqD
6. Database User Privileges: Select "Atlas Admin"
7. Click "Add User"

### Step 4: Configure Network Access
1. Go to "Network Access" in the left sidebar
2. Click "Add IP Address"
3. For development, click "Allow Access from Anywhere" (0.0.0.0/0)
4. Click "Confirm"

### Step 5: Get Connection String
1. Go to "Database" in the left sidebar
2. Click "Connect" on your cluster
3. Choose "Connect your application"
4. Select "Node.js" as driver
5. Copy the connection string
6. Replace `<password>` with your database user password
7. Replace `<dbname>` with `flexwell`

### Step 6: Update .env File
Replace the MONGODB_URI in your .env file with your connection string.

## �� Your system is now connected to MongoDB Cloud!
