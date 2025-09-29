#!/bin/bash

echo "🚀 Setting up ClaimIT - Lost and Found Campus App"
echo "================================================"

# Check if Node.js is installed
if ! command -v node &> /dev/null; then
    echo "❌ Node.js is not installed. Please install Node.js first."
    exit 1
fi

# Check if npm is installed
if ! command -v npm &> /dev/null; then
    echo "❌ npm is not installed. Please install npm first."
    exit 1
fi

echo "✅ Node.js and npm are installed"

# Install backend dependencies
echo "📦 Installing backend dependencies..."
cd backend
npm install
cd ..

# Install mobile dependencies
echo "📱 Installing mobile dependencies..."
cd mobile
npm install
cd ..

echo ""
echo "🎉 Setup completed successfully!"
echo ""
echo "Next steps:"
echo "1. Set up your Supabase project and run the SQL schema from database/schema.sql"
echo "2. Copy env.example to .env and fill in your credentials"
echo "3. Update the API URL in mobile/src/services/api.ts"
echo "4. Start the backend: cd backend && npm run dev"
echo "5. Start the mobile app: cd mobile && npm start"
echo ""
echo "For detailed setup instructions, see README.md"
