import { Link, useNavigate } from 'react-router-dom';
import { useAuthStore, useCartStore } from '../store';
import { ShoppingCart, LogOut, Menu, X, User } from 'lucide-react';
import { useState, useRef, useEffect } from 'react';

export default function Navbar() {
  const { user, isAuthenticated, logout } = useAuthStore();
  const cartItems = useCartStore((state) => state.items);
  const navigate = useNavigate();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const dropdownRef = useRef(null);

  useEffect(() => {
    function handleClickOutside(event) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setDropdownOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  return (
    <nav className="bg-white border-b border-gray-200 sticky top-0 z-50 transition-all duration-300 shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          <Link to="/" className="flex items-center gap-2 font-bold text-xl group">
            <span className="text-2xl group-hover:rotate-12 transition-transform duration-200">⚡</span>
            <span className="text-gray-900 tracking-tight">Edu<span className="text-blue-600">Market</span></span>
          </Link>

          {/* Desktop Menu */}
          <div className="hidden md:flex items-center gap-8">
            <Link to="/" className="text-gray-600 hover:text-blue-600 font-medium transition-colors hover:underline decoration-blue-600 decoration-2 underline-offset-4">
              Courses
            </Link>

            {isAuthenticated ? (
              <>
                <Link to="/my-courses" className="text-gray-600 hover:text-blue-600 font-medium transition-colors hover:underline decoration-blue-600 decoration-2 underline-offset-4">
                  My Courses
                </Link>
                
                {user?.role === 'instructor' && (
                  <>
                    <Link to="/instructor-dashboard" className="bg-purple-50 text-purple-600 hover:bg-purple-100 border border-purple-200 px-4 py-2 rounded-lg transition-all duration-200 font-medium text-sm">
                      Dashboard
                    </Link>
                    <Link to="/create-course" className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg shadow-lg shadow-blue-600/20 transition-all duration-200 font-medium text-sm">
                      + Create
                    </Link>
                  </>
                )}
                
                <div className="relative">
                  <Link
                    to="/cart"
                    className="relative flex items-center gap-2 text-gray-600 hover:text-blue-600 transition-colors"
                  >
                    <ShoppingCart size={22} />
                    {cartItems.length > 0 && (
                      <span className="absolute -top-2 -right-2 bg-red-500 text-white text-[10px] font-bold rounded-full w-5 h-5 flex items-center justify-center border-2 border-white">
                        {cartItems.length}
                      </span>
                    )}
                  </Link>
                </div>
                
                <div className="relative ml-4" ref={dropdownRef}>
                  <button
                    onClick={() => setDropdownOpen(!dropdownOpen)}
                    className="flex items-center gap-2 focus:outline-none group"
                  >
                    <div className="w-10 h-10 rounded-full bg-blue-100 flex items-center justify-center text-blue-600 border border-blue-200 overflow-hidden transition-transform group-hover:scale-105">
                      {user?.profileImage ? (
                        <img src={user.profileImage} alt={user.name} className="w-full h-full object-cover" />
                      ) : (
                        <span className="font-bold text-lg">{user?.name?.charAt(0).toUpperCase() || <User size={20} />}</span>
                      )}
                    </div>
                  </button>

                  {dropdownOpen && (
                    <div className="absolute right-0 mt-2 w-48 bg-white rounded-xl shadow-lg border border-gray-100 py-2 z-50 animate-in fade-in slide-in-from-top-2 duration-200">
                      <div className="px-4 py-3 border-b border-gray-50 mb-1">
                        <p className="text-sm font-bold text-gray-900 truncate">{user?.name}</p>
                        <p className="text-xs text-gray-500 capitalize">{user?.role}</p>
                      </div>
                      
                      <Link 
                        to="/profile" 
                        className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 hover:text-blue-600 transition-colors"
                        onClick={() => setDropdownOpen(false)}
                      >
                        Profile
                      </Link>

                      <button
                        onClick={() => {
                          handleLogout();
                          setDropdownOpen(false);
                        }}
                        className="w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-red-50 flex items-center gap-2 transition-colors"
                      >
                        <LogOut size={16} />
                        Logout
                      </button>
                    </div>
                  )}
                </div>
              </>
            ) : (
              <>
                <Link
                  to="/login"
                  className="text-gray-600 hover:text-blue-600 font-medium transition-colors"
                >
                  Login
                </Link>
                <Link
                  to="/signup"
                  className="bg-blue-600 text-white hover:bg-blue-700 px-6 py-2.5 rounded-full font-bold transition-all duration-200 transform hover:scale-105 shadow-lg shadow-blue-600/20"
                >
                  Get Started
                </Link>
              </>
            )}
          </div>

          {/* Mobile Menu Button */}
          <button
            className="md:hidden text-gray-600 hover:text-blue-600 transition-colors"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          >
            {mobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>

        {/* Mobile Menu */}
        {mobileMenuOpen && (
          <div className="md:hidden pb-4 border-t border-gray-100 pt-4 bg-white">
            <Link to="/" className="block py-2 px-4 text-gray-600 hover:text-blue-600 font-medium hover:bg-gray-50 rounded-lg mx-2">
              Courses
            </Link>

            {isAuthenticated ? (
              <>
                <Link to="/my-courses" className="block py-2 px-4 text-gray-600 hover:text-blue-600 font-medium hover:bg-gray-50 rounded-lg mx-2">
                  My Courses
                </Link>
                
                {user?.role === 'instructor' && (
                  <>
                    <Link to="/instructor-dashboard" className="block py-2 px-4 text-purple-600 hover:text-purple-700 font-medium hover:bg-purple-50 rounded-lg mx-2">
                      Instructor Dashboard
                    </Link>
                    <Link to="/create-course" className="block py-2 px-4 text-blue-600 hover:text-blue-700 font-medium hover:bg-blue-50 rounded-lg mx-2">
                      + Create Course
                    </Link>
                  </>
                )}
                
                <Link to="/cart" className="block py-2 px-4 text-gray-600 hover:text-blue-600 font-medium hover:bg-gray-50 rounded-lg mx-2">
                  Cart ({cartItems.length})
                </Link>
                <div className="px-4 py-2 border-t border-gray-100 mt-2">
                  <span className="block text-gray-500 text-sm">Signed in as</span>
                  <span className="block text-gray-900 font-medium">{user?.name}</span>
                </div>
                <button
                  onClick={handleLogout}
                  className="block w-full text-left py-2 px-4 text-red-600 hover:text-red-700 font-medium hover:bg-red-50 rounded-lg mx-2 mt-1"
                >
                  Logout
                </button>
              </>
            ) : (
              <>
                <Link to="/login" className="block py-2 px-4 text-gray-600 hover:text-blue-600 font-medium hover:bg-gray-50 rounded-lg mx-2">
                  Login
                </Link>
                <Link to="/signup" className="block py-2 px-4 text-blue-600 hover:text-blue-700 font-medium hover:bg-blue-50 rounded-lg mx-2">
                  Get Started
                </Link>
              </>
            )}
          </div>
        )}
      </div>
    </nav>
  );
}
