@echo off
echo 🚀 Setting up ClaimIT - Lost and Found Campus App
echo ================================================

REM Check if Node.js is installed
node --version >nul 2>&1
if errorlevel 1 (
    echo ❌ Node.js is not installed. Please install Node.js first.
    pause
    exit /b 1
)

REM Check if npm is installed
npm --version >nul 2>&1
if errorlevel 1 (
    echo ❌ npm is not installed. Please install npm first.
    pause
    exit /b 1
)

echo ✅ Node.js and npm are installed

REM Install backend dependencies
echo 📦 Installing backend dependencies...
cd backend
call npm install
cd ..

REM Install mobile dependencies
echo 📱 Installing mobile dependencies...
cd mobile
call npm install
cd ..

echo.
echo 🎉 Setup completed successfully!
echo.
echo Next steps:
echo 1. Set up your Supabase project and run the SQL schema from database/schema.sql
echo 2. Copy env.example to .env and fill in your credentials
echo 3. Update the API URL in mobile/src/services/api.ts
echo 4. Start the backend: cd backend ^&^& npm run dev
echo 5. Start the mobile app: cd mobile ^&^& npm start
echo.
echo For detailed setup instructions, see README.md
pause
