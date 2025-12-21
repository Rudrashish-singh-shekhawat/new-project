import { useEffect } from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Navbar from "./components/Navbar";
import PrivateRoute from "./components/PrivateRoute";
import InstructorRoute from "./components/InstructorRoute";
import Home from "./pages/Home";
import Login from "./pages/Login";
import Signup from "./pages/Signup";
import Cart from "./pages/Cart";
import Checkout from "./pages/Checkout";
import MyCourses from "./pages/MyCourses";
import CreateCourse from "./pages/CreateCourse";
import EditCourse from "./pages/EditCourse";
import InstructorDashboard from "./pages/InstructorDashboard";
import CourseDetail from "./pages/CourseDetail";
import CourseContent from "./pages/CourseContent";
import { useAuthStore } from "./store";
import Profile from "./pages/Profile";
import { authService } from "./services/apiServices";

function App() {
  const isAuthenticated = useAuthStore((state) => state.isAuthenticated);
  const user = useAuthStore((state) => state.user);
  const setUser = useAuthStore((state) => state.setUser);

  // Fetch user profile on app initialization if authenticated
  useEffect(() => {
    if (isAuthenticated && !user) {
      fetchUserProfile();
    }
  }, [isAuthenticated]);

  const fetchUserProfile = async () => {
    try {
      const response = await authService.getProfile();
      const userData = response.data?.user ?? response.data;
      if (userData) {
        setUser(userData);
        console.log("User profile loaded:", userData);
      }
    } catch (error) {
      console.error("Failed to fetch user profile:", error);
    }
  };

  return (
    <Router>
      <Navbar />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<Signup />} />
        <Route path="/cart" element={<Cart />} />
        <Route
          path="/checkout"
          element={
            <PrivateRoute isAuthenticated={isAuthenticated}>
              <Checkout />
            </PrivateRoute>
          }
        />
        <Route
          path="/profile"
          element={
            <PrivateRoute isAuthenticated={isAuthenticated}>
              <Profile/>
            </PrivateRoute>
          }
        />

        <Route
          path="/my-courses"
          element={
            <PrivateRoute isAuthenticated={isAuthenticated}>
              <MyCourses />
            </PrivateRoute>
          }
        />
        <Route
          path="/instructor-dashboard"
          element={
            <InstructorRoute isAuthenticated={isAuthenticated} user={user}>
              <InstructorDashboard />
            </InstructorRoute>
          }
        />
        <Route
          path="/create-course"
          element={
            <InstructorRoute isAuthenticated={isAuthenticated} user={user}>
              <CreateCourse />
            </InstructorRoute>
          }
        />
        <Route
          path="/edit-course/:id"
          element={
            <InstructorRoute isAuthenticated={isAuthenticated} user={user}>
              <EditCourse />
            </InstructorRoute>
          }
        />
        <Route path="/course/:id" element={<CourseDetail />} />
        <Route
          path="/course/:id/content"
          element={
            <PrivateRoute isAuthenticated={isAuthenticated}>
              <CourseContent />
            </PrivateRoute>
          }
        />
      </Routes>
    </Router>
  );
}

export default App;
