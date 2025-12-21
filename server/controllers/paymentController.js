const Order = require('../models/Order');
const Course = require('../models/Course');
const User = require('../models/User');

// Mock payment processing utilities
const generatePaymentId = () => {
  const timestamp = Date.now();
  const random = Math.random().toString(36).substr(2, 9).toUpperCase();
  return `MOCK_PAY_${timestamp}_${random}`;
};

const validateCourses = async (courseIds) => {
  if (!courseIds || courseIds.length === 0) {
    return { valid: false, error: 'No courses provided' };
  }

  const courses = await Course.find({ _id: { $in: courseIds } });
  
  if (courses.length !== courseIds.length) {
    return { valid: false, error: 'Some courses not found' };
  }

  // Check if any course has invalid price
  const invalidCourse = courses.find(c => c.price < 0);
  if (invalidCourse) {
    return { valid: false, error: `Invalid price for course: ${invalidCourse.title}` };
  }

  return { valid: true, courses };
};

const simulatePaymentProcessing = async () => {
  // Simulate realistic payment processing delay (1-3 seconds)
  const delay = Math.floor(Math.random() * 2000) + 1000;
  await new Promise(resolve => setTimeout(resolve, delay));
  
  // Simulate occasional payment failures (5% chance)
  if (Math.random() < 0.05) {
    throw new Error('Payment processing failed. Please try again.');
  }
};

exports.createCheckoutSession = async (req, res) => {
  try {
    const { courses } = req.body;

    // Validate user
    if (!req.userId) {
      return res.status(401).json({ success: false, message: 'Unauthorized' });
    }

    // Validate and fetch courses
    const validation = await validateCourses(courses);
    if (!validation.valid) {
      return res.status(400).json({ success: false, message: validation.error });
    }

    const courseDetails = validation.courses;
    
    // Check if user already enrolled in any course
    const user = await User.findById(req.userId);
    const alreadyEnrolled = courseDetails.filter(course => 
      user.enrolledCourses.includes(course._id)
    );

    if (alreadyEnrolled.length > 0) {
      return res.status(400).json({
        success: false,
        message: `Already enrolled in: ${alreadyEnrolled.map(c => c.title).join(', ')}`
      });
    }

    // Calculate totals with tax
    const subtotal = courseDetails.reduce((sum, course) => sum + course.price, 0);
    const taxRate = 0.1; // 10% tax
    const tax = Number((subtotal * taxRate).toFixed(2));
    const totalAmount = Number((subtotal + tax).toFixed(2));

    // Generate mock payment ID
    const paymentId = generatePaymentId();

    console.log(`[Payment] Checkout created for user ${req.userId}:`, {
      paymentId,
      courses: courseDetails.length,
      subtotal,
      tax,
      totalAmount
    });

    res.json({
      success: true,
      paymentId,
      subtotal: subtotal.toFixed(2),
      tax: tax.toFixed(2),
      totalAmount: totalAmount.toFixed(2),
      courses: courseDetails.map((c) => ({
        id: c._id,
        title: c.title,
        price: c.price,
        instructor: c.instructor,
      })),
      message: 'Checkout session created successfully. Review details and confirm payment.'
    });
  } catch (error) {
    console.error('[Payment Error]', error.message);
    res.status(500).json({ success: false, message: error.message || 'Server error' });
  }
};

