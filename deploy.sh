#!/bin/bash

# Flex    Well Deployment Script
echo "🚀 Deploying Flex    Well to Production..."

# Check if required environment variables are set
if [ -z "$REACT_APP_API_URL" ]; then
    echo "⚠️  Warning: REACT_APP_API_URL not set"
    echo "   Please set it to your Railway backend URL"
    echo "   Example: export REACT_APP_API_URL=https://your-app.railway.app/api"
fi

# Install dependencies
echo "📦 Installing dependencies..."
npm install

# Install server dependencies
echo "🗄️  Installing server dependencies..."
cd server && npm install && cd ..

# Build the React app
echo "🔨 Building React application..."
npm run build

# Check if build was successful
if [ $? -eq 0 ]; then
    echo "✅ Build successful!"
    echo ""
    echo "📋 Next Steps:"
    echo "   1. Deploy backend to Railway (see DEPLOYMENT_GUIDE.md)"
    echo "   2. Deploy frontend to Netlify:"
    echo "      - Build command: npm run build"
    echo "      - Publish directory: build"
    echo "      - Environment variable: REACT_APP_API_URL"
    echo ""
    echo "🎉 Your Flex    Well app is ready for production!"
else
    echo "❌ Build failed. Please check the errors above."
    exit 1
fi 