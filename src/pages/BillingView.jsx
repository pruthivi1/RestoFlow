import { Helmet } from 'react-helmet-async';
import { motion, AnimatePresence } from 'framer-motion';
import { Printer, CreditCard, DollarSign } from 'lucide-react';
import { useStore } from '../store/useStore';

export default function BillingView() {
  const { orders, moveOrderToHistory } = useStore();

  const billingOrders = orders.filter(o => o.status === 'BILLING').sort((a, b) => a.timestamp - b.timestamp);

  const handlePrint = (order) => {
    alert(`Printing bill for Table ${order.tableNumber} - Total: $${order.total.toFixed(2)}`);
  };

  const handlePayment = (id) => {
    moveOrderToHistory(id);
  };

  return (
    <div className="space-y-6">
      <Helmet>
        <title>Billing | RestoFlow</title>
        <meta name="description" content="View orders ready to be paid" />
      </Helmet>

      <div>
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Billing & Payments</h1>
        <p className="text-gray-500">Process payments for tables that are ready to check out.</p>
      </div>

      <div className="flex flex-col gap-6">
        <AnimatePresence>
          {billingOrders.length === 0 ? (
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="py-32 text-center text-gray-400 bg-white rounded-2xl border border-dashed border-gray-300"
            >
              <DollarSign size={48} className="mx-auto mb-4 opacity-50 text-blue-500" />
              <p className="text-xl">No pending bills to process.</p>
            </motion.div>
          ) : (
            billingOrders.map(order => (
              <motion.div
                key={order.id}
                layout
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, scale: 0.9, x: 20 }}
                transition={{ duration: 0.3 }}
                className="bg-white rounded-2xl shadow-sm border border-gray-200 p-6 flex flex-col md:flex-row gap-6 items-center justify-between"
              >
                {/* Details */}
                <div className="flex-1 flex gap-6 w-full items-center">
                  <div className="bg-blue-100 text-blue-700 w-16 h-16 rounded-2xl flex items-center justify-center font-bold text-2xl shadow-sm shrink-0">
                    T{order.tableNumber}
                  </div>
                  <div className="flex-1">
                    <p className="font-bold text-gray-900 text-lg mb-1">Table {order.tableNumber}</p>
                    <div className="text-sm text-gray-500 space-y-1">
                      {order.items.map(item => (
                        <p key={item.id} className="flex justify-between max-w-[200px]">
                          <span>{item.qty}x {item.name}</span>
                          <span className="font-semibold text-gray-700">${(item.price * item.qty).toFixed(2)}</span>
                        </p>
                      ))}
                    </div>
                  </div>
                </div>

                <div className="h-full w-px bg-gray-200 hidden md:block" />

                {/* Actions & Price */}
                <div className="flex flex-col md:items-end w-full md:w-auto gap-4 shrink-0 border-t border-gray-100 pt-4 md:border-0 md:pt-0">
                  <div className="text-3xl font-black text-gray-900 flex items-center gap-1">
                    <span className="text-blue-600">$</span>
                    {order.total.toFixed(2)}
                  </div>
                  <div className="flex gap-3 mt-auto flex-col md:flex-row w-full h-full">
                    <button
                      onClick={() => handlePrint(order)}
                      className="px-6 py-2.5 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-xl font-bold flex items-center justify-center gap-2 shadow-sm transition-all"
                    >
                      <Printer size={18} />
                      Print
                    </button>
                    <button
                      onClick={() => handlePayment(order.id)}
                      className="px-6 py-2.5 bg-blue-600 hover:bg-blue-700 text-white rounded-xl font-bold flex items-center justify-center gap-2 shadow-sm hover:shadow-md transition-all whitespace-nowrap"
                    >
                      <CreditCard size={18} />
                      Payment Received
                    </button>
                  </div>
                </div>
              </motion.div>
            ))
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
