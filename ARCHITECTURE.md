# 📋 EduMarket - File Structure & Component Map

## 🗂️ Complete Directory Tree

```
testmogo/
│
├── 📂 server/                          ★ BACKEND (Node.js + Express)
│   ├── 📂 models/
│   │   ├── User.js                    # User schema (student/instructor/admin)
│   │   ├── Course.js                  # Course with modules & reviews
│   │   └── Order.js                   # Order/Purchase tracking
│   │
│   ├── 📂 controllers/
│   │   ├── authController.js          # signup, login, getProfile
│   │   ├── courseController.js        # CRUD, enroll, search
│   │   └── paymentController.js       # checkout, verify, orders
│   │
│   ├── 📂 routes/
│   │   ├── auth.js                    # POST /signup, /login, GET /profile
│   │   ├── courses.js                 # GET/POST/PUT/DELETE courses
│   │   └── payments.js                # POST /checkout, /verify, GET /orders
│   │
│   ├── 📂 middleware/
│   │   └── auth.js                    # JWT verification middleware
│   │
│   ├── index.js                       # Express app setup & server start
│   ├── package.json                   # Dependencies (express, mongoose, stripe, jwt)
│   ├── .env.example                   # Environment variables template
│   └── .gitignore
│
├── 📂 clinte/                         ★ FRONTEND (React + Vite)
│   ├── 📂 src/
│   │   ├── 📂 components/
│   │   │   ├── Navbar.jsx             # Navigation, logout, cart counter
│   │   │   ├── CourseCard.jsx         # Course grid card component
│   │   │   └── PrivateRoute.jsx       # Protected route wrapper
│   │   │
│   │   ├── 📂 pages/
│   │   │   ├── Home.jsx               # Course listing with filters
│   │   │   ├── Login.jsx              # User login form
│   │   │   ├── Signup.jsx             # Registration (student/instructor)
│   │   │   ├── Cart.jsx               # Shopping cart display
│   │   │   ├── Checkout.jsx           # Payment with Stripe
│   │   │   └── MyCourses.jsx          # Enrolled courses display
│   │   │
│   │   ├── 📂 services/
│   │   │   ├── api.js                 # Axios instance with interceptors
│   │   │   └── apiServices.js         # API methods (auth, courses, payment)
│   │   │
│   │   ├── 📂 store/
│   │   │   └── index.js               # Zustand stores (auth, cart)
│   │   │
│   │   ├── App.jsx                    # Main app with routing
│   │   ├── main.jsx                   # React entry point
│   │   └── index.css                  # Global Tailwind styles
│   │
│   ├── 📂 public/                     # Static assets
│   │
│   ├── package.json                   # Dependencies (react, react-router, stripe, zustand)
│   ├── vite.config.js                 # Vite configuration
│   ├── tailwind.config.js             # Tailwind CSS config
│   ├── .env.example                   # Environment variables template
│   └── eslint.config.js               # ESLint rules
│
├── 📄 README.md                       # Complete documentation
├── 📄 SETUP.md                        # Quick start guide
├── 📄 DEPLOYMENT.md                   # Production deployment
├── 📄 PROJECT_COMPLETE.md             # Full project overview
├── 📄 QUICK_REFERENCE.md              # Quick reference card
├── 📄 start.bat                       # Windows startup script
├── 📄 start.sh                        # Linux/Mac startup script
└── 📄 .gitignore
```

---

## 🔄 Data Flow Architecture

### User Authentication Flow
```
┌─────────────────────────────────────────────────────────────┐
│                     USER SIGNUP/LOGIN                         │
└─────────────────────────────────────────────────────────────┘
         │
         ▼
    [React Form]
         │
         ▼
    [Axios API Call]
    POST /api/auth/signup
         │
         ▼
    [Express Router]
         │
         ▼
    [authController]
    └─ Hash password with bcryptjs
    └─ Create user in MongoDB
    └─ Generate JWT token
         │
         ▼
    [Response with Token]
         │
         ▼
    [Save to localStorage]
    [Update Zustand store]
         │
         ▼
    [Token added to header]
    Authorization: Bearer {token}
```

