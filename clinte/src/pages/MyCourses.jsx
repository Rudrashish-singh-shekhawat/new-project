import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuthStore } from '../store';
import { courseService } from '../services/apiServices';
import { CheckCircle, AlertCircle, BookOpen, Clock, BarChart, PlayCircle, User, GraduationCap } from 'lucide-react';

export default function MyCourses() {
  const user = useAuthStore((state) => state.user);
  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    if (!user) {
      // User not loaded yet, wait
      console.log('User not loaded yet');
      return;
    }

    console.log('User loaded:', user._id);
    console.log('Enrolled courses count:', user?.enrolledCourses?.length);

    if (user?.enrolledCourses?.length > 0) {
      fetchEnrolledCourses();
    } else {
      setLoading(false);
      setCourses([]);
      console.log('User has no enrolled courses');
    }
  }, [user]);

  const navigate = useNavigate();

  const fetchEnrolledCourses = async () => {
    try {
      setLoading(true);
      setError('');
      
      console.log('Current user:', user);
      console.log('Enrolled courses:', user?.enrolledCourses);
      
      if (!user?.enrolledCourses || user.enrolledCourses.length === 0) {
        console.log('No enrolled courses found');
        setCourses([]);
        setLoading(false);
        return;
      }

      // Try to use the dedicated endpoint first
      try {
        console.log('Fetching enrolled courses from /courses/enrolled/list');
        const response = await courseService.getEnrolledCourses();
        console.log('Enrolled courses response:', response.data);
        const allCourses = Array.isArray(response.data) ? response.data : 
                          (response.data?.courses ? response.data.courses : []);
        setCourses(allCourses);
        console.log('Successfully loaded enrolled courses:', allCourses);
      } catch (endpointError) {
        // Fallback: Fetch all courses and filter by enrolled
        console.log('Fallback: Filtering all courses...', endpointError.message);
        const response = await courseService.getAllCourses({});
        const allCourses = Array.isArray(response.data) ? response.data : [];
        
        const enrolledCourses = allCourses.filter((course) => 
          user.enrolledCourses.includes(course._id)
        );
        
        console.log('Filtered courses:', enrolledCourses);
        setCourses(enrolledCourses);
      }
    } catch (error) {
      console.error('Error fetching courses:', error);
      setError('Failed to load your courses. Please try again.');
      setCourses([]);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-4 border-blue-100 border-t-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-500 font-medium">Loading your learning journey...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="bg-red-50 border border-red-100 rounded-2xl p-8 text-center max-w-2xl mx-auto">
            <div className="mx-auto bg-red-100 w-16 h-16 rounded-full flex items-center justify-center mb-4">
              <AlertCircle className="text-red-600" size={32} />
            </div>
            <h3 className="text-lg font-bold text-gray-900 mb-2">Something went wrong</h3>
            <p className="text-gray-600 mb-6">{error}</p>
            <button 
              onClick={fetchEnrolledCourses}
              className="bg-white border border-gray-200 text-gray-900 px-6 py-2 rounded-lg hover:bg-gray-50 transition-colors font-medium"
            >
              Try again
            </button>
          </div>
        </div>
      </div>
    );
  }

  if (courses.length === 0) {
    return (
      <div className="min-h-screen bg-gray-50 py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">My Learning</h1>
          <p className="text-gray-500 mb-12">Track your progress and continue learning.</p>
          
          <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-12 text-center">
            <div className="mx-auto bg-blue-50 w-20 h-20 rounded-full flex items-center justify-center mb-6">
              <BookOpen className="text-blue-600" size={40} />
            </div>
            <h2 className="text-2xl font-bold text-gray-900 mb-3">No courses enrolled yet</h2>
            <p className="text-gray-500 mb-8 max-w-md mx-auto">
              You haven't enrolled in any courses yet. Explore our catalog to find the perfect course for you.
            </p>
            <button 
              onClick={() => navigate('/')}
              className="bg-blue-600 hover:bg-blue-700 text-white px-8 py-3 rounded-xl font-semibold transition-all shadow-lg shadow-blue-600/20"
            >
              Browse Courses
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">My Learning</h1>
          <p className="text-gray-500 mt-1">Welcome back! Continue where you left off.</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {courses.map((course) => (
            <div key={course._id} className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden hover:shadow-md transition-all duration-300 flex flex-col h-full group">
              <div className="aspect-video bg-gray-100 relative overflow-hidden">
                {course.image ? (
                  <img src={course.image} alt={course.title} className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105" />
                ) : (
                  <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-blue-50 to-blue-100">
                    <GraduationCap className="text-blue-200" size={48} />
                  </div>
                )}
                <div className="absolute inset-0 bg-black/0 group-hover:bg-black/5 transition-colors duration-300" />
                <div className="absolute top-4 right-4 bg-white/90 backdrop-blur-sm text-green-700 text-xs font-bold px-3 py-1.5 rounded-full flex items-center gap-1.5 shadow-sm">
                  <CheckCircle size={12} className="text-green-600" />
                  Enrolled
                </div>
              </div>

              <div className="p-6 flex flex-col flex-1">
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-3">
                    <span className="bg-blue-50 text-blue-700 text-[10px] uppercase tracking-wider font-bold px-2 py-1 rounded-md">
                      {course.category || 'Course'}
                    </span>
                  </div>
                  <h3 className="font-bold text-xl text-gray-900 line-clamp-2 mb-3 group-hover:text-blue-600 transition-colors">
                    {course.title}
                  </h3>
                  <p className="text-gray-500 text-sm mb-6 line-clamp-2 leading-relaxed">
                    {course.description}
                  </p>
                </div>

                <div className="flex items-center justify-between text-xs text-gray-500 mb-6 pt-4 border-t border-gray-50">
                  <div className="flex items-center gap-1.5">
                    <User size={14} className="text-gray-400" />
                    <span className="font-medium">{course.instructor?.name || 'Instructor'}</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <div className="flex items-center gap-1">
                      <BarChart size={14} className="text-gray-400" />
                      <span>{course.level}</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <Clock size={14} className="text-gray-400" />
                      <span>{course.duration}h</span>
                    </div>
                  </div>
                </div>

                <button 
                  onClick={() => navigate(`/course/${course._id}/content`)} 
                  className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 rounded-xl transition-all flex items-center justify-center gap-2 group/btn shadow-blue-100 hover:shadow-blue-200"
                >
                  <PlayCircle size={18} className="group-hover/btn:translate-x-0.5 transition-transform" />
                  Continue Learning
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
