const express = require('express');
const paymentController = require('../controllers/paymentController');
const auth = require('../middleware/auth');

const router = express.Router();

// Checkout and payment processing
router.post('/checkout', auth, paymentController.createCheckoutSession);
router.post('/verify', auth, paymentController.verifyPayment);

// Order management
router.get('/orders', auth, paymentController.getOrders);
router.get('/orders/:orderId', auth, paymentController.getOrderDetails);
router.post('/refund', auth, paymentController.refundPayment);

// Payment history
router.get('/history', auth, paymentController.getPaymentHistory);

module.exports = router;
