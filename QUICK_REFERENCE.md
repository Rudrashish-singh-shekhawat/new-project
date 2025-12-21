# 🚀 EduMarket Quick Reference Card

## 📋 Project Overview
- **Type**: MERN Stack E-Learning Platform
- **Purpose**: Sell educational courses online
- **Status**: ✅ Complete and ready to run

---

## 🎯 Quick Commands

### Windows
```bash
# Run this to get interactive menu
start.bat

# Or manually:
cd server && npm run dev          # Terminal 1
cd ../clinte && npm run dev       # Terminal 2
```

### Linux/Mac
```bash
./start.sh          # Interactive menu
# Or manually:
cd server && npm run dev
cd ../clinte && npm run dev
```

---

## 🔗 Important URLs

| What | URL |
|------|-----|
| Frontend App | http://localhost:3000 |
| Backend API | http://localhost:5000 |
| API Docs | Check server/routes/ |
| MongoDB | Local or MongoDB Atlas |

---

## 📁 Key Folders

```
server/                 ← Backend (Express + MongoDB)
├── models/             ← Database schemas
├── controllers/        ← Business logic
├── routes/             ← API endpoints
└── index.js            ← Server startup

clinte/                 ← Frontend (React)
├── src/components/     ← Reusable components
├── src/pages/          ← Page components
├── src/services/       ← API calls
├── src/store/          ← State management
└── App.jsx             ← Main app
```

---

## 🔑 Environment Files

### server/.env
```
PORT=5000
MONGODB_URI=mongodb://localhost:27017/elearning
JWT_SECRET=your_secret_here
STRIPE_SECRET_KEY=sk_test_xxxxx
STRIPE_PUBLISHABLE_KEY=pk_test_xxxxx
NODE_ENV=development
```

### clinte/.env.local
```
VITE_API_URL=http://localhost:5000/api
VITE_STRIPE_PUBLISHABLE_KEY=pk_test_xxxxx
```

---

## 💳 Test Stripe Card
```
Number: 4242 4242 4242 4242
Expiry: Any future date
CVC: Any 3 digits
```

---

## 📚 Main Features

| Feature | Status | File |
|---------|--------|------|
| User Auth | ✅ | authController.js |
| Course CRUD | ✅ | courseController.js |
| Shopping Cart | ✅ | Cart.jsx |
| Stripe Payment | ✅ | paymentController.js |
| Enrolled Courses | ✅ | MyCourses.jsx |
| Search/Filter | ✅ | Home.jsx |

---

## 🔐 Authentication Flow

```
1. User Signs Up (name, email, password, role)
   ↓
2. Password hashed with bcryptjs
   ↓
3. JWT token generated
   ↓
4. Token stored in localStorage
   ↓
5. Token sent with every API request
```

---

## 🛒 Shopping Flow

```
1. Browse courses
   ↓
2. Add to cart (stored in localStorage)
   ↓
3. View cart
   ↓
4. Checkout
   ↓
5. Stripe payment
   ↓
6. Order created
   ↓
7. Auto-enroll in courses
```

---

## 📊 API Endpoints

### Auth (No Auth Required)
```
POST   /api/auth/signup
POST   /api/auth/login
```

### Auth (Requires Token)
```
GET    /api/auth/profile
```

### Courses (Public)
```
GET    /api/courses
GET    /api/courses/:id
```

### Courses (Instructor)
```
POST   /api/courses
PUT    /api/courses/:id
DELETE /api/courses/:id
```

### Courses (Logged In)
```
POST   /api/courses/:courseId/enroll
```

### Payments (Requires Token)
```
POST   /api/payments/checkout
POST   /api/payments/verify
GET    /api/payments/orders
```

---

## 🔧 Troubleshooting

| Problem | Solution |
|---------|----------|
| npm: command not found | Install Node.js |
| Port 5000 in use | Change PORT in .env |
| MongoDB connection fails | Start MongoDB or use Atlas |
| CORS errors | Check FRONTEND_URL in .env |
| Stripe errors | Use test keys (pk_test_/sk_test_) |
| "Cannot find module" | Run `npm install` again |

---

## 📦 Dependencies

### Backend (14 packages)
```
express, mongoose, mongodb, cors, dotenv,
bcryptjs, jsonwebtoken, stripe, validator, nodemon
```

### Frontend (10 packages)
```
react, react-dom, react-router-dom, axios,
zustand, @stripe/react-stripe-js, lucide-react, tailwindcss
```

---

## 📈 Project Structure

```
testmogo/
├── server/              (Backend)
├── clinte/              (Frontend)
├── README.md            (Full docs)
├── SETUP.md             (Setup guide)
├── DEPLOYMENT.md        (Deploy guide)
├── PROJECT_COMPLETE.md  (Complete overview)
├── start.bat            (Windows)
└── start.sh             (Linux/Mac)
```

---

## 🚀 5-Minute Startup

1. **Extract/Open** project folder
2. **Run**: `start.bat` (Windows) or `./start.sh` (Linux/Mac)
3. **Choose option 1**: Install dependencies
4. **Choose option 6**: Create .env files
5. **Edit .env files** with your credentials
6. **Choose option 2**: Start both servers
7. **Open**: http://localhost:3000

---

## 📚 Documentation

| File | Purpose |
|------|---------|
| README.md | Complete documentation |
| SETUP.md | Step-by-step setup |
| DEPLOYMENT.md | Production deployment |
| PROJECT_COMPLETE.md | Full project overview |
| This file | Quick reference |

---

## 🎯 Testing Checklist

- [ ] Create account
- [ ] Browse courses
- [ ] Search courses
- [ ] Add to cart
- [ ] View cart
- [ ] Checkout
- [ ] Complete payment
- [ ] View enrolled courses
- [ ] Create course (as instructor)
- [ ] Check in "My Courses"

---

## 💡 Tips

1. **First Time?** Read SETUP.md
2. **Deployment?** Read DEPLOYMENT.md
3. **Issues?** Check SETUP.md troubleshooting
4. **Lost?** Check PROJECT_COMPLETE.md
5. **Need help?** Check console for errors

---

## 🔐 Security Checklist

✅ JWT authentication  
✅ Password hashing  
✅ Protected routes  
✅ CORS enabled  
✅ No hardcoded secrets  
✅ Input validation  
✅ Secure payment (Stripe)  

---

## 📞 Quick Help

**Q: Where do I add courses?**  
A: Sign up as instructor, then create course from dashboard (feature ready)

**Q: How do students buy courses?**  
A: Browse → Add to Cart → Checkout → Pay with Stripe → Enrolled!

**Q: Is payment real?**  
A: No, uses test Stripe keys. Use test card 4242...

**Q: Where's the database?**  
A: MongoDB (local or MongoDB Atlas - free)

**Q: Can I change the theme?**  
A: Yes! Edit Tailwind config or CSS in src/index.css

---

## 📊 Tech Stack Summary

```
Frontend:  React + Tailwind CSS + Zustand + Stripe
Backend:   Express + MongoDB + JWT + Stripe  
Deploy:    Vercel (Frontend) + Heroku (Backend)
Payment:   Stripe
```

---

## 🎉 You're All Set!

Your complete MERN e-learning platform is ready!

**Questions?** Check the docs. **Issues?** Check console. **Ready?** Start coding! 🚀

---

**Last Updated**: December 2024  
**Status**: ✅ Complete  
**Ready**: 🚀 Yes!
