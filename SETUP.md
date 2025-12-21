# MERN E-Learning Platform - Quick Start Guide

## Overview

This is a complete MERN stack application for an e-learning marketplace where students can buy and enroll in courses.

## What's Been Created

### Backend (Server)
✅ Express.js server with proper middleware setup
✅ MongoDB models for User, Course, and Order
✅ Authentication system (Signup, Login, JWT)
✅ Course management APIs (CRUD operations)
✅ Shopping cart and checkout system
✅ Stripe payment integration
✅ Protected routes with JWT middleware

### Frontend (Client)
✅ React app with React Router
✅ Tailwind CSS for styling
✅ Zustand for state management
✅ Axios for API calls
✅ Stripe payment integration
✅ Pages: Home, Login, Signup, Cart, Checkout, My Courses
✅ Components: Navbar, CourseCard, PrivateRoute
✅ Responsive design

## Quick Start

### 1. Backend Setup

```bash
# Navigate to server folder
cd server

# Install dependencies
npm install

# Create .env file from example
copy .env.example .env

# Edit .env and add your credentials:
# - MongoDB connection string
# - JWT secret
# - Stripe keys
# - API port (default 5000)

# Start MongoDB (if running locally)
# mongod

# Start the server
npm run dev
```

Server will run on: `http://localhost:5000`

### 2. Frontend Setup

```bash
# Navigate to client folder
cd clinte

# Install dependencies
npm install

# Create .env.local file from example
copy .env.example .env.local

# Edit .env.local and add:
# - API URL (http://localhost:5000/api)
# - Stripe publishable key

# Start the dev server
npm run dev
```

App will run on: `http://localhost:3000`

## Key Features

### Student Features
- 🏠 Browse courses with search and filters
- 🛒 Add courses to shopping cart
- 💳 Checkout with Stripe (test: 4242 4242 4242 4242)
- 👤 User authentication
- 📚 View enrolled courses
- 📝 Rate and review courses

### Instructor Features
- ✏️ Create and publish courses
- 🎯 Set course price and details
- 📊 View enrolled students

## API Base URL

- Development: `http://localhost:5000/api`
- All requests include JWT token from localStorage

## Testing the App

1. **Create an Account**
   - Go to /signup
   - Fill in details (can choose student or instructor role)
   - You'll be logged in automatically

2. **Browse Courses**
   - Home page shows available courses
   - Use search and filters to find courses

3. **Add to Cart & Checkout**
   - Click "Add" button on any course
   - Go to /cart
   - Click "Proceed to Checkout"
   - Use test card: 4242 4242 4242 4242

4. **View Enrolled Courses**
   - After payment, go to "My Courses"
   - See all your enrolled courses

## Important Configuration

### Environment Variables Needed

**Server (.env)**
```
PORT=5000
MONGODB_URI=mongodb://localhost:27017/elearning
JWT_SECRET=your_secret_key_here
STRIPE_SECRET_KEY=sk_test_xxxx
STRIPE_PUBLISHABLE_KEY=pk_test_xxxx
NODE_ENV=development
FRONTEND_URL=http://localhost:3000
```

**Client (.env.local)**
```
VITE_API_URL=http://localhost:5000/api
VITE_STRIPE_PUBLISHABLE_KEY=pk_test_xxxx
```

## Get Stripe Keys

1. Go to https://dashboard.stripe.com
2. Sign up or login
3. Go to Developers > API keys
4. Copy both publishable and secret keys
5. Add them to your .env files

## Get MongoDB

### Option 1: Local MongoDB
- Download and install from https://www.mongodb.com/try/download/community
- Run `mongod` in terminal

### Option 2: MongoDB Atlas (Cloud)
- Go to https://www.mongodb.com/cloud/atlas
- Create free cluster
- Get connection string
- Use in .env as MONGODB_URI

## File Structure

```
testmogo/
├── server/
│   ├── models/           # Database schemas
│   ├── controllers/      # Request handlers
│   ├── routes/           # API endpoints
│   ├── middleware/       # Auth middleware
│   ├── index.js          # Server entry point
│   └── package.json
│
└── clinte/              # Note: folder is "clinte" not "client"
    ├── src/
    │   ├── components/   # Reusable components
    │   ├── pages/        # Page components
    │   ├── services/     # API calls
    │   ├── store/        # Zustand stores
    │   ├── App.jsx       # Main component
    │   └── main.jsx      # Entry point
    └── package.json
```

## Troubleshooting

### "Cannot find module" errors
```bash
# Reinstall dependencies
cd server && npm install
cd ../clinte && npm install
```

### Port already in use
Change PORT in server/.env to an available port (3001, 5001, etc.)

### MongoDB connection error
- Ensure MongoDB is running
- Check connection string in .env
- For Atlas, whitelist your IP in network access

### CORS errors
The server has CORS enabled. If still getting errors, check:
- Frontend URL matches in FRONTEND_URL env var
- API calls use correct base URL

### Stripe errors
- Check you're using test keys (start with pk_test_ and sk_test_)
- Use test card: 4242 4242 4242 4242

## Next Steps

1. Set up local MongoDB or MongoDB Atlas account
2. Get Stripe API keys
3. Follow Quick Start section above
4. Test the full flow: signup → browse → add to cart → checkout

## Support

Check the main README.md for detailed documentation on:
- API endpoints
- Database models
- Authentication flow
- Payment processing

Happy coding! 🚀
