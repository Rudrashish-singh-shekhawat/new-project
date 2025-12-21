import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useCartStore, useAuthStore } from '../store';
import { paymentService, authService } from '../services/apiServices';
import { CreditCard, CheckCircle, ShieldCheck, User, Calendar, Lock, ArrowLeft, ShoppingBag } from 'lucide-react';

export default function Checkout() {
  const items = useCartStore((state) => state.items);
  const getTotalPrice = useCartStore((state) => state.getTotalPrice);
  const clearCart = useCartStore((state) => state.clearCart);
  const updateUser = useAuthStore((state) => state.updateUser);
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);
  const [cardData, setCardData] = useState({
    cardName: '',
    cardNumber: '',
    expiry: '',
    cvc: '',
  });

  if (items.length === 0) {
    navigate('/cart');
    return null;
  }

  const subtotal = getTotalPrice();
  const taxRate = 0.1; // 10% tax
  const tax = Number((subtotal * taxRate).toFixed(2));
  const total = Number((subtotal + tax).toFixed(2));

  const handleCardChange = (e) => {
    const { name, value } = e.target;
    setCardData({
      ...cardData,
      [name]: value,
    });
  };

  const handleCheckout = async () => {
    try {
      // Validate card data
      if (!cardData.cardName || !cardData.cardNumber || !cardData.expiry || !cardData.cvc) {
        setError('Please fill in all card details');
        return;
      }

      // Validate card number format (simple check)
      const cardNum = cardData.cardNumber.replace(/\s/g, '');
      if (cardNum.length < 13 || cardNum.length > 19) {
        setError('Invalid card number');
        return;
      }

      // Validate CVC
      if (cardData.cvc.length < 3 || cardData.cvc.length > 4) {
        setError('Invalid CVC');
        return;
      }

      setLoading(true);
      setError('');

      // Create checkout session
      const sessionResponse = await paymentService.createCheckoutSession(
        items.map((item) => item._id)
      );

      if (!sessionResponse.data.success) {
        setError(sessionResponse.data.message || 'Failed to create checkout session');
        setLoading(false);
        return;
      }

      // Verify payment with mock system
      const verifyResponse = await paymentService.verifyPayment(
        sessionResponse.data.paymentId,
        items.map((item) => item._id),
        cardData.cardNumber
      );

      if (verifyResponse.data.success) {
        // Refresh user profile to get updated enrolled courses
        try {
          const profileResponse = await authService.getProfile();
          const profileUser = profileResponse.data?.user ?? profileResponse.data;
              if (profileUser) {
                updateUser(profileUser);
              }
        } catch (profileError) {
          console.error('Failed to refresh profile:', profileError);
          // Still clear cart and navigate even if profile refresh fails
        }
        
        clearCart();
        setSuccess(true);
        
        // Redirect to my courses after 2 seconds
        setTimeout(() => {
          navigate('/my-courses');
        }, 2000);
      } else {
        setError(verifyResponse.data.message || 'Payment failed. Please try again.');
      }
    } catch (err) {
      console.error('Payment error:', err);
      setError(err.response?.data?.message || err.message || 'Payment failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-8">
          <button
            onClick={() => navigate('/cart')}
            className="flex items-center text-gray-600 hover:text-blue-600 transition-colors mb-4"
          >
            <ArrowLeft size={20} className="mr-2" /> Back to Cart
          </button>
          <h1 className="text-3xl font-bold text-gray-900">Checkout</h1>
          <p className="text-gray-500 mt-1">Complete your purchase securely.</p>
        </div>

        {success ? (
          <div className="max-w-md mx-auto bg-white rounded-2xl shadow-xl p-8 text-center">
            <div className="flex justify-center mb-6">
              <div className="bg-green-100 p-4 rounded-full">
                <CheckCircle className="text-green-600" size={48} />
              </div>
            </div>
            <h2 className="text-2xl font-bold text-gray-900 mb-2">Payment Successful!</h2>
            <p className="text-gray-600 mb-6">
              You have been enrolled in the courses. Redirecting you to your dashboard...
            </p>
            <div className="w-full bg-gray-200 rounded-full h-2">
              <div className="bg-green-500 h-2 rounded-full animate-pulse w-full"></div>
            </div>
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12">
            {/* Left Column: Payment Details */}
            <div className="lg:col-span-7 space-y-6">
              {error && (
                <div className="bg-red-50 border-l-4 border-red-500 p-4 rounded-r-lg">
                  <div className="flex">
                    <div className="ml-3">
                      <p className="text-sm text-red-700">{error}</p>
                    </div>
                  </div>
                </div>
              )}

              <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
                <div className="p-6 border-b border-gray-100 bg-gray-50/50">
                  <h2 className="text-lg font-semibold text-gray-900 flex items-center gap-2">
                    <CreditCard className="text-blue-600" size={20} />
                    Payment Details
                  </h2>
                </div>

                <div className="p-6 space-y-6">
                  {/* Card Name */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Cardholder Name</label>
                    <div className="relative">
                      <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                        <User className="text-gray-400" size={18} />
                      </div>
                      <input
                        type="text"
                        name="cardName"
                        value={cardData.cardName}
                        onChange={handleCardChange}
                        placeholder="John Doe"
                        className="w-full pl-10 pr-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all outline-none"
                      />
                    </div>
                  </div>

                  {/* Card Number */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Card Number</label>
                    <div className="relative">
                      <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                        <CreditCard className="text-gray-400" size={18} />
                      </div>
                      <input
                        type="text"
                        name="cardNumber"
                        value={cardData.cardNumber}
                        onChange={handleCardChange}
                        placeholder="0000 0000 0000 0000"
                        maxLength="19"
                        className="w-full pl-10 pr-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all outline-none"
                      />
                    </div>
                  </div>

                  {/* Expiry & CVC */}
                  <div className="grid grid-cols-2 gap-6">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Expiry Date</label>
                      <div className="relative">
                        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                          <Calendar className="text-gray-400" size={18} />
                        </div>
                        <input
                          type="text"
                          name="expiry"
                          value={cardData.expiry}
                          onChange={handleCardChange}
                          placeholder="MM/YY"
                          maxLength="5"
                          className="w-full pl-10 pr-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all outline-none"
                        />
                      </div>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">CVC / CWW</label>
                      <div className="relative">
                        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                          <Lock className="text-gray-400" size={18} />
                        </div>
                        <input
                          type="text"
                          name="cvc"
                          value={cardData.cvc}
                          onChange={handleCardChange}
                          placeholder="123"
                          maxLength="4"
                          className="w-full pl-10 pr-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all outline-none"
                        />
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              <div className="bg-blue-50 border border-blue-100 rounded-xl p-4 flex items-start gap-3">
                <ShieldCheck className="text-blue-600 flex-shrink-0 mt-0.5" size={20} />
                <div>
                  <h4 className="text-sm font-semibold text-blue-900">Secure Mock Payment</h4>
                  <p className="text-sm text-blue-700 mt-1">
                    This is a demonstration environment. No real money will be charged. You can use any
                    valid-looking card data.
                  </p>
                </div>
              </div>
            </div>

            {/* Right Column: Order Summary */}
            <div className="lg:col-span-5">
              <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 lg:sticky lg:top-8">
                <h2 className="text-lg font-semibold text-gray-900 mb-6 flex items-center gap-2">
                  <ShoppingBag className="text-blue-600" size={20} />
                  Order Summary
                </h2>

                <div className="space-y-4 mb-6 max-h-80 overflow-y-auto pr-2 custom-scrollbar">
                  {items.map((item) => (
                    <div key={item._id} className="flex gap-4 py-3 border-b border-gray-50 last:border-0">
                      <div className="h-16 w-16 bg-gray-100 rounded-lg flex items-center justify-center flex-shrink-0">
                        <ShoppingBag className="text-gray-400" size={24} />
                      </div>
                      <div className="flex-1">
                        <h3 className="text-sm font-medium text-gray-900 line-clamp-2">{item.title}</h3>
                        <p className="text-xs text-gray-500 mt-1">{item.category}</p>
                      </div>
                      <span className="text-sm font-semibold text-gray-900">${item.price}</span>
                    </div>
                  ))}
                </div>

                <div className="space-y-3 pt-4 border-t border-gray-100">
                  <div className="flex justify-between text-gray-600">
                    <span>Subtotal</span>
                    <span>${subtotal.toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between text-gray-600">
                    <span>Tax (10%)</span>
                    <span>${tax.toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between items-center pt-4 border-t border-gray-100">
                    <span className="text-lg font-bold text-gray-900">Total</span>
                    <span className="text-2xl font-bold text-blue-600">${total.toFixed(2)}</span>
                  </div>
                </div>

                <button
                  onClick={handleCheckout}
                  disabled={loading}
                  className="w-full mt-8 bg-blue-600 hover:bg-blue-700 disabled:bg-blue-400 text-white font-semibold py-4 rounded-xl shadow-lg shadow-blue-600/20 transition-all transform active:scale-[0.98] flex items-center justify-center gap-2"
                >
                  {loading ? (
                    'Processing...'
                  ) : (
                    <>
                      Pay ${total.toFixed(2)} <ShieldCheck size={18} />
                    </>
                  )}
                </button>

                <p className="text-xs text-center text-gray-400 mt-4 flex items-center justify-center gap-1">
                  <Lock size={12} /> Payments are secure and encrypted
                </p>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
