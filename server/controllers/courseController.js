const Course = require('../models/Course');
const User = require('../models/User');

exports.getAllCourses = async (req, res) => {
  try {
    const { category, level, search } = req.query;
    let filter = {};

    if (category) filter.category = category;
    if (level) filter.level = level;
    if (search) {
      filter.$or = [
        { title: { $regex: search, $options: 'i' } },
        { description: { $regex: search, $options: 'i' } },
      ];
    }

    const courses = await Course.find(filter)
      .populate('instructor', 'name email')
      .select('-modules');

    res.json(courses);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
};

exports.getCourseById = async (req, res) => {
  try {
    const course = await Course.findById(req.params.id)
      .populate('instructor', 'name email bio')
      .populate('studentsEnrolled', 'name');

    if (!course) {
      return res.status(404).json({ message: 'Course not found' });
    }

    res.json(course);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
};

exports.createCourse = async (req, res) => {
  try {
    // Extract basic fields
    let title = req.body.title;
    let description = req.body.description;
    let price = req.body.price;
    let category = req.body.category;
    let level = req.body.level || 'Beginner';
    let duration = req.body.duration;
    let image = req.body.image;

    // Debug logging
    console.log('[Course] createCourse called');
    console.log('[Course] Body fields:', { title, description, price, category, level, duration });
    console.log('[Course] Request body keys:', Object.keys(req.body));

    if (!title || !description || !price || !category || !duration) {
      console.log('[Course] Missing required fields');
      return res.status(400).json({ message: 'Please provide all required fields' });
    }

    // Reconstruct modules from FormData format
    let processedModules = [];
    
    // Try to parse modules from body
    let modules = req.body.modules;
    
    if (modules) {
      // If modules is a string, parse it
      if (typeof modules === 'string') {
        try {
          processedModules = JSON.parse(modules);
        } catch (e) {
          console.log('[Course] Could not parse modules as JSON');
          processedModules = [];
        }
      } else if (Array.isArray(modules)) {
        processedModules = modules;
      } else if (typeof modules === 'object') {
        // Convert object to array
        processedModules = Object.values(modules);
      }
    }

    console.log('[Course] Processed modules count:', processedModules.length);
    console.log('[Course] Modules structure:', JSON.stringify(processedModules, null, 2).substring(0, 500));

    // Handle file uploads if files are present in request
    if (req.files && req.files.length > 0) {
      console.log('[Course] Processing files, count:', req.files.length);
      processedModules = processedModules.map((module, mIdx) => {
        return {
          ...module,
          lessons: (module.lessons || []).map((lesson, lIdx) => {
            const videoFile = req.files.find(
              (f) => f.fieldname === `modules[${mIdx}][lessons][${lIdx}][videoFile]`
            );
            const pdfFile = req.files.find(
              (f) => f.fieldname === `modules[${mIdx}][lessons][${lIdx}][pdfFile]`
            );

            return {
              ...lesson,
              videoFile: videoFile ? `/uploads/videos/${videoFile.filename}` : lesson.videoFile,
              pdfFile: pdfFile ? `/uploads/pdfs/${pdfFile.filename}` : lesson.pdfFile,
            };
          }),
        };
      });
    }

    const course = new Course({
      title,
      description,
      price: parseFloat(price),
      category,
      level: level || 'Beginner',
      duration: parseInt(duration),
      image,
      modules: processedModules,
      instructor: req.userId,
    });

    await course.save();

    console.log('[Course] Course created successfully:', course._id);
    res.status(201).json({
      message: 'Course created successfully',
      course,
    });
  } catch (error) {
    console.error('[Course] Error in createCourse:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

exports.updateCourse = async (req, res) => {
  try {
    let course = await Course.findById(req.params.id);

    if (!course) {
      return res.status(404).json({ message: 'Course not found' });
    }

    if (course.instructor.toString() !== req.userId) {
      return res.status(403).json({ message: 'Not authorized to update this course' });
    }

    const { title, description, price, category, level, duration, image, modules } = req.body;

    // Process modules with file uploads
    let processedModules = modules || course.modules;
    
    if (typeof processedModules === 'string') {
      processedModules = JSON.parse(processedModules);
    }

    // Handle file uploads if files are present in request
    if (req.files && req.files.length > 0) {
      processedModules = processedModules.map((module, mIdx) => {
        return {
          ...module,
          lessons: (module.lessons || []).map((lesson, lIdx) => {
            const videoFile = req.files.find(
              (f) => f.fieldname === `modules[${mIdx}][lessons][${lIdx}][videoFile]`
            );
            const pdfFile = req.files.find(
              (f) => f.fieldname === `modules[${mIdx}][lessons][${lIdx}][pdfFile]`
            );

            return {
              ...lesson,
              videoFile: videoFile ? `/uploads/videos/${videoFile.filename}` : lesson.videoFile,
              pdfFile: pdfFile ? `/uploads/pdfs/${pdfFile.filename}` : lesson.pdfFile,
            };
          }),
        };
      });
    }

    const updateData = {
      ...(title && { title }),
      ...(description && { description }),
      ...(price && { price }),
      ...(category && { category }),
      ...(level && { level }),
      ...(duration && { duration }),
      ...(image && { image }),
      ...(processedModules && { modules: processedModules }),
    };

    course = await Course.findByIdAndUpdate(req.params.id, updateData, {
      new: true,
    });

    res.json({ message: 'Course updated successfully', course });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
};

exports.deleteCourse = async (req, res) => {
  try {
    const course = await Course.findById(req.params.id);

    if (!course) {
      return res.status(404).json({ message: 'Course not found' });
    }

    if (course.instructor.toString() !== req.userId) {
      return res.status(403).json({ message: 'Not authorized to delete this course' });
    }

    await Course.findByIdAndDelete(req.params.id);

    res.json({ message: 'Course deleted successfully' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
};

exports.enrollCourse = async (req, res) => {
  try {
    const course = await Course.findById(req.params.courseId);

    if (!course) {
      return res.status(404).json({ message: 'Course not found' });
    }

    if (course.studentsEnrolled.includes(req.userId)) {
      return res.status(400).json({ message: 'Already enrolled in this course' });
    }

    course.studentsEnrolled.push(req.userId);
    await course.save();

    const user = await User.findById(req.userId);
    user.enrolledCourses.push(req.params.courseId);
    await user.save();

    res.json({ message: 'Enrolled successfully', course });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
};

exports.getEnrolledCourses = async (req, res) => {
  try {
    console.log('[Course] getEnrolledCourses called for user:', req.userId);
    
    const user = await User.findById(req.userId);
    
    if (!user) {
      console.log('[Course] User not found');
      return res.status(404).json({ message: 'User not found' });
    }

    console.log('[Course] User enrolled courses:', user?.enrolledCourses);

    if (!user.enrolledCourses || user.enrolledCourses.length === 0) {
      console.log('[Course] User has no enrolled courses');
      return res.json([]);
    }

    // Fetch course details with instructor info
    const enrolledCourses = await Course.find({ _id: { $in: user.enrolledCourses } })
      .populate('instructor', 'name email bio')
      .exec();

    console.log('[Course] Found enrolled courses:', enrolledCourses.length);
    res.json(enrolledCourses);
  } catch (error) {
    console.error('[Course] Error in getEnrolledCourses:', error);
    res.status(500).json({ message: 'Server error' });
  }
};
exports.getLesson = async (req, res) => {
  try {
    console.log('[Course] getLesson called with params:', req.params);
    const { id: courseId, moduleIndex, lessonIndex } = req.params;
    
    console.log('[Course] courseId:', courseId, 'moduleIndex:', moduleIndex, 'lessonIndex:', lessonIndex);

    const course = await Course.findById(courseId);

    if (!course) {
      console.log('[Course] Course not found:', courseId);
      return res.status(404).json({ message: 'Course not found' });
    }

    console.log('[Course] Found course, modules count:', course.modules?.length);

    if (!course.modules || !course.modules[moduleIndex]) {
      console.log('[Course] Module not found at index:', moduleIndex);
      return res.status(404).json({ message: 'Module not found' });
    }

    const module = course.modules[moduleIndex];
    if (!module.lessons || !module.lessons[lessonIndex]) {
      console.log('[Course] Lesson not found at index:', lessonIndex, 'in module', moduleIndex);
      return res.status(404).json({ message: 'Lesson not found' });
    }

    const lesson = module.lessons[lessonIndex];

    console.log(`[Course] Fetched lesson: ${lesson.title} from course ${course.title}`);

    res.json({
      courseId,
      moduleName: module.title,
      moduleIndex: parseInt(moduleIndex),
      lessonIndex: parseInt(lessonIndex),
      lesson,
    });
  } catch (error) {
    console.error('[Course] Error in getLesson:', error);
    res.status(500).json({ message: 'Server error' });
  }
};