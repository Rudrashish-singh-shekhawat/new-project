const express = require('express');
const courseController = require('../controllers/courseController');
const auth = require('../middleware/auth');
const { uploadMiddleware } = require('../middleware/upload');

const router = express.Router();

// Add logging middleware
router.use((req, res, next) => {
  console.log('[Routes] Course route hit:', req.method, req.path, 'params:', req.params);
  next();
});

// Specific routes first (before /:id)
router.get('/enrolled/list', auth, courseController.getEnrolledCourses);

// General routes
router.get('/', courseController.getAllCourses);

// Lesson route - use regex to match ObjectId pattern to avoid conflict with /:id
router.get('/:id([0-9a-fA-F]{24})/lesson/:moduleIndex/:lessonIndex', courseController.getLesson);

// Generic :id route (catch-all for single course)
router.get('/:id', courseController.getCourseById);
router.post('/', auth, uploadMiddleware.any(), courseController.createCourse);
router.put('/:id', auth, uploadMiddleware.any(), courseController.updateCourse);
router.delete('/:id', auth, courseController.deleteCourse);
router.post('/:courseId/enroll', auth, courseController.enrollCourse);

module.exports = router;
