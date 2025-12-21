import api from './api';

export const authService = {
  signup: (data) => api.post('/auth/signup', data),
  login: (data) => api.post('/auth/login', data),
  getProfile: () => api.get('/auth/profile'),
};

export const courseService = {
  getAllCourses: (filters) => api.get('/courses', { params: filters }),
  getCourseById: (id) => api.get(`/courses/${id}`),
  getEnrolledCourses: () => api.get('/courses/enrolled/list'),
  getLesson: (courseId, moduleIndex, lessonIndex) => api.get(`/courses/${courseId}/lesson/${moduleIndex}/${lessonIndex}`),
  createCourse: (data) => api.post('/courses', data),
  updateCourse: (id, data) => api.put(`/courses/${id}`, data),
  deleteCourse: (id) => api.delete(`/courses/${id}`),
  enrollCourse: (courseId) => api.post(`/courses/${courseId}/enroll`),
};

export const paymentService = {
  createCheckoutSession: (courses) => api.post('/payments/checkout', { courses }),
  verifyPayment: (paymentId, courses, cardToken) => api.post('/payments/verify', { paymentId, courses, cardToken }),
  getOrders: () => api.get('/payments/orders'),
  getOrderDetails: (orderId) => api.get(`/payments/orders/${orderId}`),
  refundPayment: (orderId, reason) => api.post('/payments/refund', { orderId, reason }),
  getPaymentHistory: (filter, page, limit) => api.get('/payments/history', { params: { filter, page, limit } }),
};
