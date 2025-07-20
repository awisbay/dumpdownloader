#!/bin/bash

echo "🚀 Setting up File Server for Project Downloader"
echo "================================================="

# Navigate to server directory
cd server

echo "📦 Installing server dependencies..."
npm install

echo ""
echo "⚙️  Configuration Required:"
echo "Please edit server/index.js and update the FILE_PATHS object with your actual server paths:"
echo ""
echo "const FILE_PATHS = {"
echo "  'rbs-modump-sunset': '/your/actual/path/to/rbs-modump-sunset',"
echo "  'rnc-modump-sunset': '/your/actual/path/to/rnc-modump-sunset',"
echo "  'migration-modump': '/your/actual/path/to/migration-modump',"
echo "  'allip-bsc': '/your/actual/path/to/allip-bsc'"
echo "};"
echo ""
echo "🔧 After updating the paths, you can start the server with:"
echo "  cd server && npm start"
echo ""
echo "🌐 The API will be available at: http://localhost:3001"
echo "📊 Health check: http://localhost:3001/api/health"
echo ""
echo "✅ Setup complete! Remember to:"
echo "1. Update FILE_PATHS in server/index.js"
echo "2. Start the server: cd server && npm start"
echo "3. Your React app should now connect to real files!"
