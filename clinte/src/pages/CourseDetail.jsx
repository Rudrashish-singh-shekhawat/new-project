import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { courseService } from '../services/apiServices';

export default function CourseDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [course, setCourse] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchCourse = async () => {
      try {
        setLoading(true);
        const res = await courseService.getCourseById(id);
        setCourse(res.data);
      } catch (err) {
        console.error('Failed to load course:', err);
        setError('Failed to load course');
      } finally {
        setLoading(false);
      }
    };

    fetchCourse();
  }, [id]);

  if (loading) return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
    </div>
  );

  if (error) return (
    <div className="min-h-screen flex items-center justify-center text-red-600">{error}</div>
  );

  if (!course) return null;

  const startLearning = () => {
    // If there are modules/lessons, navigate to the first lesson route (not implemented),
    // for now just open the course page content and show modules.
    // Future: navigate to /course/:id/lesson/:moduleIndex/:lessonIndex
    navigate(`/course/${course._id}/content`);
  };

  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="max-w-4xl mx-auto bg-white rounded-lg shadow-md overflow-hidden">
        <div className="p-6">
          <h1 className="text-3xl font-bold mb-2">{course.title}</h1>
          <p className="text-sm text-gray-600 mb-4">By {course.instructor?.name}</p>
          <p className="text-gray-700 mb-6">{course.description}</p>

          <div className="mb-6">
            <button onClick={startLearning} className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg">Start / Resume</button>
          </div>

          <div>
            <h2 className="text-xl font-semibold mb-3">Modules</h2>
            {course.modules && course.modules.length > 0 ? (
              <div className="space-y-4">
                {course.modules.map((m, mi) => (
                  <div key={mi} className="border rounded-lg p-4">
                    <h3 className="font-bold">{m.title}</h3>
                    <p className="text-sm text-gray-600 mb-2">{m.description}</p>
                    <ul className="list-disc pl-5 text-sm">
                      {m.lessons && m.lessons.map((l, li) => (
                        <li key={li}>{l.title}</li>
                      ))}
                    </ul>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-gray-600">No modules available</p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
