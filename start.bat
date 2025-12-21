@echo off
REM MERN Stack E-Learning Platform - Project Management Script for Windows

echo.
echo 🎓 EduMarket - MERN Stack E-Learning Platform
echo =============================================
echo.
echo Choose an option:
echo 1. Install all dependencies (server + client)
echo 2. Start development servers (both server and client)
echo 3. Start server only
echo 4. Start client only
echo 5. Build for production
echo 6. Create .env files from examples
echo 7. Help and Documentation
echo.

set /p choice="Enter your choice (1-7): "

if "%choice%"=="1" goto install_all
if "%choice%"=="2" goto start_both
if "%choice%"=="3" goto start_server
if "%choice%"=="4" goto start_client
if "%choice%"=="5" goto build
if "%choice%"=="6" goto create_env
if "%choice%"=="7" goto help
goto invalid

:install_all
echo Installing dependencies...
echo Installing server dependencies...
cd server
call npm install
cd ..
echo.
echo Installing client dependencies...
cd clinte
call npm install
cd ..
echo.
echo ✅ Dependencies installed successfully!
pause
goto end

:start_both
echo Starting development servers...
echo Make sure MongoDB is running!
echo.
echo Starting server on port 5000...
cd server
start cmd /k npm run dev
cd ..
echo.
timeout /t 2
echo Starting client on port 3000...
cd clinte
start cmd /k npm run dev
cd ..
echo.
echo ✅ Both servers are starting!
echo    Server: http://localhost:5000
echo    Client: http://localhost:3000
pause
goto end

:start_server
echo Starting server on port 5000...
cd server
call npm run dev
cd ..
goto end

:start_client
echo Starting client on port 3000...
cd clinte
call npm run dev
cd ..
goto end

:build
echo Building for production...
echo Building client...
cd clinte
call npm run build
cd ..
echo.
echo ✅ Production build complete!
echo Client build is in clinte\dist\
pause
goto end

:create_env
echo Creating .env files...
echo.
if not exist "server\.env" (
    echo Creating server\.env...
    copy server\.env.example server\.env
    echo ✅ Created server\.env (update with your credentials)
) else (
    echo ⚠️  server\.env already exists
)
echo.
if not exist "clinte\.env.local" (
    echo Creating clinte\.env.local...
    copy clinte\.env.example clinte\.env.local
    echo ✅ Created clinte\.env.local (update with your keys)
) else (
    echo ⚠️  clinte\.env.local already exists
)
echo.
pause
goto end

:help
echo.
echo 📚 DOCUMENTATION
echo ================
echo.
echo 📄 Quick Setup Guide:
echo    SETUP.md - Step-by-step setup instructions
echo.
echo 📖 Full Documentation:
echo    README.md - Complete documentation
echo.
echo 🔧 Backend:
echo    Location: server/
echo    - models/  : Database schemas
echo    - routes/  : API endpoints
echo    - controllers/ : Business logic
echo.
echo ⚡ Frontend:
echo    Location: clinte/
echo    - src/components/ : React components
echo    - src/pages/      : Page components
echo    - src/services/   : API calls
echo    - src/store/      : State management
echo.
echo 🌐 Access the app:
echo    Frontend: http://localhost:3000
echo    Backend:  http://localhost:5000
echo.
echo 💡 Test Stripe Card: 4242 4242 4242 4242
echo.
echo 🚀 To get started:
echo    1. Run: start.bat (this script)
echo    2. Choose option 1 (Install dependencies)
echo    3. Choose option 6 (Create .env files)
echo    4. Edit .env files with your credentials
echo    5. Choose option 2 (Start both servers)
echo.
pause
goto end

:invalid
echo.
echo ❌ Invalid choice. Please enter a number between 1-7.
echo.
pause
goto end

:end
