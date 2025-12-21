import { ShoppingCart, Star, Users, Clock, BookOpen } from 'lucide-react';

export default function CourseCard({ course, onAddToCart }) {
  return (
    <div className="group flex flex-col bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden hover:shadow-xl transition-all duration-300 hover:-translate-y-1 h-full">
      {/* Image Container */}
      <div className="relative aspect-video overflow-hidden bg-gray-100">
        {course.image ? (
          <img 
            src={course.image} 
            alt={course.title} 
            className="w-full h-full object-cover transform group-hover:scale-110 transition-transform duration-500" 
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-blue-500 to-indigo-600">
            <BookOpen className="text-white/50 w-16 h-16" />
          </div>
        )}
        
        {/* Category Badge */}
        {course.category && (
          <div className="absolute top-3 left-3">
            <span className="px-3 py-1 bg-white/90 backdrop-blur-md text-blue-700 text-xs font-bold rounded-full shadow-sm uppercase tracking-wide">
              {course.category}
            </span>
          </div>
        )}
      </div>

      {/* Content */}
      <div className="flex flex-col flex-1 p-5">
        <div className="flex items-center justify-between mb-3">
          <span className={`text-xs font-semibold px-2.5 py-0.5 rounded-full ${
            course.level === 'Beginner' ? 'bg-green-100 text-green-700' :
            course.level === 'Intermediate' ? 'bg-yellow-100 text-yellow-700' :
            'bg-red-100 text-red-700'
          }`}>
            {course.level}
          </span>
          
          {course.rating > 0 && (
            <div className="flex items-center gap-1 text-amber-500 font-bold text-sm">
              <Star size={14} className="fill-current" />
              <span>{course.rating.toFixed(1)}</span>
            </div>
          )}
        </div>

        <h3 className="text-lg font-bold text-gray-900 mb-2 line-clamp-2 group-hover:text-blue-600 transition-colors">
          {course.title}
        </h3>

        <p className="text-gray-500 text-sm mb-4 line-clamp-2 flex-1">
          {course.description}
        </p>

        <div className="flex items-center gap-4 text-xs text-gray-500 mb-4 border-b border-gray-50 pb-4">
          <div className="flex items-center gap-1.5">
            <Users size={14} />
            <span>{course.studentsEnrolled?.length || 0} students</span>
          </div>
          {course.duration && (
             <div className="flex items-center gap-1.5">
               <Clock size={14} />
               <span>{course.duration}h</span>
             </div>
          )}
        </div>

        <div className="flex items-center justify-between mt-auto pt-1">
          <div className="flex flex-col">
            <span className="text-xs text-gray-400 font-medium">Price</span>
            <span className="text-2xl font-bold text-gray-900">${course.price}</span>
          </div>
          
          <button
            onClick={() => onAddToCart(course)}
            className="bg-blue-600 hover:bg-blue-700 text-white px-5 py-2.5 rounded-xl font-medium transition-all active:scale-95 shadow-blue-200 hover:shadow-lg hover:shadow-blue-200 flex items-center gap-2"
          >
            <ShoppingCart size={18} />
            <span>Add</span>
          </button>
        </div>
      </div>
    </div>
  );
}
