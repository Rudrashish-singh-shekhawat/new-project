#!/bin/bash

# MERN Stack E-Learning Platform - Project Management Script

echo "🎓 EduMarket - MERN Stack E-Learning Platform"
echo "=============================================="
echo ""
echo "Choose an option:"
echo "1. Install all dependencies (server + client)"
echo "2. Start development servers (both server and client)"
echo "3. Start server only"
echo "4. Start client only"
echo "5. Build for production"
echo "6. Help & Documentation"
echo ""
read -p "Enter your choice (1-6): " choice

case $choice in
    1)
        echo "Installing dependencies..."
        echo "Installing server dependencies..."
        cd server && npm install
        cd ..
        echo "Installing client dependencies..."
        cd clinte && npm install
        cd ..
        echo "✅ Dependencies installed!"
        ;;
    2)
        echo "Starting development servers..."
        echo "Make sure MongoDB is running!"
        echo ""
        echo "Starting server on port 5000..."
        cd server && npm run dev &
        SERVER_PID=$!
        sleep 2
        echo ""
        echo "Starting client on port 3000..."
        cd ../clinte && npm run dev &
        CLIENT_PID=$!
        echo ""
        echo "✅ Both servers are running!"
        echo "   Server: http://localhost:5000"
        echo "   Client: http://localhost:3000"
        echo ""
        echo "Press Ctrl+C to stop both servers"
        wait
        ;;
    3)
        echo "Starting server..."
        cd server && npm run dev
        ;;
    4)
        echo "Starting client..."
        cd clinte && npm run dev
        ;;
    5)
        echo "Building for production..."
        echo "Building client..."
        cd clinte && npm run build
        cd ..
        echo "✅ Production build complete!"
        echo "Client build is in clinte/dist/"
        ;;
    6)
        echo "📚 Documentation"
        echo "=================="
        echo ""
        echo "📄 Quick Setup Guide:"
        echo "   cat SETUP.md"
        echo ""
        echo "📖 Full Documentation:"
        echo "   cat README.md"
        echo ""
        echo "🔧 Backend API Docs:"
        echo "   Check server/routes/ for endpoints"
        echo ""
        echo "⚡ Frontend Components:"
        echo "   Check clinte/src/components/ and clinte/src/pages/"
        echo ""
        echo "🌐 Access the app:"
        echo "   Frontend: http://localhost:3000"
        echo "   Backend:  http://localhost:5000"
        echo ""
        ;;
    *)
        echo "❌ Invalid choice. Please enter a number between 1-6."
        ;;
esac
