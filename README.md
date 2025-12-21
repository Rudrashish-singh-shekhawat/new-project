# EduMarket - MERN Stack E-Learning Platform

A complete MERN (MongoDB, Express, React, Node.js) stack application for selling educational courses where students can browse, purchase, and enroll in courses.

## Features

### For Students
- 🔍 Browse and search courses
- 🛒 Add courses to cart
- 💳 Secure payment with Stripe
- 📚 View enrolled courses
- ⭐ Rate and review courses
- 🔐 User authentication

### For Instructors
- ✏️ Create and manage courses
- 📊 View enrolled students
- 💰 Earn from course sales

### For Admins
- 👥 Manage users
- 📋 Monitor courses
- 💹 View analytics

## Tech Stack

### Frontend
- React 19
- React Router DOM (Navigation)
- Tailwind CSS (Styling)
- Axios (API calls)
- Zustand (State management)
- Stripe (Payment processing)
- Lucide React (Icons)
- Vite (Build tool)

### Backend
- Node.js
- Express.js
- MongoDB (Database)
- Mongoose (ODM)
- JWT (Authentication)
- Bcryptjs (Password hashing)
- Stripe API (Payments)

## Project Structure

```
testmogo/
├── client/                    # React frontend
│   ├── src/
│   │   ├── components/        # React components
│   │   ├── pages/             # Page components
│   │   ├── services/          # API services
│   │   ├── store/             # Zustand stores
│   │   └── App.jsx
│   ├── package.json
│   └── vite.config.js
│
└── server/                    # Node.js backend
    ├── models/                # MongoDB models
    │   ├── User.js
    │   ├── Course.js
    │   └── Order.js
    ├── controllers/           # Route controllers
    │   ├── authController.js
    │   ├── courseController.js
    │   └── paymentController.js
    ├── routes/                # API routes
    │   ├── auth.js
    │   ├── courses.js
    │   └── payments.js
    ├── middleware/            # Custom middleware
    │   └── auth.js
    ├── index.js               # Server entry point
    └── package.json
```

## Installation

### Prerequisites
- Node.js (v14 or higher)
- MongoDB (local or Atlas)
- Stripe account for payment processing

### Backend Setup

1. Navigate to server directory:
```bash
cd server
```

2. Install dependencies:
```bash
npm install
```

3. Create `.env` file:
```bash
cp .env.example .env
```

4. Configure environment variables in `.env`:
```
PORT=5000
MONGODB_URI=mongodb://localhost:27017/elearning
JWT_SECRET=your_jwt_secret_key_here
STRIPE_SECRET_KEY=your_stripe_secret_key
STRIPE_PUBLISHABLE_KEY=your_stripe_publishable_key
NODE_ENV=development
```

5. Start MongoDB service (if running locally)

6. Start the server:
```bash
npm run dev
```

The server will run on `http://localhost:5000`

### Frontend Setup

1. Navigate to client directory:
```bash
cd clinte
```

2. Install dependencies:
```bash
npm install
```

3. Create `.env.local` file:
```bash
cp .env.example .env.local
```

4. Configure environment variables in `.env.local`:
```
VITE_API_URL=http://localhost:5000/api
VITE_STRIPE_PUBLISHABLE_KEY=your_stripe_publishable_key
```

5. Start development server:
```bash
npm run dev
```

The app will run on `http://localhost:3000`

## API Endpoints

### Authentication Routes
- `POST /api/auth/signup` - Register new user
- `POST /api/auth/login` - Login user
- `GET /api/auth/profile` - Get user profile (protected)

### Course Routes
- `GET /api/courses` - Get all courses
- `GET /api/courses/:id` - Get single course
- `POST /api/courses` - Create course (instructor only)
- `PUT /api/courses/:id` - Update course (instructor only)
- `DELETE /api/courses/:id` - Delete course (instructor only)
- `POST /api/courses/:courseId/enroll` - Enroll in course (protected)

### Payment Routes
- `POST /api/payments/checkout` - Create checkout session (protected)
- `POST /api/payments/verify` - Verify payment (protected)
- `GET /api/payments/orders` - Get user orders (protected)

## Authentication

The app uses JWT (JSON Web Tokens) for authentication. After login/signup, the token is stored in localStorage and sent with each request via the Authorization header.

## Payment Integration

Stripe is integrated for secure payment processing. Test credentials:
- Card Number: `4242 4242 4242 4242`
- Expiry: Any future date
- CVC: Any 3 digits

## Database Models

### User
```javascript
{
  name: String,
  email: String (unique),
  password: String (hashed),
  role: String (student/instructor/admin),
  profileImage: String,
  bio: String,
  enrolledCourses: [ObjectId],
  createdAt: Date
}
```

### Course
```javascript
{
  title: String,
  description: String,
  instructor: ObjectId,
  price: Number,
  category: String,
  level: String (Beginner/Intermediate/Advanced),
  image: String,
  duration: Number (hours),
  studentsEnrolled: [ObjectId],
  modules: [{
    title: String,
    lessons: [{
      title: String,
      videoUrl: String,
      description: String
    }]
  }],
  rating: Number,
  reviews: [{
    user: ObjectId,
    comment: String,
    rating: Number,
    createdAt: Date
  }],
  createdAt: Date
}
```

### Order
```javascript
{
  user: ObjectId,
  courses: [{
    course: ObjectId,
    price: Number
  }],
  totalAmount: Number,
  paymentStatus: String (pending/completed/failed),
  paymentMethod: String,
  stripePaymentId: String,
  createdAt: Date
}
```

## Usage

### As a Student

1. **Sign Up**: Create an account as a student
2. **Browse Courses**: Search and filter courses by category and level
3. **Add to Cart**: Click "Add to Cart" on any course
4. **Checkout**: Proceed to checkout and complete payment
5. **Access Courses**: View enrolled courses in "My Courses"

### As an Instructor

1. **Sign Up**: Create an account as an instructor
2. **Create Course**: Fill in course details and publish
3. **Manage Course**: Edit or delete your courses
4. **View Students**: See who enrolled in your courses

## Features to Implement

- [ ] Email verification
- [ ] Password reset
- [ ] Course modules and lessons with video hosting
- [ ] Course completion tracking
- [ ] Certificate generation
- [ ] Instructor analytics dashboard
- [ ] Discussion forums
- [ ] Course recommendations
- [ ] Wishlist functionality
- [ ] Refund system

## Environment Variables

### Server (.env)
```
PORT=5000
MONGODB_URI=mongodb://localhost:27017/elearning
JWT_SECRET=your_jwt_secret_key_here
STRIPE_SECRET_KEY=your_stripe_secret_key
STRIPE_PUBLISHABLE_KEY=your_stripe_publishable_key
NODE_ENV=development
FRONTEND_URL=http://localhost:3000
```

### Client (.env.local)
```
VITE_API_URL=http://localhost:5000/api
VITE_STRIPE_PUBLISHABLE_KEY=your_stripe_publishable_key
```

## Contributing

Feel free to submit pull requests or open issues for bugs and feature requests.

## License

ISC

## Support

For issues and questions, please open an issue on the repository.

---

**Happy Learning! 📚**
