import { useState, useMemo } from 'react';
import { Helmet } from 'react-helmet-async';
import { motion, AnimatePresence } from 'framer-motion';
import { Plus, Minus, Send, FileText, UtensilsCrossed, Trash2 } from 'lucide-react';
import { useStore } from '../store/useStore';

export default function WaiterView() {
  const { menu, orders, addOrder, updateOrderStatus } = useStore();
  
  const [tableInput, setTableInput] = useState('1');
  const [cart, setCart] = useState([]);

  // Find active order for current table
  const activeOrder = useMemo(() => {
    return orders.find(o => o.tableNumber === tableInput);
  }, [orders, tableInput]);

  // Group menu items by category
  const categorizedMenu = useMemo(() => {
    const map = new Map();
    menu.filter(m => m.available).forEach(item => {
      if (!map.has(item.category)) map.set(item.category, []);
      map.get(item.category).push(item);
    });
    return Array.from(map.entries());
  }, [menu]);

  const cartTotal = cart.reduce((sum, item) => sum + (item.price * item.qty), 0);

  const handleAddToCart = (item) => {
    setCart(prev => {
      const existing = prev.find(i => i.id === item.id);
      if (existing) {
        return prev.map(i => i.id === item.id ? { ...i, qty: i.qty + 1 } : i);
      }
      return [...prev, { ...item, qty: 1 }];
    });
  };

  const handleRemoveFromCart = (id) => {
    setCart(prev => {
      const existing = prev.find(i => i.id === id);
      if (existing && existing.qty > 1) {
        return prev.map(i => i.id === id ? { ...i, qty: i.qty - 1 } : i);
      }
      return prev.filter(i => i.id !== id);
    });
  };

  const clearCart = () => setCart([]);

  const handleSendToKitchen = () => {
    if (cart.length === 0 || !tableInput) return;
    addOrder(tableInput, cart, cartTotal);
    setCart([]);
  };

  const handleGenerateBill = () => {
    if (activeOrder && activeOrder.status === 'READY') {
      updateOrderStatus(activeOrder.id, 'BILLING');
    }
  };

  // Stepper utility
  const steps = ['PENDING', 'READY', 'BILLING'];
  const activeStepIdx = activeOrder ? steps.indexOf(activeOrder.status) : -1;

  return (
    <div className="flex gap-8 h-[calc(100vh-[100px])]">
      <Helmet>
        <title>Waiter | RestoFlow</title>
        <meta name="description" content="Manage table orders and cart" />
      </Helmet>

      {/* Main Menu Area */}
      <div className="flex-1 overflow-y-auto pr-4">
        <div className="flex items-center justify-between mb-6">
          <h1 className="text-3xl font-bold text-gray-900">Menu</h1>
          <div className="flex items-center gap-3 bg-white px-4 py-2 rounded-xl shadow-sm border border-gray-100">
            <span className="font-semibold text-gray-500">Table</span>
            <input 
              type="number" 
              value={tableInput} 
              onChange={(e) => setTableInput(e.target.value)}
              className="w-16 text-xl font-bold text-gray-900 text-center focus:outline-none focus:ring-2 focus:ring-purple-500 rounded bg-gray-50 border border-transparent"
              min="1"
            />
          </div>
        </div>

        {activeOrder && (
          <motion.div 
            initial={{ opacity: 0, y: -10 }} 
            animate={{ opacity: 1, y: 0 }}
            className="bg-white rounded-2xl shadow-sm border border-orange-200 mb-8 p-6"
          >
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-lg font-bold text-gray-900 flex items-center gap-2">
                <div className="w-2.5 h-2.5 rounded-full bg-orange-500 animate-pulse"></div>
                Active Order Status
              </h2>
              <span className={`px-4 py-1.5 rounded-full text-sm font-bold uppercase tracking-wide
                ${activeOrder.status === 'PENDING' ? 'bg-orange-100 text-orange-700' : 
                  activeOrder.status === 'READY' ? 'bg-green-100 text-green-700' : 
                  'bg-blue-100 text-blue-700'}`
              }>
                {activeOrder.status}
              </span>
            </div>

            {/* Stepper */}
            <div className="flex items-center justify-between relative mt-4">
              <div className="absolute left-8 right-8 top-1/2 -translate-y-1/2 h-1 bg-gray-100 rounded z-0"></div>
              <div 
                className="absolute left-8 top-1/2 -translate-y-1/2 h-1 bg-purple-500 rounded z-0 transition-all duration-500"
                style={{ width: `${(Math.max(0, activeStepIdx) / (steps.length - 1)) * 100}%` }}
              ></div>
              
              {['Kitchen', 'Ready', 'Billing'].map((step, idx) => (
                <div key={step} className="relative z-10 flex flex-col items-center gap-2">
                  <div className={`w-10 h-10 rounded-full flex items-center justify-center border-4 border-white transition-colors duration-500 ${
                    activeStepIdx >= idx ? 'bg-purple-600 text-white shadow-md' : 'bg-gray-200 text-gray-400'
                  }`}>
                    {idx === 0 ? <UtensilsCrossed size={16} /> : idx === 1 ? <div className="font-bold">✓</div> : <FileText size={16} />}
                  </div>
                  <span className={`text-sm font-medium ${activeStepIdx >= idx ? 'text-gray-900' : 'text-gray-400'}`}>{step}</span>
                </div>
              ))}
            </div>

            {activeOrder.status === 'READY' && (
              <motion.button 
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                onClick={handleGenerateBill}
                className="mt-8 w-full py-3 bg-green-600 hover:bg-green-700 text-white font-bold rounded-xl flex items-center justify-center gap-2 shadow-lg transition-colors"
              >
                <FileText size={20} />
                Generate Bill
              </motion.button>
            )}
          </motion.div>
        )}

        {/* Menu Grid */}
        <div className="space-y-8 pb-10">
          {categorizedMenu.map(([category, items]) => (
            <div key={category}>
              <h3 className="text-xl font-bold text-gray-800 border-b border-gray-200 pb-2 mb-4">{category}</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {items.map(item => (
                  <motion.div 
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={() => !activeOrder && handleAddToCart(item)}
                    key={item.id}
                    className={`bg-white p-4 rounded-xl border border-gray-100 shadow-sm flex flex-col justify-between cursor-pointer transition-colors
                      ${activeOrder ? 'opacity-50 cursor-not-allowed' : 'hover:border-purple-300'}`}
                  >
                    <div>
                      <h4 className="font-semibold text-gray-900">{item.name}</h4>
                      <p className="text-purple-600 font-bold mt-1">${item.price.toFixed(2)}</p>
                    </div>
                  </motion.div>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Cart Sidebar */}
      <div className="w-[340px] bg-white rounded-2xl shadow-sm border border-gray-100 flex flex-col h-full sticky top-[80px]">
        <div className="p-5 border-b border-gray-100 flex items-center justify-between flex-shrink-0">
          <h2 className="text-lg font-bold text-gray-900">Current Order</h2>
          {cart.length > 0 && (
            <button onClick={clearCart} className="text-red-500 hover:text-red-600 p-1 rounded-md hover:bg-red-50">
              <Trash2 size={18} />
            </button>
          )}
        </div>

        <div className="flex-1 overflow-y-auto px-5 py-4 space-y-4">
          <AnimatePresence>
            {cart.length === 0 ? (
              <motion.div 
                initial={{ opacity: 0 }} animate={{ opacity: 1 }}
                className="h-full flex flex-col items-center justify-center text-gray-400 space-y-4"
              >
                <UtensilsCrossed size={48} className="opacity-20" />
                <p>Cart is empty</p>
              </motion.div>
            ) : (
              cart.map((item) => (
                <motion.div 
                  key={item.id} 
                  layout
                  initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20, height: 0 }}
                  className="flex items-center justify-between bg-gray-50 p-3 rounded-xl border border-gray-100"
                >
                  <div className="flex-1 min-w-0 pr-3">
                    <p className="text-sm font-semibold text-gray-900 truncate">{item.name}</p>
                    <p className="text-xs text-gray-500 font-medium">${item.price.toFixed(2)}</p>
                  </div>
                  <div className="flex items-center gap-3 bg-white px-2 py-1 rounded-lg border border-gray-200">
                    <button onClick={() => handleRemoveFromCart(item.id)} className="text-gray-400 hover:text-purple-600">
                      <Minus size={14} />
                    </button>
                    <span className="text-sm font-bold w-4 text-center">{item.qty}</span>
                    <button onClick={() => handleAddToCart(item)} className="text-gray-400 hover:text-purple-600">
                      <Plus size={14} />
                    </button>
                  </div>
                </motion.div>
              ))
            )}
          </AnimatePresence>
        </div>

        <div className="p-5 border-t border-gray-100 flex-shrink-0 bg-gray-50 rounded-b-2xl">
          <div className="flex justify-between items-center mb-4">
            <span className="text-gray-500 font-medium">Total Price</span>
            <span className="text-2xl font-bold text-gray-900">${cartTotal.toFixed(2)}</span>
          </div>
          <button 
            disabled={cart.length === 0 || !!activeOrder}
            onClick={handleSendToKitchen}
            className={`w-full py-3.5 rounded-xl font-bold text-white shadow-lg flex items-center justify-center gap-2 transition-all cursor-pointer
              ${cart.length === 0 || !!activeOrder ? 'bg-gray-300 opacity-50 cursor-not-allowed shadow-none' : 'bg-purple-600 hover:bg-purple-700 hover:-translate-y-0.5'}
            `}
          >
            <Send size={18} />
            Send to Kitchen
          </button>
        </div>
      </div>
    </div>
  );
}
