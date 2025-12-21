import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { courseService } from '../services/apiServices';
import { useAuthStore } from '../store';

// --- HELPER: Handle Local vs External URLs ---
const API_BASE_URL = 'http://localhost:5000'; // Replace with your actual env variable

const getFileUrl = (path) => {
  if (!path) return '';
  if (path.startsWith('http') || path.startsWith('//')) return path;
  const cleanPath = path.startsWith('/') ? path.slice(1) : path;
  return `${API_BASE_URL}/${cleanPath}`;
};

export default function CourseContent() {
  const { id } = useParams();
  const user = useAuthStore((s) => s.user);
  
  // State
  const [course, setCourse] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [moduleIndex, setModuleIndex] = useState(0);
  const [lessonIndex, setLessonIndex] = useState(0);
  const [currentLesson, setCurrentLesson] = useState(null);
  const [lessonLoading, setLessonLoading] = useState(false);
  const [progress, setProgress] = useState({});
  const [isFullscreen, setIsFullscreen] = useState(false);

  const progressKey = user ? `progress_${user.id || user._id}_${id}` : `progress_guest_${id}`;

  // --- EFFECTS ---
  useEffect(() => {
    const fetchCourse = async () => {
      try {
        setLoading(true);
        const res = await courseService.getCourseById(id);
        setCourse(res.data);
        const saved = localStorage.getItem(progressKey);
        if (saved) setProgress(JSON.parse(saved));
      } catch (err) {
        console.error(err);
        setError('Failed to load course content');
      } finally {
        setLoading(false);
      }
    };
    fetchCourse();
  }, [id]);

  useEffect(() => {
    if (course && progress?.last) {
      const { m = 0, l = 0 } = progress.last;
      setModuleIndex(m);
      setLessonIndex(l);
    }
  }, [course]);

  useEffect(() => {
    if (!course) return;
    const fetchLesson = async () => {
      try {
        setLessonLoading(true);
        const res = await courseService.getLesson(id, moduleIndex, lessonIndex);
        setCurrentLesson(res.data.lesson);
      } catch (err) {
        // Fallback to local data if API fails
        const localLesson = course.modules?.[moduleIndex]?.lessons?.[lessonIndex];
        setCurrentLesson(localLesson || null);
      } finally {
        setLessonLoading(false);
      }
    };
    fetchLesson();
  }, [id, moduleIndex, lessonIndex, course]);

  // --- HANDLERS ---
  const saveProgress = (mIdx, lIdx) => {
    const newProgress = {
      last: { m: mIdx, l: lIdx },
      completed: progress.completed || {},
    };
    const key = `m${mIdx}`;
    newProgress.completed[key] = newProgress.completed[key] || [];
    if (!newProgress.completed[key].includes(lIdx)) newProgress.completed[key].push(lIdx);
    setProgress(newProgress);
    localStorage.setItem(progressKey, JSON.stringify(newProgress));
  };

  const onSelectLesson = (mIdx, lIdx) => {
    setModuleIndex(mIdx);
    setLessonIndex(lIdx);
    saveProgress(mIdx, lIdx);
  };

  // --- RENDERERS ---
  const renderPlayerContent = (fullscreen = false) => {
    if (lessonLoading) return <div className="flex h-full items-center justify-center text-gray-500">Loading lesson...</div>;
    if (!currentLesson) return <div className="flex h-full items-center justify-center text-gray-500">Select a lesson to start</div>;

    const rawUrl = currentLesson.videoUrl || currentLesson.videoFile;
    const url = getFileUrl(rawUrl);

    if (!url) return <div className="flex h-full items-center justify-center text-gray-400 bg-gray-100">No video available</div>;

    // YouTube
    if (url.includes('youtube') || url.includes('youtu.be')) {
      let vid = '';
      const ytMatch = url.match(/(?:v=|youtu\.be\/)([A-Za-z0-9_-]{11})/);
      if (ytMatch) vid = ytMatch[1];
      // Only autoplay in fullscreen to prevent annoyance
      const embed = `https://www.youtube.com/embed/${vid}${fullscreen ? '?autoplay=1' : ''}`;
      return (
        <iframe 
          src={embed} 
          title="Video Player" 
          className="w-full h-full object-cover" 
          allowFullScreen 
          allow="autoplay; encrypted-media" 
        />
      );
    }

    // HTML5 Video
    return (
      <video 
        controls 
        autoPlay={fullscreen}
        className="w-full h-full bg-black object-contain" 
        key={url} 
      >
        <source src={url} />
        Your browser does not support video.
      </video>
    );
  };

  if (loading) return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gray-50 gap-4">
      <div className="animate-spin rounded-full h-10 w-10 border-4 border-blue-600 border-t-transparent"></div>
      <p className="text-gray-500 font-medium">Loading Course...</p>
    </div>
  );

  if (error) return <div className="min-h-screen flex items-center justify-center text-red-600 font-medium">{error}</div>;
  if (!course) return null;

  return (
    <div className="min-h-screen bg-gray-50 font-sans text-gray-900">
      
      {/* FULLSCREEN MODAL */}
      {isFullscreen && (
        <div className="fixed inset-0 z-50 bg-black flex flex-col animate-fade-in">
          <div className="flex items-center justify-between px-6 py-4 bg-gray-900 text-white shadow-md z-10">
            <div>
              <h2 className="text-sm text-gray-400 uppercase tracking-wider font-semibold">Now Playing</h2>
              <p className="text-lg font-medium">{currentLesson?.title}</p>
            </div>
            <button 
              onClick={() => setIsFullscreen(false)}
              className="p-2 bg-gray-800 hover:bg-gray-700 rounded-full transition-colors"
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg>
            </button>
          </div>
          <div className="flex-1 relative bg-black">
            {renderPlayerContent(true)}
          </div>
        </div>
      )}

      {/* HEADER BAR */}
      <header className="bg-white border-b border-gray-200 sticky top-0 z-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          <div>
            <h1 className="text-xl font-bold text-gray-900 truncate">{course.title}</h1>
          </div>
          <div className="text-sm text-gray-500 hidden sm:block">
            Module {moduleIndex + 1} / {course.modules?.length}
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          
          {/* LEFT COLUMN: PLAYER & INFO */}
          <div className="lg:col-span-2 space-y-6">
            
            {/* Video Player Card */}
            <div className="bg-black rounded-2xl shadow-xl overflow-hidden aspect-video relative group ring-1 ring-gray-900/5">
              {renderPlayerContent(false)}
              
              {/* Overlay Controls */}
              <div className="absolute top-4 right-4 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                <button
                  onClick={() => setIsFullscreen(true)}
                  className="bg-black/50 hover:bg-black/70 backdrop-blur-sm text-white px-4 py-2 rounded-lg text-sm font-medium flex items-center gap-2 transition"
                >
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 8V4m0 0h4M4 4l5 5m11-1V4m0 0h-4m4 4l-5-5M4 16v4m0 0h4m-4 0l5-5m11 5l-5-5m5 5v-4m0 4h-4" /></svg>
                  Expand
                </button>
              </div>
            </div>

            {/* Lesson Info */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 sm:p-8">
              <div className="flex items-start justify-between gap-4">
                <div>
                  <h2 className="text-2xl font-bold text-gray-900 mb-2">{currentLesson?.title}</h2>
                  <p className="text-gray-600 leading-relaxed text-sm sm:text-base">
                    {currentLesson?.description || "No description provided for this lesson."}
                  </p>
                </div>
              </div>

              {/* Resources (Only shows if PDF exists) */}
              {currentLesson?.pdfFile && (
                <div className="mt-8 pt-6 border-t border-gray-100">
                  <h3 className="text-sm font-semibold text-gray-900 uppercase tracking-wider mb-4">Lesson Resources</h3>
                  <a
                    href={getFileUrl(currentLesson.pdfFile)}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="group flex items-center justify-between p-4 bg-gray-50 hover:bg-blue-50 border border-gray-200 hover:border-blue-200 rounded-lg transition-all duration-200"
                  >
                    <div className="flex items-center gap-4">
                      <div className="h-10 w-10 bg-white border border-gray-200 rounded-lg flex items-center justify-center shadow-sm text-red-500 group-hover:scale-110 transition-transform">
                        <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M4 4a2 2 0 012-2h4.586A2 2 0 0112 2.586L15.414 6A2 2 0 0116 7.414V16a2 2 0 01-2 2H6a2 2 0 01-2-2V4z" clipRule="evenodd" /></svg>
                      </div>
                      <div>
                        <p className="text-sm font-semibold text-gray-900 group-hover:text-blue-700">Download Lecture Notes</p>
                        <p className="text-xs text-gray-500 group-hover:text-blue-500">PDF Document</p>
                      </div>
                    </div>
                    <span className="text-gray-400 group-hover:text-blue-600">
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" /></svg>
                    </span>
                  </a>
                </div>
              )}
            </div>
          </div>

          {/* RIGHT COLUMN: PLAYLIST SIDEBAR */}
          <aside className="lg:col-span-1">
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden sticky top-24">
              <div className="p-4 bg-gray-50 border-b border-gray-200 flex justify-between items-center">
                <h3 className="font-bold text-gray-900">Course Content</h3>
                <span className="text-xs font-semibold px-2 py-1 bg-white border border-gray-200 rounded text-gray-600">
                   {/* Calculate percent if needed, else show total lessons */}
                   {course.modules?.reduce((acc, m) => acc + (m.lessons?.length || 0), 0)} Lessons
                </span>
              </div>
              
              <div className="overflow-y-auto max-h-[calc(100vh-200px)] scrollbar-thin scrollbar-thumb-gray-300 scrollbar-track-transparent">
                {course.modules?.map((module, mIndex) => (
                  <div key={mIndex} className="border-b border-gray-100 last:border-0">
                    {/* Module Header */}
                    <div className="bg-gray-50/50 px-4 py-3">
                      <h4 className="text-sm font-bold text-gray-800">{module.title}</h4>
                      <p className="text-xs text-gray-500 mt-0.5">{module.lessons?.length || 0} lessons</p>
                    </div>

                    {/* Lesson List */}
                    <div className="flex flex-col">
                      {module.lessons?.map((lesson, lIndex) => {
                        const isActive = mIndex === moduleIndex && lIndex === lessonIndex;
                        const isCompleted = progress?.completed?.[`m${mIndex}`]?.includes(lIndex);

                        return (
                          <button
                            key={lIndex}
                            onClick={() => onSelectLesson(mIndex, lIndex)}
                            className={`
                              relative flex items-center justify-between p-4 text-left text-sm transition-all duration-200
                              ${isActive 
                                ? 'bg-blue-50 text-blue-800 font-semibold' 
                                : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
                              }
                            `}
                          >
                            {/* Active Indicator Strip */}
                            {isActive && (
                              <div className="absolute left-0 top-0 bottom-0 w-1 bg-blue-600 rounded-r"></div>
                            )}

                            <div className="flex items-center gap-3 overflow-hidden">
                              {/* Icon: Play or Check */}
                              <div className={`flex-shrink-0 w-5 h-5 flex items-center justify-center rounded-full border ${
                                isCompleted 
                                  ? 'bg-green-100 border-green-200 text-green-600' 
                                  : isActive 
                                    ? 'bg-blue-600 border-blue-600 text-white' 
                                    : 'border-gray-300 text-gray-400'
                              }`}>
                                {isCompleted ? (
                                  <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" /></svg>
                                ) : (
                                  <svg className="w-2.5 h-2.5" fill="currentColor" viewBox="0 0 20 20"><path d="M4 4l12 6-12 6V4z" /></svg>
                                )}
                              </div>
                              
                              <span className="truncate">{lesson.title}</span>
                            </div>

                            {/* Duration or Status (Optional placeholder) */}
                            {/* <span className="text-xs text-gray-400">10m</span> */}
                          </button>
                        );
                      })}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </aside>

        </div>
      </main>
    </div>
  );
}