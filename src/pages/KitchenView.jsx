import { Helmet } from 'react-helmet-async';
import { motion, AnimatePresence } from 'framer-motion';
import { CheckCircle, Clock } from 'lucide-react';
import { useStore } from '../store/useStore';

export default function KitchenView() {
  const { orders, updateOrderStatus } = useStore();

  const pendingOrders = orders.filter(o => o.status === 'PENDING').sort((a, b) => a.timestamp - b.timestamp);

  const handleComplete = (id) => {
    updateOrderStatus(id, 'READY');
  };

  return (
    <div className="space-y-6">
      <Helmet>
        <title>Kitchen | RestoFlow</title>
        <meta name="description" content="Kitchen order management queue" />
      </Helmet>

      <div>
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Kitchen Queue</h1>
        <p className="text-gray-500">Currently preparing orders for tables.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
        <AnimatePresence>
          {pendingOrders.length === 0 ? (
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="col-span-full py-20 text-center text-gray-400 bg-white rounded-2xl border border-dashed border-gray-300"
            >
              <CheckCircle size={48} className="mx-auto mb-4 opacity-50 text-green-500" />
              <p className="text-xl">All caught up! No active orders.</p>
            </motion.div>
          ) : (
            pendingOrders.map(order => (
              <motion.div
                key={order.id}
                layout
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.9, y: -20 }}
                transition={{ duration: 0.3 }}
                className="bg-white rounded-2xl shadow-sm border border-gray-100 flex flex-col h-full overflow-hidden relative"
              >
                {/* Header */}
                <div className="bg-orange-50 p-4 border-b border-orange-100 flex justify-between items-center">
                  <div className="flex items-center gap-3">
                    <div className="bg-orange-500 text-white w-10 h-10 rounded-xl flex items-center justify-center font-bold text-lg shadow-sm">
                      T{order.tableNumber}
                    </div>
                    <div>
                      <p className="font-bold text-gray-900">Table {order.tableNumber}</p>
                      <p className="text-xs text-orange-600 font-medium flex items-center gap-1">
                        <Clock size={12} />
                        {new Date(order.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                      </p>
                    </div>
                  </div>
                  <span className="w-3 h-3 rounded-full bg-orange-500 animate-pulse hidden md:block"></span>
                </div>

                {/* Body - Items */}
                <div className="p-4 flex-1 overflow-y-auto">
                  <ul className="space-y-3">
                    {order.items.map(item => (
                      <li key={item.id} className="flex justify-between items-start text-sm border-b border-gray-50 pb-2 last:border-0 last:pb-0">
                        <div className="flex gap-2">
                          <span className="font-bold text-gray-600">{item.qty}x</span>
                          <span className="font-medium text-gray-900">{item.name}</span>
                        </div>
                      </li>
                    ))}
                  </ul>
                </div>

                {/* Footer */}
                <div className="p-4 border-t border-gray-50 bg-gray-50 mt-auto">
                  <button
                    onClick={() => handleComplete(order.id)}
                    className="w-full py-3 bg-green-600 hover:bg-green-700 text-white rounded-xl font-bold flex items-center justify-center gap-2 shadow-sm transition-all hover:shadow-md"
                  >
                    <CheckCircle size={20} />
                    Order Completed
                  </button>
                </div>
              </motion.div>
            ))
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
