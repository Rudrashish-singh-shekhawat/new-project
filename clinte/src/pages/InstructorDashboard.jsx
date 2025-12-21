import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { courseService } from '../services/apiServices';
import { useAuthStore } from '../store';
import { Plus, Edit2, Trash2, Eye, Users, DollarSign, BarChart3, MessageSquare, Settings, HelpCircle, TrendingUp, Award } from 'lucide-react';

export default function InstructorDashboard() {
  const navigate = useNavigate();
  const user = useAuthStore((state) => state.user);
  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [activeTab, setActiveTab] = useState('overview');
  const [stats, setStats] = useState({
    totalCourses: 0,
    totalStudents: 0,
    totalEarnings: 0,
    averageRating: 4.5,
    totalModules: 0,
  });
  const [recentEnrollments, setRecentEnrollments] = useState([]);
  const [uniqueStudents, setUniqueStudents] = useState([]);

  useEffect(() => {
    fetchInstructorCourses();
  }, []);

  const fetchInstructorCourses = async () => {
    try {
      setLoading(true);
      const response = await courseService.getAllCourses();
      const instructorCourses = response.data.filter(
        (course) => course.instructor._id === user?.id || course.instructor === user?.id
      );
      setCourses(instructorCourses);

      const totalStudents = instructorCourses.reduce(
        (acc, course) => acc + (course.studentsEnrolled?.length || 0),
        0
      );
      const totalEarnings = instructorCourses.reduce(
        (acc, course) => acc + (course.price * (course.studentsEnrolled?.length || 0)),
        0
      );
      
      const totalModules = instructorCourses.reduce(
        (acc, course) => acc + (course.modules?.length || 0),
        0
      );

      const avgRating = instructorCourses.length > 0 
        ? (instructorCourses.reduce((acc, c) => acc + (c.rating || 0), 0) / instructorCourses.length).toFixed(1)
        : 0;

      setStats({
        totalCourses: instructorCourses.length,
        totalStudents,
        totalEarnings,
        averageRating: avgRating || 'N/A',
        totalModules,
      });

      // Process Enrollments (Real Data)
      const enrollments = instructorCourses.flatMap((course) => {
        return (course.studentsEnrolled || []).map((student) => {
          const isPopulated = typeof student === 'object' && student !== null;
          return {
            id: isPopulated ? student._id : student,
            studentName: isPopulated ? student.name : `Student (${String(student).substring(0, 6)}...)`,
            courseName: course.title,
            enrolledDate: null, // Date not available in current schema
          };
        });
      });
      setRecentEnrollments(enrollments.slice(0, 5));

      // Process Unique Students
      const studentMap = new Map();
      instructorCourses.forEach(course => {
        (course.studentsEnrolled || []).forEach(student => {
          const isPopulated = typeof student === 'object' && student !== null;
          const id = isPopulated ? student._id : student;
          const name = isPopulated ? student.name : `Student (${String(id).substring(0, 6)}...)`;
          
          if (!studentMap.has(id)) {
            studentMap.set(id, { id, name, enrolledCount: 0 });
          }
          studentMap.get(id).enrolledCount += 1;
        });
      });
      setUniqueStudents(Array.from(studentMap.values()));
    } catch (err) {
      setError('Failed to load courses');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteCourse = async (courseId) => {
    if (window.confirm('Are you sure you want to delete this course?')) {
      try {
        await courseService.deleteCourse(courseId);
        setCourses(courses.filter((c) => c._id !== courseId));
        alert('Course deleted successfully');
      } catch (err) {
        alert('Failed to delete course');
      }
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-xl text-gray-600">Loading your dashboard...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50/50 py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto space-y-8">
        {/* Header */}
        <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-6 md:p-8">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
            <div>
              <h1 className="text-3xl font-bold text-gray-900 tracking-tight">Instructor Dashboard</h1>
              <p className="text-gray-500 mt-1">Welcome back, {user?.name}! Manage your courses and track performance.</p>
            </div>
            <Link
              to="/create-course"
              className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-full shadow-lg shadow-blue-600/20 flex items-center gap-2 font-semibold transition-all duration-200 hover:-translate-y-0.5"
            >
              <Plus size={20} />
              Create New Course
            </Link>
          </div>
        </div>

        {/* Tab Navigation */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-1.5 overflow-x-auto">
          <div className="flex min-w-max space-x-1">
            <button
              onClick={() => setActiveTab('overview')}
              className={`px-6 py-2.5 rounded-lg font-medium transition-all duration-200 flex items-center gap-2 ${
                activeTab === 'overview'
                  ? 'bg-blue-50 text-blue-700 shadow-sm ring-1 ring-blue-200'
                  : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
              }`}
            >
              <BarChart3 size={18} />
              Overview
            </button>
            <button
              onClick={() => setActiveTab('courses')}
              className={`px-6 py-2.5 rounded-lg font-medium transition-all duration-200 flex items-center gap-2 ${
                activeTab === 'courses'
                  ? 'bg-blue-50 text-blue-700 shadow-sm ring-1 ring-blue-200'
                  : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
              }`}
            >
              <span className="text-lg">📚</span> My Courses
            </button>
            <button
              onClick={() => setActiveTab('analytics')}
              className={`px-6 py-2.5 rounded-lg font-medium transition-all duration-200 flex items-center gap-2 ${
                activeTab === 'analytics'
                  ? 'bg-blue-50 text-blue-700 shadow-sm ring-1 ring-blue-200'
                  : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
              }`}
            >
              <TrendingUp size={18} />
              Analytics
            </button>
            <button
              onClick={() => setActiveTab('students')}
              className={`px-6 py-2.5 rounded-lg font-medium transition-all duration-200 flex items-center gap-2 ${
                activeTab === 'students'
                  ? 'bg-blue-50 text-blue-700 shadow-sm ring-1 ring-blue-200'
                  : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
              }`}
            >
              <Users size={18} />
              Students
            </button>
            <button
              onClick={() => setActiveTab('settings')}
              className={`px-6 py-2.5 rounded-lg font-medium transition-all duration-200 flex items-center gap-2 ${
                activeTab === 'settings'
                  ? 'bg-blue-50 text-blue-700 shadow-sm ring-1 ring-blue-200'
                  : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
              }`}
            >
              <Settings size={18} />
              Settings
            </button>
          </div>
        </div>

        {/* OVERVIEW TAB */}
        {activeTab === 'overview' && (
          <div className="space-y-8">
            {/* Statistics */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 hover:shadow-md transition-all duration-200">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-gray-600 text-sm mb-1">Total Courses</p>
                    <p className="text-3xl font-bold text-gray-900">{stats.totalCourses}</p>
                  </div>
                  <div className="bg-blue-50 p-3 rounded-xl">
                    <Eye size={24} className="text-blue-600" />
                  </div>
                </div>
              </div>

              <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 hover:shadow-md transition-all duration-200">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-gray-600 text-sm mb-1">Total Students</p>
                    <p className="text-3xl font-bold text-gray-900">{stats.totalStudents}</p>
                  </div>
                  <div className="bg-green-50 p-3 rounded-xl">
                    <Users size={24} className="text-green-600" />
                  </div>
                </div>
              </div>

              <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 hover:shadow-md transition-all duration-200">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-gray-600 text-sm mb-1">Total Earnings</p>
                    <p className="text-3xl font-bold text-gray-900">${stats.totalEarnings.toFixed(2)}</p>
                  </div>
                  <div className="bg-purple-50 p-3 rounded-xl">
                    <DollarSign size={24} className="text-purple-600" />
                  </div>
                </div>
              </div>

              <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 hover:shadow-md transition-all duration-200">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-gray-600 text-sm mb-1">Avg Rating</p>
                    <p className="text-3xl font-bold text-gray-900">{stats.averageRating}</p>
                  </div>
                  <div className="bg-yellow-50 p-3 rounded-xl">
                    <Award size={24} className="text-yellow-600" />
                  </div>
                </div>
              </div>
            </div>

            {/* Recent Enrollments */}
            <div className="bg-white rounded-2xl shadow-sm border border-gray-200 overflow-hidden">
              <div className="p-6 border-b border-gray-100">
                <h2 className="text-xl font-bold text-gray-900">Recent Enrollments</h2>
              </div>
              {recentEnrollments.length > 0 ? (
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead className="bg-gray-50/50">
                      <tr>
                        <th className="px-6 py-4 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Student Name</th>
                        <th className="px-6 py-4 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Course</th>
                        <th className="px-6 py-4 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Enrolled Date</th>
                        <th className="px-6 py-4 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Status</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-100">
                      {recentEnrollments.map((enrollment) => (
                        <tr key={enrollment.id} className="hover:bg-gray-50/50 transition-colors">
                          <td className="px-6 py-4 text-sm font-medium text-gray-900">{enrollment.studentName}</td>
                          <td className="px-6 py-4 text-sm text-gray-600">{enrollment.courseName}</td>
                          <td className="px-6 py-4 text-sm text-gray-500">
                            {enrollment.enrolledDate ? enrollment.enrolledDate.toLocaleDateString() : 'N/A'}
                          </td>
                          <td className="px-6 py-4">
                            <span className="bg-green-50 text-green-700 border border-green-100 px-2.5 py-0.5 rounded-full text-xs font-medium">
                              Active
                            </span>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              ) : (
                <div className="p-8 text-center text-gray-500">No recent enrollments yet.</div>
              )}
            </div>

            {/* Quick Actions */}
            <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-6">
              <h2 className="text-xl font-bold text-gray-900 mb-6">Quick Actions</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                <Link
                  to="/create-course"
                  className="group p-4 rounded-xl border border-gray-200 hover:border-blue-200 hover:bg-blue-50 transition-all duration-200 flex flex-col items-center justify-center gap-3 text-center"
                >
                  <div className="w-10 h-10 rounded-full bg-blue-100 text-blue-600 flex items-center justify-center group-hover:scale-110 transition-transform">
                    <Plus size={20} />
                  </div>
                  <span className="font-semibold text-gray-700 group-hover:text-blue-700">Create Course</span>
                </Link>
                <div 
                  onClick={() => setActiveTab('analytics')}
                  className="group p-4 rounded-xl border border-gray-200 hover:border-purple-200 hover:bg-purple-50 transition-all duration-200 flex flex-col items-center justify-center gap-3 text-center cursor-pointer"
                >
                  <div className="w-10 h-10 rounded-full bg-purple-100 text-purple-600 flex items-center justify-center group-hover:scale-110 transition-transform">
                    <BarChart3 size={20} />
                  </div>
                  <span className="font-semibold text-gray-700 group-hover:text-purple-700">View Analytics</span>
                </div>
                <div 
                  onClick={() => navigate('/messages')}
                  className="group p-4 rounded-xl border border-gray-200 hover:border-green-200 hover:bg-green-50 transition-all duration-200 flex flex-col items-center justify-center gap-3 text-center cursor-pointer"
                >
                  <div className="w-10 h-10 rounded-full bg-green-100 text-green-600 flex items-center justify-center group-hover:scale-110 transition-transform">
                    <MessageSquare size={20} />
                  </div>
                  <span className="font-semibold text-gray-700 group-hover:text-green-700">Messages</span>
                </div>
                <div 
                  onClick={() => setActiveTab('settings')}
                  className="group p-4 rounded-xl border border-gray-200 hover:border-orange-200 hover:bg-orange-50 transition-all duration-200 flex flex-col items-center justify-center gap-3 text-center cursor-pointer"
                >
                  <div className="w-10 h-10 rounded-full bg-orange-100 text-orange-600 flex items-center justify-center group-hover:scale-110 transition-transform">
                    <Settings size={20} />
                  </div>
                  <span className="font-semibold text-gray-700 group-hover:text-orange-700">Settings</span>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* COURSES TAB */}
        {activeTab === 'courses' && (
          <div>
            <h2 className="text-2xl font-bold text-gray-900 mb-6">Your Courses</h2>
            {courses.length === 0 ? (
              <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-12 text-center">
                <p className="text-gray-600 text-lg mb-4">You haven't created any courses yet.</p>
                <Link
                  to="/create-course"
                  className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-full inline-flex items-center gap-2 transition-colors shadow-lg shadow-blue-600/20"
                >
                  <Plus size={20} />
                  Create Your First Course
                </Link>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {courses.map((course) => (
                  <div
                    key={course._id}
                    className="bg-white rounded-2xl border border-gray-200 overflow-hidden hover:shadow-xl transition-all duration-300 group"
                  >
                    <div className="h-48 bg-gray-100 relative overflow-hidden">
                      {course.image ? (
                        <img
                          src={course.image}
                          alt={course.title}
                          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                        />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center bg-blue-50 text-blue-200">
                            <span className="text-5xl">📚</span>
                        </div>
                      )}
                      <div className="absolute top-3 right-3 bg-white/90 backdrop-blur-sm px-2 py-1 rounded-md text-xs font-bold text-gray-700 shadow-sm">
                        {course.category}
                      </div>
                    </div>

                    <div className="p-5">
                      <h3 className="font-bold text-lg text-gray-900 mb-2 line-clamp-1 group-hover:text-blue-600 transition-colors">
                        {course.title}
                      </h3>

                      <div className="space-y-2 text-sm text-gray-500 mb-6">
                        <div className="flex items-center justify-between">
                          <span className="flex items-center gap-1"><BarChart3 size={14}/> Level</span>
                          <span className="font-medium text-gray-700">{course.level}</span>
                        </div>
                        <div className="flex items-center justify-between">
                          <span className="flex items-center gap-1"><Users size={14}/> Students</span>
                          <span className="font-medium text-gray-700">{course.studentsEnrolled?.length || 0}</span>
                        </div>
                        <div className="flex items-center justify-between">
                          <span className="flex items-center gap-1"><DollarSign size={14}/> Price</span>
                          <span className="font-bold text-gray-900">${course.price}</span>
                        </div>
                      </div>

                      <div className="flex gap-2 pt-2 border-t border-gray-100">
                        <button
                          onClick={() => navigate(`/course/${course._id}`)}
                          className="flex-1 bg-gray-50 hover:bg-gray-100 text-gray-700 py-2 rounded-lg flex items-center justify-center gap-1 transition-colors text-sm font-medium"
                        >
                          <Eye size={16} />
                          View
                        </button>
                        <button
                          onClick={() => navigate(`/edit-course/${course._id}`)}
                          className="flex-1 bg-blue-50 hover:bg-blue-100 text-blue-600 py-2 rounded-lg flex items-center justify-center gap-1 transition-colors text-sm font-medium"
                        >
                          <Edit2 size={16} />
                          Edit
                        </button>
                        <button
                          onClick={() => handleDeleteCourse(course._id)}
                          className="p-2 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                          title="Delete Course"
                        >
                          <Trash2 size={18} />
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* ANALYTICS TAB */}
        {activeTab === 'analytics' && (
          <div className="space-y-8">
            <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-8">
              <h2 className="text-xl font-bold text-gray-900 mb-6">Course Analytics</h2>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
                <div className="bg-blue-50/50 p-6 rounded-2xl border border-blue-100">
                  <div className="flex items-center gap-4">
                    <TrendingUp size={32} className="text-blue-600" />
                    <div>
                      <p className="text-gray-600 font-medium">Total Modules Created</p>
                      <p className="text-3xl font-bold text-gray-900">{stats.totalModules}</p>
                    </div>
                  </div>
                </div>

                <div className="bg-green-50/50 p-6 rounded-2xl border border-green-100">
                  <div className="flex items-center gap-4">
                    <Users size={32} className="text-green-600" />
                    <div>
                      <p className="text-gray-600 font-medium">Avg. Students / Course</p>
                      <p className="text-3xl font-bold text-gray-900">
                        {stats.totalCourses > 0 ? (stats.totalStudents / stats.totalCourses).toFixed(1) : 0}
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              <div className="bg-gray-50 p-8 rounded-xl text-center border border-gray-100">
                <p className="text-gray-600 mb-4">📊 More detailed analytics will appear as you grow.</p>
                <p className="text-sm text-gray-500">Track course performance, student engagement, and more.</p>
              </div>
            </div>
          </div>
        )}

        {/* STUDENTS TAB */}
        {activeTab === 'students' && (
          <div className="bg-white rounded-2xl shadow-sm border border-gray-200 overflow-hidden">
            <div className="p-6 border-b border-gray-100">
              <h2 className="text-xl font-bold text-gray-900">My Students</h2>
            </div>
            
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gray-50/50">
                  <tr>
                    <th className="px-6 py-4 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Student Name</th>
                    <th className="px-6 py-4 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Enrolled Courses</th>
                    <th className="px-6 py-4 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Progress</th>
                    <th className="px-6 py-4 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Action</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                  {uniqueStudents.length > 0 ? (
                    uniqueStudents.map((student) => (
                      <tr key={student.id} className="hover:bg-gray-50/50 transition-colors">
                        <td className="px-6 py-4 text-sm font-medium text-gray-900">{student.name}</td>
                        <td className="px-6 py-4 text-sm text-gray-600">{student.enrolledCount} courses</td>
                        <td className="px-6 py-4">
                          <div className="w-32 bg-gray-100 rounded-full h-2 overflow-hidden">
                            <div
                              className="bg-blue-600 h-2 rounded-full"
                              style={{ width: '100%' }} // Placeholder for progress
                            ></div>
                          </div>
                        </td>
                        <td className="px-6 py-4">
                          <button className="text-gray-400 hover:text-blue-600 transition-colors">
                            <MessageSquare size={18} />
                          </button>
                        </td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td colSpan="4" className="px-6 py-8 text-center text-gray-500">
                        No students found.
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* SETTINGS TAB */}
        {activeTab === 'settings' && (
          <div className="space-y-8">
            <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-8">
              <h2 className="text-xl font-bold text-gray-900 mb-6">Instructor Settings</h2>
              
              <div className="space-y-6">
                <div className="border-b border-gray-100 pb-6">
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">Profile Information</h3>
                  <p className="text-gray-500 mb-4">Update your profile information and teaching credentials</p>
                  <button className="bg-white border border-gray-300 text-gray-700 hover:bg-gray-50 px-4 py-2 rounded-lg transition-colors font-medium">
                    Edit Profile
                  </button>
                </div>

                <div className="border-b border-gray-100 pb-6">
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">Payment Settings</h3>
                  <p className="text-gray-500 mb-4">Manage your bank account and withdrawal preferences</p>
                  <button className="bg-white border border-gray-300 text-gray-700 hover:bg-gray-50 px-4 py-2 rounded-lg transition-colors font-medium">
                    Configure Payment
                  </button>
                </div>

                <div className="border-b border-gray-100 pb-6">
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">Notifications</h3>
                  <p className="text-gray-500 mb-4">Manage email and push notification preferences</p>
                  <button className="bg-white border border-gray-300 text-gray-700 hover:bg-gray-50 px-4 py-2 rounded-lg transition-colors font-medium">
                    Notification Settings
                  </button>
                </div>

                <div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">Account Security</h3>
                  <p className="text-gray-500 mb-4">Change your password and manage security settings</p>
                  <button className="bg-white border border-gray-300 text-gray-700 hover:bg-gray-50 px-4 py-2 rounded-lg transition-colors font-medium">
                    Security Settings
                  </button>
                </div>
              </div>
            </div>

            {/* Help Section */}
            <div className="bg-gradient-to-r from-purple-50 to-blue-50 rounded-2xl shadow-sm p-8 border border-purple-100">
              <div className="flex items-start gap-4">
                <HelpCircle size={32} className="text-purple-600 flex-shrink-0" />
                <div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">Need Help?</h3>
                  <p className="text-gray-600 mb-4">Check our documentation and tutorials to learn more about managing your courses.</p>
                  <button className="bg-white text-purple-600 hover:bg-purple-50 border border-purple-200 px-4 py-2 rounded-lg transition-colors font-medium">
                    View Help Center
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
