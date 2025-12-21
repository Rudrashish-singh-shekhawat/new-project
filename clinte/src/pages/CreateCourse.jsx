import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { courseService } from '../services/apiServices';
import { useAuthStore } from '../store';

export default function CreateCourse() {
  const navigate = useNavigate();
  const user = useAuthStore((state) => state.user);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const [formData, setFormData] = useState({
    title: '',
    description: '',
    price: '',
    category: '',
    level: 'Beginner',
    duration: '',
    image: '',
  });

  const [modules, setModules] = useState([
    {
      title: '',
      lessons: [
        {
          title: '',
          videoUrl: '',
          videoFile: null,
          pdfFile: null,
          description: '',
        },
      ],
    },
  ]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  const handleModuleChange = (moduleIndex, field, value) => {
    const newModules = [...modules];
    newModules[moduleIndex][field] = value;
    setModules(newModules);
  };

  const handleLessonChange = (moduleIndex, lessonIndex, field, value) => {
    const newModules = [...modules];
    newModules[moduleIndex].lessons[lessonIndex][field] = value;
    setModules(newModules);
  };

  const addModule = () => {
    setModules([
      ...modules,
      {
        title: '',
        lessons: [
          {
            title: '',
            videoUrl: '',
            videoFile: null,
            pdfFile: null,
            description: '',
          },
        ],
      },
    ]);
  };

  const addLesson = (moduleIndex) => {
    const newModules = [...modules];
    newModules[moduleIndex].lessons.push({
      title: '',
      videoUrl: '',
      videoFile: null,
      pdfFile: null,
      description: '',
    });
    setModules(newModules);
  };

  const removeModule = (moduleIndex) => {
    setModules(modules.filter((_, i) => i !== moduleIndex));
  };

  const removeLesson = (moduleIndex, lessonIndex) => {
    const newModules = [...modules];
    newModules[moduleIndex].lessons = newModules[moduleIndex].lessons.filter(
      (_, i) => i !== lessonIndex
    );
    setModules(newModules);
  };

  const handleLessonFileChange = (moduleIndex, lessonIndex, fileType, file) => {
    const newModules = [...modules];
    if (fileType === 'video') {
      newModules[moduleIndex].lessons[lessonIndex].videoFile = file;
    } else if (fileType === 'pdf') {
      newModules[moduleIndex].lessons[lessonIndex].pdfFile = file;
    }
    setModules(newModules);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');

    if (!formData.title || !formData.description || !formData.price) {
      setError('Please fill in all required fields');
      return;
    }

    // Validate modules
    const validModules = modules.filter((m) => m.title && m.lessons.some((l) => l.title));
    if (validModules.length === 0) {
      setError('Please add at least one module with lessons');
      return;
    }

    setLoading(true);

    try {
      const courseData = {
        ...formData,
        price: parseFloat(formData.price),
        duration: parseInt(formData.duration),
        modules: validModules,
      };

      // Check if any lesson has file uploads
      const hasFileUploads = validModules.some((m) =>
        m.lessons.some((l) => l.videoFile || l.pdfFile)
      );

      if (hasFileUploads) {
        // Use FormData for multipart upload
        const formDataObj = new FormData();
        formDataObj.append('title', courseData.title);
        formDataObj.append('description', courseData.description);
        formDataObj.append('price', courseData.price);
        formDataObj.append('category', courseData.category);
        formDataObj.append('level', courseData.level);
        formDataObj.append('duration', courseData.duration);
        formDataObj.append('image', courseData.image);

        // Create modules structure without files for JSON
        const modulesForJSON = validModules.map((module) => ({
          title: module.title,
          lessons: module.lessons.map((lesson) => ({
            title: lesson.title,
            description: lesson.description,
            videoUrl: lesson.videoUrl || '',
          })),
        }));

        // Add modules as JSON string
        formDataObj.append('modules', JSON.stringify(modulesForJSON));

        // Add files separately
        validModules.forEach((module, mIdx) => {
          module.lessons.forEach((lesson, lIdx) => {
            if (lesson.videoFile) {
              formDataObj.append(
                `modules[${mIdx}][lessons][${lIdx}][videoFile]`,
                lesson.videoFile
              );
            }
            if (lesson.pdfFile) {
              formDataObj.append(`modules[${mIdx}][lessons][${lIdx}][pdfFile]`, lesson.pdfFile);
            }
          });
        });

        console.log('Submitting course with files');
        const response = await courseService.createCourse(formDataObj);
        console.log('Course created:', response);
      } else {
        console.log('Submitting course data:', courseData);
        const response = await courseService.createCourse(courseData);
        console.log('Course created:', response);
      }

      setSuccess('Course created successfully!');
      setTimeout(() => {
        navigate('/my-courses');
      }, 2000);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to create course');
      console.error('Error creating course:', err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 py-8 px-4">
      <div className="max-w-4xl mx-auto">
        <div className="bg-white rounded-lg shadow-lg p-8">
          <h1 className="text-4xl font-bold text-gray-800 mb-2">Create New Course</h1>
          <p className="text-gray-600 mb-8">
            Share your knowledge with students around the world
          </p>

          {error && (
            <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded-lg mb-6">
              {error}
            </div>
          )}

          {success && (
            <div className="bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded-lg mb-6">
              {success}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Basic Information */}
            <div className="bg-gray-100 p-6 rounded-lg">
              <h2 className="text-2xl font-bold text-gray-800 mb-4">Course Information</h2>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-gray-700 font-medium mb-2">
                    Course Title *
                  </label>
                  <input
                    type="text"
                    name="title"
                    value={formData.title}
                    onChange={handleInputChange}
                    placeholder="e.g., Advanced React Development"
                    className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-600"
                    required
                  />
                </div>

                <div>
                  <label className="block text-gray-700 font-medium mb-2">Category *</label>
                  <input
                    type="text"
                    name="category"
                    value={formData.category}
                    onChange={handleInputChange}
                    placeholder="e.g., Web Development"
                    className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-600"
                    required
                  />
                </div>

                <div>
                  <label className="block text-gray-700 font-medium mb-2">Price ($) *</label>
                  <input
                    type="number"
                    name="price"
                    value={formData.price}
                    onChange={handleInputChange}
                    placeholder="e.g., 49.99"
                    step="0.01"
                    min="0"
                    className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-600"
                    required
                  />
                </div>

                <div>
                  <label className="block text-gray-700 font-medium mb-2">Level</label>
                  <select
                    name="level"
                    value={formData.level}
                    onChange={handleInputChange}
                    className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-600"
                  >
                    <option value="Beginner">Beginner</option>
                    <option value="Intermediate">Intermediate</option>
                    <option value="Advanced">Advanced</option>
                  </select>
                </div>

                <div>
                  <label className="block text-gray-700 font-medium mb-2">
                    Duration (hours) *
                  </label>
                  <input
                    type="number"
                    name="duration"
                    value={formData.duration}
                    onChange={handleInputChange}
                    placeholder="e.g., 20"
                    min="1"
                    className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-600"
                    required
                  />
                </div>

                <div>
                  <label className="block text-gray-700 font-medium mb-2">
                    Course Image URL
                  </label>
                  <input
                    type="url"
                    name="image"
                    value={formData.image}
                    onChange={handleInputChange}
                    placeholder="https://example.com/image.jpg"
                    className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-600"
                  />
                </div>
              </div>

              <div className="mt-4">
                <label className="block text-gray-700 font-medium mb-2">
                  Description *
                </label>
                <textarea
                  name="description"
                  value={formData.description}
                  onChange={handleInputChange}
                  placeholder="Describe your course, what students will learn, etc."
                  rows="4"
                  className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-600"
                  required
                ></textarea>
              </div>
            </div>

            {/* Course Modules */}
            <div className="bg-gray-100 p-6 rounded-lg">
              <h2 className="text-2xl font-bold text-gray-800 mb-4">Course Modules</h2>

              {modules.map((module, moduleIndex) => (
                <div
                  key={moduleIndex}
                  className="bg-white p-4 rounded-lg mb-4 border border-gray-300"
                >
                  <div className="flex justify-between items-center mb-4">
                    <h3 className="text-lg font-semibold text-gray-800">
                      Module {moduleIndex + 1}
                    </h3>
                    {modules.length > 1 && (
                      <button
                        type="button"
                        onClick={() => removeModule(moduleIndex)}
                        className="bg-red-500 hover:bg-red-600 text-white px-3 py-1 rounded transition-colors"
                      >
                        Remove
                      </button>
                    )}
                  </div>

                  <input
                    type="text"
                    value={module.title}
                    onChange={(e) => handleModuleChange(moduleIndex, 'title', e.target.value)}
                    placeholder="Module Title"
                    className="w-full px-4 py-2 border rounded-lg mb-4 focus:outline-none focus:ring-2 focus:ring-blue-600"
                  />

                  {/* Lessons */}
                  <div className="ml-4">
                    <h4 className="font-semibold text-gray-700 mb-2">Lessons</h4>
                    {module.lessons.map((lesson, lessonIndex) => (
                      <div
                        key={lessonIndex}
                        className="bg-gray-50 p-3 rounded-lg mb-3 border border-gray-200"
                      >
                        <div className="flex justify-between items-start mb-2">
                          <span className="text-sm font-medium text-gray-600">
                            Lesson {lessonIndex + 1}
                          </span>
                          {module.lessons.length > 1 && (
                            <button
                              type="button"
                              onClick={() => removeLesson(moduleIndex, lessonIndex)}
                              className="text-red-500 hover:text-red-700 text-sm"
                            >
                              Remove
                            </button>
                          )}
                        </div>

                        <input
                          type="text"
                          value={lesson.title}
                          onChange={(e) =>
                            handleLessonChange(moduleIndex, lessonIndex, 'title', e.target.value)
                          }
                          placeholder="Lesson Title"
                          className="w-full px-3 py-2 border rounded mb-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-600"
                        />

                        <input
                          type="url"
                          value={lesson.videoUrl}
                          onChange={(e) =>
                            handleLessonChange(
                              moduleIndex,
                              lessonIndex,
                              'videoUrl',
                              e.target.value
                            )
                          }
                          placeholder="Video URL (e.g., YouTube link)"
                          className="w-full px-3 py-2 border rounded mb-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-600"
                        />

                        <div className="mb-2">
                          <label className="block text-xs text-gray-600 font-medium mb-1">
                            Or upload video file:
                          </label>
                          <input
                            type="file"
                            accept="video/*"
                            onChange={(e) =>
                              handleLessonFileChange(
                                moduleIndex,
                                lessonIndex,
                                'video',
                                e.target.files?.[0] || null
                              )
                            }
                            className="w-full px-3 py-2 border rounded text-sm focus:outline-none focus:ring-2 focus:ring-blue-600"
                          />
                          {lesson.videoFile && (
                            <p className="text-xs text-green-600 mt-1">
                              ✓ {lesson.videoFile.name}
                            </p>
                          )}
                        </div>

                        <div className="mb-2">
                          <label className="block text-xs text-gray-600 font-medium mb-1">
                            Upload PDF (optional):
                          </label>
                          <input
                            type="file"
                            accept=".pdf"
                            onChange={(e) =>
                              handleLessonFileChange(
                                moduleIndex,
                                lessonIndex,
                                'pdf',
                                e.target.files?.[0] || null
                              )
                            }
                            className="w-full px-3 py-2 border rounded text-sm focus:outline-none focus:ring-2 focus:ring-blue-600"
                          />
                          {lesson.pdfFile && (
                            <p className="text-xs text-green-600 mt-1">
                              ✓ {lesson.pdfFile.name}
                            </p>
                          )}
                        </div>

                        <textarea
                          value={lesson.description}
                          onChange={(e) =>
                            handleLessonChange(
                              moduleIndex,
                              lessonIndex,
                              'description',
                              e.target.value
                            )
                          }
                          placeholder="Lesson Description"
                          rows="2"
                          className="w-full px-3 py-2 border rounded text-sm focus:outline-none focus:ring-2 focus:ring-blue-600"
                        ></textarea>
                      </div>
                    ))}

                    <button
                      type="button"
                      onClick={() => addLesson(moduleIndex)}
                      className="bg-blue-500 hover:bg-blue-600 text-white px-3 py-1 rounded text-sm transition-colors"
                    >
                      + Add Lesson
                    </button>
                  </div>
                </div>
              ))}

              <button
                type="button"
                onClick={addModule}
                className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded transition-colors"
              >
                + Add Module
              </button>
            </div>

            {/* Submit */}
            <div className="flex gap-4">
              <button
                type="submit"
                disabled={loading}
                className="flex-1 bg-blue-600 hover:bg-blue-700 disabled:bg-gray-400 text-white font-semibold py-3 rounded-lg transition-colors"
              >
                {loading ? 'Creating Course...' : 'Create Course'}
              </button>
              <button
                type="button"
                onClick={() => navigate('/my-courses')}
                className="flex-1 bg-gray-400 hover:bg-gray-500 text-white font-semibold py-3 rounded-lg transition-colors"
              >
                Cancel
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