### Course Purchase Flow
```
┌────────────────────────────────────────────────────────────┐
│                  COURSE PURCHASE FLOW                       │
└────────────────────────────────────────────────────────────┘

[Browse Courses] → [Add to Cart] → [View Cart]
         │              │              │
         ▼              ▼              ▼
    GET /api/          localStorage  Cart.jsx
    courses        (Zustand store)      │
         │              │              ▼
         ▼              ▼        [Checkout Button]
    [Display all]  [Persist]         │
                                     ▼
                            [Stripe Checkout Form]
                            POST /api/payments/checkout
                                     │
                                     ▼
                            [Stripe Session Created]
                                     │
                                     ▼
                            [Redirect to Stripe]
                                     │
                         ┌───────────┴───────────┐
                         │                       │
                         ▼                       ▼
                    [Payment Success]    [Payment Failure]
                         │                       │
                         ▼                       ▼
                    POST /verify         [Show Error]
                    Create Order         [Return to Cart]
                    Auto-enroll User
                         │
                         ▼
                    [Update enrolled_courses]
                    [Show "My Courses"]
```

---

## 🎨 Component Hierarchy

```
App.jsx (Root)
│
├── Navbar
│   ├── Logo/Brand
│   ├── Navigation Links
│   ├── Cart Counter
│   ├── User Menu
│   └── Mobile Menu Toggle
│
├── Routes
│   ├── Home/
│   │   └── CourseCard (multiple)
│   │
│   ├── Login/
│   │   └── Login Form
│   │
│   ├── Signup/
│   │   └── Signup Form
│   │
│   ├── Cart/
│   │   ├── Cart Items
│   │   └── Order Summary
│   │
│   ├── Checkout/ (Protected)
│   │   ├── Order Review
│   │   └── Stripe Payment
│   │
│   └── MyCourses/ (Protected)
│       ├── Course List
│       └── Course Card (enrolled)
```

---

## 📱 Page Routing Map

```
/ (Home)
├── Browse all courses
├── Search & filter
├── Add to cart
└── View course details

/login (Public)
├── Email input
├── Password input
└── Sign up link

/signup (Public)
├── Name, Email, Password
├── Role selection
└── Login link

/cart (Public, but protected for checkout)
├── View added courses
├── Remove items
└── Proceed to checkout

/checkout (Protected)
├── Order summary
├── Stripe payment
└── Confirm purchase

/my-courses (Protected)
├── View enrolled courses
└── Continue learning buttons
```

---

## 🔌 API Endpoints Map

```
BASE URL: http://localhost:5000/api

┌─────────────────────────────────────────────────────┐
│              AUTHENTICATION ROUTES                    │
├─────────────────────────────────────────────────────┤
│ POST   /auth/signup              Register user        │
│ POST   /auth/login               Login user          │
│ GET    /auth/profile (JWT)       Get user profile    │
└─────────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────────┐
│              COURSE ROUTES                           │
├─────────────────────────────────────────────────────┤
│ GET    /courses                  Get all courses      │
│ GET    /courses/:id              Get course details  │
│ POST   /courses (JWT)            Create course       │
│ PUT    /courses/:id (JWT)        Update course       │
│ DELETE /courses/:id (JWT)        Delete course       │
│ POST   /courses/:id/enroll (JWT) Enroll in course   │
└─────────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────────┐
│              PAYMENT ROUTES                          │
├─────────────────────────────────────────────────────┤
│ POST   /payments/checkout (JWT)  Create session      │
│ POST   /payments/verify (JWT)    Verify & enroll    │
│ GET    /payments/orders (JWT)    Get user orders    │
└─────────────────────────────────────────────────────┘
```

---

## 💾 Data Models Relationships

```
┌─────────────────────────────────────────────────────┐
│                   USER MODEL                         │
│  ┌──────────────────────────────────────────────┐  │
│  │ _id: ObjectId                                │  │
│  │ name: String                                 │  │
│  │ email: String (unique)                      │  │
│  │ password: String (hashed)                   │  │
│  │ role: String (student/instructor)           │  │
│  │ enrolledCourses: [Course._id] ─────┐        │  │
│  │ createdAt: Date                     │        │  │
│  └──────────────────────────────────────┼───────┘  │
└─────────────────────────────────────────┼──────────┘
                                          │
         ┌────────────────────────────────┼────────────────────────────┐
         │                                │                            │
         ▼                                ▼                            ▼
┌──────────────────────┐        ┌──────────────────────┐    ┌──────────────────────┐
│   COURSE MODEL       │        │   ORDER MODEL        │    │   Review embedded    │
│                      │        │                      │    │                      │
│ _id: ObjectId        │        │ _id: ObjectId        │    │ user: User._id       │
│ title: String        │        │ user: User._id ──┐   │    │ comment: String      │
│ price: Number        │        │ courses: [{       │   │    │ rating: Number       │
│ instructor: User._id │        │   course: ────┐  │   │    │ createdAt: Date      │
│ students: [User._id] │        │   price:      │  │   │    │                      │
│ reviews: [Review]    │        │ }]            │  │   │    │ (embedded in Course) │
│ modules: [Module]    │        │ totalAmount   │  │   │    │                      │
│ rating: Number       │        │ paymentStatus │  │   │    └──────────────────────┘
│ createdAt: Date      │        │ stripePaymentId│  │   │
└──────────────────────┘        │ createdAt:Date│  │   │
                                └───────────┬──────┘   │
                                           │           │
                                           └───────────┘
```

