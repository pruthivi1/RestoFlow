import { useState } from 'react';
import { Helmet } from 'react-helmet-async';
import { AlertTriangle, Plus } from 'lucide-react';
import { useStore } from '../store/useStore';

export default function AdminPanel() {
  const { 
    menu, addMenuItem, deleteMenuItem, toggleMenuItemAvailability,
    orders, updateOrderStatus, deleteOrder, 
    resetOrders, clearHistory, history
  } = useStore();

  const [newItem, setNewItem] = useState({ name: '', category: 'Mains', price: '' });

  const handleAddItem = (e) => {
    e.preventDefault();
    if (!newItem.name || !newItem.price) return;
    addMenuItem({ ...newItem, price: parseFloat(newItem.price), available: true });
    setNewItem({ name: '', category: 'Mains', price: '' });
  };

  return (
    <div className="space-y-8 pb-10">
      <Helmet>
        <title>Admin Panel | RestoFlow</title>
        <meta name="description" content="System configuration and overrides" />
      </Helmet>

      <div>
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Admin Panel</h1>
        <p className="text-gray-500">Manage menus, master controls, and system state.</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Menu Management */}
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
          <div className="p-5 border-b border-gray-100 flex items-center justify-between">
            <h2 className="text-lg font-bold text-gray-900">Menu Management</h2>
          </div>
          <div className="p-5 bg-gray-50 border-b border-gray-100">
            <form onSubmit={handleAddItem} className="flex gap-3">
              <input 
                type="text" placeholder="Item Name" required 
                value={newItem.name} onChange={e => setNewItem({ ...newItem, name: e.target.value })}
                className="flex-1 px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-purple-500" 
              />
              <select 
                value={newItem.category} onChange={e => setNewItem({ ...newItem, category: e.target.value })}
                className="w-28 px-2 py-2 border border-gray-200 rounded-lg text-sm bg-white focus:outline-none focus:ring-2 focus:ring-purple-500"
              >
                <option value="Mains">Mains</option>
                <option value="Salads">Salads</option>
                <option value="Drinks">Drinks</option>
              </select>
              <input 
                type="number" step="0.01" placeholder="Price" required min="0"
                value={newItem.price} onChange={e => setNewItem({ ...newItem, price: e.target.value })}
                className="w-24 px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-purple-500" 
              />
              <button type="submit" className="bg-purple-600 hover:bg-purple-700 text-white p-2 rounded-lg font-bold flex items-center justify-center">
                <Plus size={20} />
              </button>
            </form>
          </div>
          <div className="p-5 max-h-[400px] overflow-y-auto">
             <table className="w-full text-left text-sm text-gray-600">
                <thead>
                  <tr className="border-b border-gray-200 font-semibold text-gray-900">
                    <th className="pb-3">Name</th>
                    <th className="pb-3">Category</th>
                    <th className="pb-3">Price</th>
                    <th className="pb-3 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {menu.map(item => (
                    <tr key={item.id} className={`border-b border-gray-100 last:border-0 ${!item.available ? 'opacity-50' : ''}`}>
                      <td className="py-3 font-medium text-gray-900">{item.name}</td>
                      <td className="py-3 text-xs uppercase tracking-wide text-gray-500">{item.category}</td>
                      <td className="py-3 font-semibold text-gray-700">${item.price.toFixed(2)}</td>
                      <td className="py-3 text-right space-x-2">
                        <button 
                          onClick={() => toggleMenuItemAvailability(item.id)}
                          className={`px-2 py-1 text-xs rounded-md font-bold ${item.available ? 'bg-green-100 text-green-700 hover:bg-green-200' : 'bg-gray-200 text-gray-600 hover:bg-gray-300'}`}
                        >
                          {item.available ? 'Active' : 'Hidden'}
                        </button>
                        <button 
                          onClick={() => deleteMenuItem(item.id)}
                          className="px-2 py-1 text-xs rounded-md font-bold bg-red-50 text-red-600 hover:bg-red-100"
                        >
                          Delete
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
             </table>
          </div>
        </div>

        <div className="space-y-8">
          {/* Order Overrides */}
          <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
            <div className="p-5 border-b border-gray-100 flex items-center justify-between">
              <h2 className="text-lg font-bold text-gray-900">Active Orders Override</h2>
              <span className="bg-purple-100 text-purple-700 px-2 py-1 text-xs font-bold rounded-lg">{orders.length} Active</span>
            </div>
            <div className="p-5 max-h-[300px] overflow-y-auto">
              {orders.length === 0 ? (
                <p className="text-gray-400 text-center py-4">No active orders</p>
              ) : (
                <ul className="space-y-4">
                  {orders.map(o => (
                    <li key={o.id} className="flex items-center justify-between border border-gray-100 rounded-xl p-3 bg-gray-50">
                      <div>
                        <p className="font-bold text-gray-900 mb-0.5">Table {o.tableNumber}</p>
                        <p className="text-xs font-bold text-gray-500 uppercase tracking-widest">{o.status}</p>
                      </div>
                      <div className="flex gap-2">
                        {o.status === 'PENDING' && (
                          <button onClick={() => updateOrderStatus(o.id, 'READY')} className="text-xs font-bold px-3 py-1.5 bg-green-100 text-green-700 hover:bg-green-200 rounded">Force Ready</button>
                        )}
                        {o.status === 'READY' && (
                          <button onClick={() => updateOrderStatus(o.id, 'BILLING')} className="text-xs font-bold px-3 py-1.5 bg-blue-100 text-blue-700 hover:bg-blue-200 rounded">Force Bill</button>
                        )}
                        <button onClick={() => deleteOrder(o.id)} className="text-xs font-bold px-3 py-1.5 bg-red-100 text-red-700 hover:bg-red-200 rounded">Delete</button>
                      </div>
                    </li>
                  ))}
                </ul>
              )}
            </div>
          </div>

          {/* System Control */}
          <div className="bg-white rounded-2xl shadow-sm border border-red-100 overflow-hidden relative">
            <div className="absolute top-0 left-0 w-1.5 h-full bg-red-500"></div>
            <div className="p-5 border-b border-gray-100 flex items-center justify-between pl-6">
              <h2 className="text-lg font-bold text-gray-900 flex items-center gap-2">
                <AlertTriangle size={18} className="text-red-500" />
                Danger Zone
              </h2>
            </div>
            <div className="p-6 pl-6 flex flex-col gap-4">
              <div className="flex justify-between items-center">
                <div>
                  <p className="font-bold text-gray-900">Reset Active Orders</p>
                  <p className="text-sm text-gray-500">Delete all currently active tickets</p>
                </div>
                <button 
                  onClick={resetOrders} 
                  disabled={orders.length === 0} 
                  className={`px-4 py-2 font-bold rounded-lg text-sm ${orders.length === 0 ? 'bg-gray-100 text-gray-400' : 'bg-red-50 text-red-600 hover:bg-red-100'}`}
                >
                  Reset Orders
                </button>
              </div>

              <div className="h-px bg-gray-100 w-full" />

              <div className="flex justify-between items-center">
                <div>
                  <p className="font-bold text-gray-900">Clear History</p>
                  <p className="text-sm text-gray-500">Delete the entire history ({history.length} items)</p>
                </div>
                <button 
                  onClick={clearHistory} 
                  disabled={history.length === 0} 
                  className={`px-4 py-2 font-bold rounded-lg text-sm ${history.length === 0 ? 'bg-gray-100 text-gray-400' : 'bg-red-50 text-red-600 hover:bg-red-100'}`}
                >
                  Clear History
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
