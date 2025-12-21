import { useCartStore } from '../store';
import { useNavigate } from 'react-router-dom';
import { Trash2, ShoppingCart, ArrowRight, CreditCard, ShieldCheck, BookOpen, Tag, Home, ChevronRight, Check, Star } from 'lucide-react';

export default function Cart() {
  const { items, removeFromCart, getTotalPrice, clearCart } = useCartStore();
  const navigate = useNavigate();

  const handleCheckout = () => {
    navigate('/checkout');
  };

  if (items.length === 0) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center py-12">
            <div className="bg-blue-50 rounded-full h-24 w-24 flex items-center justify-center mx-auto mb-6">
              <ShoppingCart className="h-12 w-12 text-blue-600" />
            </div>
            <h2 className="text-3xl font-bold text-gray-900 mb-3">Your cart is empty</h2>
            <p className="text-gray-500 text-lg mb-8 max-w-md mx-auto">Looks like you haven't added any courses yet. Start exploring our catalog to find your next learning journey!</p>
            <button
              onClick={() => navigate('/')}
              className="inline-flex items-center bg-blue-600 hover:bg-blue-700 text-white px-8 py-4 rounded-xl font-semibold transition-all hover:shadow-lg hover:-translate-y-0.5"
            >
              Start Shopping <ArrowRight className="ml-2 h-5 w-5" />
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Breadcrumb */}
        <nav className="flex mb-8 text-sm text-gray-500">
          <ol className="flex items-center space-x-2">
            <li><button onClick={() => navigate('/')} className="hover:text-blue-600 transition-colors"><Home size={18} /></button></li>
            <li><ChevronRight size={16} className="text-gray-400" /></li>
            <li className="font-medium text-gray-900">Shopping Cart</li>
          </ol>
        </nav>

        <div className="flex items-center justify-between mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Shopping Cart <span className="text-gray-400 text-xl font-normal ml-2">({items.length} items)</span></h1>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Cart Items */}
          <div className="lg:col-span-2 space-y-4">
            {items.map((item) => (
              <div
                key={item._id}
                className="group bg-white rounded-xl shadow-sm border border-gray-100 p-6 flex flex-col sm:flex-row items-start sm:items-center gap-6 transition-all hover:shadow-md"
              >
                <div className="h-20 w-20 rounded-lg bg-blue-50 flex items-center justify-center flex-shrink-0 border border-blue-100">
                  <BookOpen className="h-8 w-8 text-blue-500" />
                </div>

                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-2">
                    <span className="px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-50 text-blue-700 uppercase tracking-wide">
                      {item.category}
                    </span>
                  </div>
                  <h3 className="text-xl font-bold text-gray-900 group-hover:text-blue-600 transition-colors mb-1">{item.title}</h3>
                  
                  <div className="flex items-center gap-4 mt-2 mb-3">
                    <div className="flex items-center gap-1 text-sm text-gray-500">
                      <Check size={14} className="text-green-500" />
                      <span>Lifetime Access</span>
                    </div>
                    <div className="flex items-center gap-1 text-sm text-amber-600 bg-amber-50 px-2 py-0.5 rounded text-xs font-medium border border-amber-100">
                      <Star size={10} className="fill-current" /> Bestseller
                    </div>
                  </div>
                  <p className="text-2xl font-bold text-gray-900">${item.price}</p>
                </div>

                <button
                  onClick={() => removeFromCart(item._id)}
                  className="p-2 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-all"
                  title="Remove item"
                >
                  <Trash2 size={20} />
                </button>
              </div>
            ))}
          </div>

          {/* Order Summary */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-8 h-fit lg:sticky lg:top-8">
            <h2 className="text-xl font-bold text-gray-900 mb-6">Order Summary</h2>

            <div className="space-y-3 mb-6 pb-6 border-b border-gray-100">
              <div className="flex justify-between text-gray-600">
                <span>Subtotal</span>
                <span className="font-medium">${getTotalPrice().toFixed(2)}</span>
              </div>
              <div className="flex justify-between text-gray-600">
                <span>Tax</span>
                <span className="font-medium">$0.00</span>
              </div>
            </div>

            <div className="mb-6">
              <div className="relative">
                <input type="text" placeholder="Promo Code" className="w-full bg-gray-50 border border-gray-200 rounded-lg pl-10 pr-20 py-3 text-sm focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition-all" />
                <Tag className="absolute left-3 top-3.5 h-4 w-4 text-gray-400" />
                <button className="absolute right-2 top-2 bottom-2 px-4 bg-white border border-gray-200 hover:bg-gray-50 text-gray-600 text-xs font-bold rounded-md transition-all shadow-sm">
                  APPLY
                </button>
              </div>
            </div>

            <div className="flex justify-between text-xl font-bold text-gray-900 mb-8">
              <span>Total</span>
              <span className="text-blue-600">${getTotalPrice().toFixed(2)}</span>
            </div>

            <button
              onClick={handleCheckout}
              className="w-full bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white font-bold py-4 rounded-xl mb-4 transition-all hover:shadow-lg hover:-translate-y-0.5 flex items-center justify-center gap-2"
            >
              <CreditCard size={20} />
              Proceed to Checkout
            </button>

            <div className="flex items-center justify-center gap-2 text-xs text-gray-500 mb-6">
              <ShieldCheck size={14} />
              <span>Secure Checkout</span>
            </div>

            <button
              onClick={() => navigate('/')}
              className="w-full bg-white border border-gray-200 hover:bg-gray-50 text-gray-700 font-semibold py-3 rounded-xl transition-colors"
            >
              Continue Shopping
            </button>

            <button
              onClick={clearCart}
              className="w-full text-sm text-gray-400 hover:text-red-600 py-2 mt-4 transition-colors"
            >
              Clear Cart
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