exports.verifyPayment = async (req, res) => {
  try {
    const { paymentId, courses, cardToken } = req.body;

    // Validate required fields
    if (!paymentId || !courses || courses.length === 0) {
      return res.status(400).json({ success: false, message: 'Invalid payment data' });
    }

    if (!cardToken) {
      return res.status(400).json({ success: false, message: 'Payment method required' });
    }

    // Validate courses again
    const validation = await validateCourses(courses);
    if (!validation.valid) {
      return res.status(400).json({ success: false, message: validation.error });
    }

    const courseDetails = validation.courses;
    const subtotal = courseDetails.reduce((sum, course) => sum + course.price, 0);
    const tax = Number((subtotal * 0.1).toFixed(2));
    const totalAmount = Number((subtotal + tax).toFixed(2));

    // Simulate payment processing
    console.log(`[Payment] Processing payment ${paymentId}...`);
    await simulatePaymentProcessing();

    // Create order
    const order = new Order({
      user: req.userId,
      courses: courseDetails.map((course) => ({
        course: course._id,
        price: course.price,
      })),
      subtotal,
      tax,
      totalAmount,
      paymentStatus: 'completed',
      paymentMethod: 'mock_card',
      stripePaymentId: paymentId,
      cardToken: cardToken.substring(0, 4) + '****', // Store masked card for records
      transactionDate: new Date(),
    });

    await order.save();

    // Enroll user in courses
    const user = await User.findById(req.userId);
    const enrolledCourses = [];

    for (let courseId of courses) {
      if (!user.enrolledCourses.includes(courseId)) {
        user.enrolledCourses.push(courseId);
        enrolledCourses.push(courseId);
      }

      const course = await Course.findById(courseId);
      if (!course.studentsEnrolled.includes(req.userId)) {
        course.studentsEnrolled.push(req.userId);
        await course.save();
      }
    }
    await user.save();

    console.log(`[Payment] Success! Order ${order._id} created for user ${req.userId}`);

    res.json({
      message: `Payment successful! You have been enrolled in ${enrolledCourses.length} course(s).`,
      order: {
        id: order._id,
        paymentId: paymentId,
        totalAmount: order.totalAmount,
        courses: courseDetails.map(c => c.title),
        transactionDate: order.transactionDate,
        status: 'completed'
      },
      success: true,
    });
  } catch (error) {
    console.error('[Payment Error]', error.message);
    res.status(500).json({ 
      success: false, 
      message: error.message || 'Payment processing failed. Please try again.' 
    });
  }
};

exports.getOrders = async (req, res) => {
  try {
    const orders = await Order.find({ user: req.userId })
      .populate('courses.course', 'title price image')
      .sort({ transactionDate: -1 });

    const formattedOrders = orders.map(order => ({
      id: order._id,
      totalAmount: order.totalAmount,
      subtotal: order.subtotal || order.totalAmount,
      tax: order.tax || 0,
      paymentStatus: order.paymentStatus,
      paymentMethod: order.paymentMethod,
      transactionDate: order.transactionDate || order.createdAt,
      courses: order.courses.map(c => ({
        title: c.course?.title || 'Course',
        price: c.price,
        image: c.course?.image
      })),
      stripePaymentId: order.stripePaymentId,
      refunded: order.refunded || false
    }));

    res.json({
      success: true,
      orders: formattedOrders,
      total: formattedOrders.length
    });
  } catch (error) {
    console.error('[Payment Error]', error.message);
    res.status(500).json({ success: false, message: 'Failed to fetch orders' });
  }
};

exports.getOrderDetails = async (req, res) => {
  try {
    const { orderId } = req.params;

    const order = await Order.findOne({ _id: orderId, user: req.userId })
      .populate('courses.course', 'title price image description');

    if (!order) {
      return res.status(404).json({ success: false, message: 'Order not found' });
    }

    res.json({
      success: true,
      order: {
        id: order._id,
        totalAmount: order.totalAmount,
        subtotal: order.subtotal || order.totalAmount,
        tax: order.tax || 0,
        paymentStatus: order.paymentStatus,
        paymentMethod: order.paymentMethod,
        transactionDate: order.transactionDate || order.createdAt,
        courses: order.courses.map(c => ({
          id: c.course?._id,
          title: c.course?.title || 'Course',
          price: c.price,
          image: c.course?.image,
          description: c.course?.description
        })),
        stripePaymentId: order.stripePaymentId,
        refunded: order.refunded || false
      }
    });
  } catch (error) {
    console.error('[Payment Error]', error.message);
    res.status(500).json({ success: false, message: 'Failed to fetch order details' });
  }
};