---

## 🎯 Feature Checklist

### Frontend Features
```
✅ User Authentication
   ├─ Signup form with validation
   ├─ Login form
   └─ Logout functionality

✅ Course Browsing
   ├─ Display all courses
   ├─ Search functionality
   ├─ Filter by category
   ├─ Filter by level
   └─ Course detail card

✅ Shopping Cart
   ├─ Add to cart
   ├─ Remove from cart
   ├─ Clear cart
   ├─ Cart counter in navbar
   └─ Total price calculation

✅ Checkout & Payment
   ├─ Order review
   ├─ Stripe integration
   ├─ Payment form
   └─ Order confirmation

✅ Learning Dashboard
   ├─ View enrolled courses
   ├─ Course progress tracking
   └─ Continue learning button

✅ Responsive Design
   ├─ Mobile view
   ├─ Tablet view
   └─ Desktop view
```

### Backend Features
```
✅ Authentication
   ├─ User registration
   ├─ Password hashing
   ├─ JWT token generation
   └─ Protected routes

✅ Course Management
   ├─ Create course
   ├─ Read courses
   ├─ Update course
   ├─ Delete course
   ├─ Search & filter
   └─ Enroll student

✅ Payment Processing
   ├─ Stripe integration
   ├─ Checkout session
   ├─ Payment verification
   ├─ Order creation
   └─ Auto-enrollment

✅ Database
   ├─ User model
   ├─ Course model
   ├─ Order model
   └─ Relationships
```

---

## 🚀 Key Technologies by Component

| Component | Tech Stack |
|-----------|-----------|
| **Frontend** | React 19, Vite, Tailwind CSS |
| **State** | Zustand (auth, cart) |
| **API** | Axios with JWT interceptors |
| **Backend** | Express.js, Node.js |
| **Database** | MongoDB, Mongoose |
| **Auth** | JWT + Bcryptjs |
| **Payment** | Stripe API |
| **Icons** | Lucide React |
| **Routing** | React Router DOM v6 |

---

## 📊 Database Schema Summary

### User Collection
```javascript
{
  name, email, password (hashed), role,
  profileImage, bio, enrolledCourses: [],
  createdAt
}
```

### Course Collection
```javascript
{
  title, description, price, category, level,
  instructor: ObjectId, studentsEnrolled: [],
  image, duration, modules: [],
  rating, reviews: [], createdAt
}
```

### Order Collection
```javascript
{
  user: ObjectId, courses: [{course, price}],
  totalAmount, paymentStatus, stripePaymentId,
  createdAt
}
```

---

## 🔐 Security Implementation

```
Frontend
├─ JWT stored in localStorage
├─ Token sent with every request
├─ Protected routes wrapper
└─ Auto-logout on error

Backend
├─ JWT verification middleware
├─ Password hashing (bcryptjs)
├─ Protected endpoints
├─ Input validation
├─ CORS enabled
└─ Stripe secure payments
```

---

## 📈 Scalability Considerations

```
Current Implementation
├─ Single server instance
├─ Local MongoDB (can switch to Atlas)
├─ In-memory session management
└─ Synchronous operations

Future Improvements
├─ Load balancing
├─ Database clustering
├─ Redis caching
├─ Message queues
├─ Microservices
├─ CDN for assets
└─ Horizontal scaling
```

---

## 🎯 Complete Feature Matrix

| Feature | Frontend | Backend | Database | Payment |
|---------|----------|---------|----------|---------|
| User Auth | ✅ | ✅ | ✅ | - |
| Courses | ✅ | ✅ | ✅ | - |
| Cart | ✅ | - | - | - |
| Checkout | ✅ | ✅ | ✅ | ✅ |
| Orders | ✅ | ✅ | ✅ | ✅ |
| Enrollment | ✅ | ✅ | ✅ | - |
| Reviews | UI Ready | ✅ | ✅ | - |
| Analytics | UI Ready | Ready | ✅ | - |

---

This completes the entire MERN stack e-learning platform! 🎉
