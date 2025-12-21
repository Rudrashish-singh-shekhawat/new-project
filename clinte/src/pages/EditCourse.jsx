import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import api from '../services/api';
import { Save, ArrowLeft, Plus, Trash2, Video, GripVertical, Upload, FileText } from 'lucide-react';

export default function EditCourse() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    price: '',
    category: '',
    level: 'Beginner',
    image: '',
    modules: [],
  });

  useEffect(() => {
    const fetchCourse = async () => {
      try {
        const response = await api.get(`/courses/${id}`);
        const course = response.data;
        setFormData({
          title: course.title || '',
          description: course.description || '',
          price: course.price || '',
          category: course.category || '',
          level: course.level || 'Beginner',
          image: course.image || '',
          modules: course.modules || [],
        });
      } catch (err) {
        setError('Failed to fetch course details');
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchCourse();
  }, [id]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const addModule = () => {
    setFormData(prev => ({
      ...prev,
      modules: [...prev.modules, { title: '', lessons: [] }]
    }));
  };

  const removeModule = (index) => {
    const newModules = [...formData.modules];
    newModules.splice(index, 1);
    setFormData(prev => ({ ...prev, modules: newModules }));
  };

  const handleModuleChange = (index, value) => {
    const newModules = [...formData.modules];
    newModules[index].title = value;
    setFormData(prev => ({ ...prev, modules: newModules }));
  };

  const addLesson = (moduleIndex) => {
    const newModules = [...formData.modules];
    newModules[moduleIndex].lessons.push({ title: '', videoUrl: '', description: '' });
    setFormData(prev => ({ ...prev, modules: newModules }));
  };

  const removeLesson = (moduleIndex, lessonIndex) => {
    const newModules = [...formData.modules];
    newModules[moduleIndex].lessons.splice(lessonIndex, 1);
    setFormData(prev => ({ ...prev, modules: newModules }));
  };

  const handleLessonChange = (moduleIndex, lessonIndex, field, value) => {
    const newModules = [...formData.modules];
    newModules[moduleIndex].lessons[lessonIndex][field] = value;
    setFormData(prev => ({ ...prev, modules: newModules }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    const submitData = new FormData();
    submitData.append('title', formData.title);
    submitData.append('description', formData.description);
    submitData.append('price', formData.price);
    submitData.append('category', formData.category);
    submitData.append('level', formData.level);
    submitData.append('image', formData.image);

    formData.modules.forEach((module, mIndex) => {
      submitData.append(`modules[${mIndex}][title]`, module.title);
      module.lessons.forEach((lesson, lIndex) => {
        submitData.append(`modules[${mIndex}][lessons][${lIndex}][title]`, lesson.title);
        submitData.append(`modules[${mIndex}][lessons][${lIndex}][videoUrl]`, lesson.videoUrl || '');
        submitData.append(`modules[${mIndex}][lessons][${lIndex}][description]`, lesson.description || '');
        
        if (lesson.videoFile instanceof File) {
          submitData.append(`modules[${mIndex}][lessons][${lIndex}][videoFile]`, lesson.videoFile);
        }
        if (lesson.pdfFile instanceof File) {
          submitData.append(`modules[${mIndex}][lessons][${lIndex}][pdfFile]`, lesson.pdfFile);
        }
      });
    });

    try {
      await api.put(`/courses/${id}`, submitData, {
        headers: { 'Content-Type': 'multipart/form-data' }
      });
      navigate('/instructor-dashboard');
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to update course');
    }
  };

  if (loading) return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50/50">
      <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
    </div>
  );

  return (
    <div className="min-h-screen bg-gray-50/50 py-8 pb-24">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-8">
          <button
            onClick={() => navigate('/instructor-dashboard')}
            className="group flex items-center text-gray-500 hover:text-blue-600 transition-colors mb-4 font-medium"
          >
            <div className="w-8 h-8 rounded-full bg-white border border-gray-200 flex items-center justify-center mr-2 group-hover:border-blue-200 group-hover:bg-blue-50 transition-all">
              <ArrowLeft size={16} />
            </div>
            Back to Dashboard
          </button>
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-gray-900 tracking-tight">Edit Course</h1>
              <p className="text-gray-500 mt-2">Update your course content and details.</p>
            </div>
            <div className="hidden sm:block">
              <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-blue-50 text-blue-700 border border-blue-100">
                {formData.category || 'Uncategorized'}
              </span>
            </div>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="space-y-8">
            {error && (
            <div className="bg-red-50 border border-red-100 text-red-600 p-4 rounded-xl text-sm flex items-center gap-2">
              <div className="w-2 h-2 rounded-full bg-red-500"></div>
                {error}
              </div>
            )}

          {/* Basic Info Section */}
          <div className="bg-white rounded-2xl shadow-sm border border-gray-200 overflow-hidden">
            <div className="p-8 space-y-6">
              <h2 className="text-xl font-bold text-gray-900 flex items-center gap-2">
                <span className="w-1 h-6 bg-blue-600 rounded-full"></span>
                Basic Information
              </h2>

              <div className="grid grid-cols-1 gap-6">
                {/* Title */}
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">Course Title</label>
                  <input
                    type="text"
                    name="title"
                    value={formData.title}
                    onChange={handleChange}
                    required
                    className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all font-medium"
                    placeholder="e.g. Complete Web Development Bootcamp"
                  />
                </div>

                {/* Description */}
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">Description</label>
                  <textarea
                    name="description"
                    value={formData.description}
                    onChange={handleChange}
                    required
                    rows="4"
                    className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all"
                    placeholder="What will students learn in this course?"
                  />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {/* Price */}
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">Price ($)</label>
                    <div className="relative">
                      <span className="absolute left-4 top-3.5 text-gray-500 font-medium">$</span>
                      <input
                        type="number"
                        name="price"
                        value={formData.price}
                        onChange={handleChange}
                        required
                        min="0"
                        step="0.01"
                        className="w-full pl-8 pr-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all font-medium"
                      />
                    </div>
                  </div>

                  {/* Category */}
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">Category</label>
                    <select
                      name="category"
                      value={formData.category}
                      onChange={handleChange}
                      required
                      className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all"
                    >
                      <option value="">Select Category</option>
                      <option value="Development">Development</option>
                      <option value="Business">Business</option>
                      <option value="Design">Design</option>
                      <option value="Marketing">Marketing</option>
                      <option value="IT & Software">IT & Software</option>
                      <option value="Personal Development">Personal Development</option>
                    </select>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {/* Level */}
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">Level</label>
                    <select
                      name="level"
                      value={formData.level}
                      onChange={handleChange}
                      className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all"
                    >
                      <option value="Beginner">Beginner</option>
                      <option value="Intermediate">Intermediate</option>
                      <option value="Advanced">Advanced</option>
                    </select>
                  </div>

                  {/* Image URL */}
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">Cover Image URL</label>
                    <input
                      type="url"
                      name="image"
                      value={formData.image}
                      onChange={handleChange}
                      placeholder="https://example.com/image.jpg"
                      className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all"
                    />
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Curriculum Section */}
          <div className="bg-white rounded-2xl shadow-sm border border-gray-200 overflow-hidden">
            <div className="p-8">
              <div className="flex items-center justify-between mb-8">
                <h2 className="text-xl font-bold text-gray-900 flex items-center gap-2">
                  <span className="w-1 h-6 bg-blue-600 rounded-full"></span>
                  Course Curriculum
                </h2>
                <span className="text-sm text-gray-500">{formData.modules.length} Modules</span>
              </div>
              
              <div className="space-y-8">
                {formData.modules.map((module, mIndex) => (
                  <div key={mIndex} className="bg-gray-50/50 rounded-2xl p-6 border border-gray-200 transition-all hover:border-blue-200 hover:shadow-sm">
                    {/* Module Header */}
                    <div className="flex items-start gap-4 mb-6">
                      <div className="mt-3 text-gray-400 cursor-move hover:text-gray-600">
                        <GripVertical size={20} />
                      </div>
                      <div className="flex-1">
                        <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-1">
                          Module {mIndex + 1}
                        </label>
                        <input
                          type="text"
                          value={module.title}
                          onChange={(e) => handleModuleChange(mIndex, e.target.value)}
                          placeholder="Enter module title..."
                          className="w-full px-4 py-2 bg-white border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all font-medium text-gray-900 placeholder-gray-400"
                        />
                      </div>
                      <button
                        type="button"
                        onClick={() => removeModule(mIndex)}
                        className="mt-6 p-2 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-all"
                        title="Delete Module"
                      >
                        <Trash2 size={20} />
                      </button>
                    </div>

                    {/* Lessons */}
                    <div className="pl-0 md:pl-10 space-y-4">
                      {module.lessons.map((lesson, lIndex) => (
                        <div key={lIndex} className="bg-white p-5 rounded-xl border border-gray-200 shadow-sm hover:shadow-md transition-all group">
                          <div className="flex justify-between items-start mb-4">
                            <h4 className="text-sm font-bold text-gray-700 flex items-center gap-2">
                              <div className="w-6 h-6 rounded-md bg-blue-50 text-blue-600 flex items-center justify-center">
                                <Video size={14} />
                              </div>
                              Lesson {lIndex + 1}
                            </h4>
                            <button
                              type="button"
                              onClick={() => removeLesson(mIndex, lIndex)}
                              className="text-gray-300 hover:text-red-500 transition-colors opacity-0 group-hover:opacity-100"
                              title="Remove Lesson"
                            >
                              <Trash2 size={16} />
                            </button>
                          </div>
                          
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div className="col-span-1 md:col-span-2">
                              <input
                                type="text"
                                value={lesson.title}
                                onChange={(e) => handleLessonChange(mIndex, lIndex, 'title', e.target.value)}
                                placeholder="Lesson Title"
                                className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all"
                              />
                            </div>
                            <input
                              type="text"
                              value={lesson.videoUrl}
                              onChange={(e) => handleLessonChange(mIndex, lIndex, 'videoUrl', e.target.value)}
                              placeholder="Video URL (e.g., YouTube embed)"
                              className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all"
                            />
                            <textarea
                              value={lesson.description}
                              onChange={(e) => handleLessonChange(mIndex, lIndex, 'description', e.target.value)}
                              placeholder="Lesson Description (Optional)"
                              rows="1"
                              className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all md:col-span-2 resize-none focus:rows-3"
                            />
                            
                            {/* File Uploads */}
                            <div className="md:col-span-2 grid grid-cols-1 md:grid-cols-2 gap-4 pt-3 border-t border-gray-50 mt-1">
                              <div>
                                <label className="block text-xs font-semibold text-gray-500 mb-2 uppercase tracking-wide">
                                  Video File
                                </label>
                                <div className="flex items-center gap-3">
                                  <label className="cursor-pointer inline-flex items-center gap-2 px-4 py-2 bg-gray-50 border border-gray-200 rounded-lg hover:bg-blue-50 hover:border-blue-200 hover:text-blue-600 transition-all text-xs font-semibold text-gray-600">
                                    <Upload size={14} />
                                    Upload Video
                                    <input
                                      type="file"
                                      accept="video/*"
                                      className="hidden"
                                      onChange={(e) => handleLessonChange(mIndex, lIndex, 'videoFile', e.target.files[0])}
                                    />
                                  </label>
                                  <span className="text-xs text-gray-400 truncate flex-1">
                                    {lesson.videoFile instanceof File 
                                      ? <span className="text-green-600 font-medium">{lesson.videoFile.name}</span>
                                      : (lesson.videoFile ? 'Current file exists' : 'No file selected')}
                                  </span>
                                </div>
                              </div>

                              <div>
                                <label className="block text-xs font-semibold text-gray-500 mb-2 uppercase tracking-wide">
                                  PDF Resources
                                </label>
                                <div className="flex items-center gap-3">
                                  <label className="cursor-pointer inline-flex items-center gap-2 px-4 py-2 bg-gray-50 border border-gray-200 rounded-lg hover:bg-blue-50 hover:border-blue-200 hover:text-blue-600 transition-all text-xs font-semibold text-gray-600">
                                    <FileText size={14} />
                                    Upload PDF
                                    <input
                                      type="file"
                                      accept="application/pdf"
                                      className="hidden"
                                      onChange={(e) => handleLessonChange(mIndex, lIndex, 'pdfFile', e.target.files[0])}
                                    />
                                  </label>
                                  <span className="text-xs text-gray-400 truncate flex-1">
                                    {lesson.pdfFile instanceof File 
                                      ? <span className="text-green-600 font-medium">{lesson.pdfFile.name}</span>
                                      : (lesson.pdfFile ? 'Current file exists' : 'No file selected')}
                                  </span>
                                </div>
                              </div>
                            </div>
                          </div>
                        </div>
                      ))}
                      
                      <button
                        type="button"
                        onClick={() => addLesson(mIndex)}
                        className="w-full py-3 border-2 border-dashed border-gray-200 rounded-xl text-gray-500 hover:border-blue-400 hover:text-blue-600 hover:bg-blue-50/50 font-medium transition-all flex items-center justify-center gap-2 text-sm"
                      >
                        <Plus size={16} />
                        Add Lesson to Module {mIndex + 1}
                      </button>
                    </div>
                  </div>
                ))}

                <button
                  type="button"
                  onClick={addModule}
                  className="w-full py-6 border-2 border-dashed border-gray-300 rounded-2xl text-gray-500 hover:border-blue-500 hover:text-blue-600 hover:bg-blue-50/30 font-bold transition-all flex items-center justify-center gap-2 text-lg group"
                >
                  <div className="w-8 h-8 rounded-full bg-gray-100 text-gray-500 flex items-center justify-center group-hover:bg-blue-100 group-hover:text-blue-600 transition-colors">
                    <Plus size={20} />
                  </div>
                  Add New Module
                </button>
              </div>
            </div>
          </div>

          {/* Sticky Action Bar */}
          <div className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 p-4 shadow-lg z-50">
            <div className="max-w-4xl mx-auto flex items-center justify-between">
              <p className="text-sm text-gray-500 hidden sm:block">
                Unsaved changes will be lost.
              </p>
              <div className="flex gap-4 w-full sm:w-auto">
                <button
                  type="button"
                  onClick={() => navigate('/instructor-dashboard')}
                  className="flex-1 sm:flex-none px-6 py-2.5 border border-gray-300 text-gray-700 font-semibold rounded-xl hover:bg-gray-50 transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="flex-1 sm:flex-none flex items-center justify-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-8 py-2.5 rounded-xl font-semibold transition-all shadow-lg shadow-blue-600/20 hover:-translate-y-0.5"
                >
                  <Save size={20} />
                  Save Changes
                </button>
              </div>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
}