exports.refundPayment = async (req, res) => {
  try {
    const { orderId, reason } = req.body;

    if (!orderId || !reason) {
      return res.status(400).json({ success: false, message: 'Order ID and reason required' });
    }

    const order = await Order.findOne({ _id: orderId, user: req.userId });

    if (!order) {
      return res.status(404).json({ success: false, message: 'Order not found' });
    }

    if (order.refunded) {
      return res.status(400).json({ success: false, message: 'Order already refunded' });
    }

    if (order.paymentStatus !== 'completed') {
      return res.status(400).json({ success: false, message: 'Cannot refund incomplete payment' });
    }

    // Check refund eligibility (within 30 days)
    const daysSincePurchase = Math.floor((Date.now() - order.transactionDate) / (1000 * 60 * 60 * 24));
    if (daysSincePurchase > 30) {
      return res.status(400).json({ 
        success: false, 
        message: 'Refund period expired (30 days maximum)' 
      });
    }

    // Simulate refund processing
    console.log(`[Refund] Processing refund for order ${orderId}...`);
    await new Promise(resolve => setTimeout(resolve, 1500));

    // Simulate occasional refund failures (2% chance)
    if (Math.random() < 0.02) {
      throw new Error('Refund processing failed. Please try again later.');
    }

    // Update order
    order.refunded = true;
    order.paymentStatus = 'refunded';
    order.refundReason = reason;
    order.refundDate = new Date();
    await order.save();

    // Unenroll user from courses
    const user = await User.findById(req.userId);
    for (let courseId of order.courses.map(c => c.course)) {
      user.enrolledCourses = user.enrolledCourses.filter(id => !id.equals(courseId));

      const course = await Course.findById(courseId);
      course.studentsEnrolled = course.studentsEnrolled.filter(id => !id.equals(req.userId));
      await course.save();
    }
    await user.save();

    console.log(`[Refund] Success! Order ${orderId} refunded. Amount: $${order.totalAmount}`);

    res.json({
      success: true,
      message: `Refund of $${order.totalAmount} processed successfully. You have been unenrolled from the courses.`,
      refundDetails: {
        orderId: order._id,
        amount: order.totalAmount,
        reason,
        refundDate: order.refundDate,
        status: 'completed'
      }
    });
  } catch (error) {
    console.error('[Refund Error]', error.message);
    res.status(500).json({ 
      success: false, 
      message: error.message || 'Refund processing failed' 
    });
  }
};

exports.getPaymentHistory = async (req, res) => {
  try {
    const { filter = 'all', page = 1, limit = 10 } = req.query;

    const skip = (page - 1) * limit;
    let query = { user: req.userId };

    if (filter === 'completed') {
      query.paymentStatus = 'completed';
    } else if (filter === 'refunded') {
      query.refunded = true;
    }

    const orders = await Order.find(query)
      .populate('courses.course', 'title price')
      .sort({ transactionDate: -1 })
      .skip(skip)
      .limit(parseInt(limit));

    const total = await Order.countDocuments(query);

    const stats = {
      totalSpent: 0,
      totalRefunded: 0,
      coursesEnrolled: 0
    };

    orders.forEach(order => {
      if (order.paymentStatus === 'completed' && !order.refunded) {
        stats.totalSpent += order.totalAmount;
        stats.coursesEnrolled += order.courses.length;
      } else if (order.refunded) {
        stats.totalRefunded += order.totalAmount;
      }
    });

    res.json({
      success: true,
      history: orders.map(order => ({
        id: order._id,
        totalAmount: order.totalAmount,
        paymentStatus: order.paymentStatus,
        transactionDate: order.transactionDate || order.createdAt,
        courseCount: order.courses.length,
        refunded: order.refunded || false
      })),
      pagination: {
        page: parseInt(page),
        limit: parseInt(limit),
        total,
        pages: Math.ceil(total / limit)
      },
      stats
    });
  } catch (error) {
    console.error('[Payment Error]', error.message);
    res.status(500).json({ success: false, message: 'Failed to fetch payment history' });
  }
};
