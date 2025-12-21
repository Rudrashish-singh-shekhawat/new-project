import { useEffect, useState } from 'react';
import { useAuthStore } from '../store';
import { authService } from '../services/apiServices';
import { User, Mail, Calendar, Shield, BookOpen } from 'lucide-react';

export default function Profile() {
  const { user, setUser } = useAuthStore();
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const response = await authService.getProfile();
        // Handle potential response structures (direct object or wrapped in user property)
        const userData = response.data?.user ?? response.data;
        if (userData) {
          setUser(userData);
        }
      } catch (error) {
        console.error('Failed to fetch profile:', error);
      } finally {
        setLoading(false);
      }
    };

    if (localStorage.getItem('token')) {
      fetchProfile();
    } else {
      setLoading(false);
    }
  }, [setUser]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  if (!user) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-gray-900 mb-2">Access Denied</h2>
          <p className="text-gray-500">Please log in to view your profile.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
          {/* Header/Banner */}
          <div className="h-40 bg-gradient-to-r from-blue-600 to-indigo-600 relative">
            <div className="absolute bottom-0 left-0 w-full h-1/2 bg-gradient-to-t from-black/20 to-transparent"></div>
          </div>

          <div className="px-8 pb-8 relative">
            {/* Profile Image & Basic Info */}
            <div className="flex flex-col sm:flex-row items-start sm:items-end -mt-12 mb-8 gap-6">
              <div className="h-32 w-32 rounded-full ring-4 ring-white bg-white shadow-md flex items-center justify-center text-gray-300 overflow-hidden relative z-10">
                {user.profileImage ? (
                  <img
                    src={user.profileImage}
                    alt={user.name}
                    className="h-full w-full object-cover"
                  />
                ) : (
                  <User size={64} strokeWidth={1.5} />
                )}
              </div>
              <div className="flex-1 mb-2">
                <h1 className="text-3xl font-bold text-gray-900">{user.name}</h1>
                <div className="flex items-center gap-3 mt-2">
                  <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-sm font-medium bg-blue-50 text-blue-700 capitalize border border-blue-100">
                    <Shield size={14} />
                    {user.role}
                  </span>
                  <span className="text-gray-500 text-sm flex items-center gap-1">
                    <Calendar size={14} />
                    Joined {user.createdAt ? new Date(user.createdAt).toLocaleDateString() : 'N/A'}
                  </span>
                </div>
              </div>
            </div>

            {/* Details Grid */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              {/* Left Column: Contact & Stats */}
              <div className="space-y-6">
                <div className="bg-gray-50 rounded-xl p-6 border border-gray-100">
                  <h3 className="text-sm font-bold text-gray-900 uppercase tracking-wider mb-4">
                    Contact Info
                  </h3>
                  <div className="space-y-4">
                    <div className="flex items-center gap-3 text-gray-700">
                      <div className="h-8 w-8 rounded-lg bg-white flex items-center justify-center text-gray-400 shadow-sm border border-gray-100">
                        <Mail size={16} />
                      </div>
                      <div className="overflow-hidden">
                        <p className="text-xs text-gray-500">Email Address</p>
                        <p className="text-sm font-medium truncate" title={user.email}>
                          {user.email}
                        </p>
                      </div>
                    </div>
                  </div>
                </div>

                {user.role === 'student' && (
                  <div className="bg-blue-50 rounded-xl p-6 border border-blue-100">
                    <h3 className="text-sm font-bold text-blue-900 uppercase tracking-wider mb-4">
                      Learning Stats
                    </h3>
                    <div className="flex items-center gap-4">
                      <div className="h-12 w-12 rounded-xl bg-blue-100 flex items-center justify-center text-blue-600">
                        <BookOpen size={24} />
                      </div>
                      <div>
                        <p className="text-2xl font-bold text-gray-900">
                          {user.enrolledCourses?.length || 0}
                        </p>
                        <p className="text-sm text-gray-600">Enrolled Courses</p>
                      </div>
                    </div>
                  </div>
                )}
              </div>

              {/* Right Column: Bio & Activity */}
              <div className="lg:col-span-2 space-y-6">
                <div className="bg-white rounded-xl border border-gray-200 p-6 shadow-sm">
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="text-lg font-bold text-gray-900">About Me</h3>
                  </div>
                  <div className="text-gray-600 leading-relaxed">
                    {user.bio ? (
                      <p>{user.bio}</p>
                    ) : (
                      <div className="text-center py-8 bg-gray-50 rounded-lg border border-dashed border-gray-200">
                        <p className="text-gray-400 italic">"No bio provided yet."</p>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}