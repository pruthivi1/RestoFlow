import { NavLink } from 'react-router-dom';
import { LayoutDashboard, Users, ChefHat, Receipt, Settings } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

const NAV_ITEMS = [
  { path: '/', label: 'Dashboard', icon: LayoutDashboard },
  { path: '/waiter', label: 'Waiter View', icon: Users },
  { path: '/kitchen', label: 'Kitchen View', icon: ChefHat },
  { path: '/billing', label: 'Billing View', icon: Receipt },
  { path: '/admin', label: 'Admin Panel', icon: Settings }
];

export function Sidebar() {
  return (
    <div className="w-64 bg-white border-r border-[#e5e4e7] flex flex-col items-start p-4 h-full sticky top-0 shadow-sm z-10 transition-all">
      <div className="flex items-center gap-3 mb-8 w-full px-2">
        <div className="w-10 h-10 rounded-xl bg-purple-600 flex items-center justify-center text-white font-bold text-xl shadow-md">
          R
        </div>
        <h1 className="text-xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-purple-600 to-indigo-600">
          RestoFlow
        </h1>
      </div>

      <nav className="flex-1 w-full space-y-2">
        {NAV_ITEMS.map((item) => (
          <NavLink
            key={item.path}
            to={item.path}
            className={({ isActive }) =>
              `flex items-center gap-3 px-3 py-3 rounded-xl transition-all font-medium ${
                isActive
                  ? 'bg-purple-50 text-purple-700 font-semibold'
                  : 'text-gray-600 hover:bg-gray-100'
              }`
            }
          >
            {({ isActive }) => (
              <>
                <item.icon
                  size={20}
                  className={`transition-colors ${
                    isActive ? 'text-purple-600' : 'text-gray-400'
                  }`}
                />
                {item.label}
                <AnimatePresence>
                  {isActive && (
                    <motion.div
                      layoutId="active-nav"
                      className="absolute right-0 w-1.5 h-8 bg-purple-600 rounded-l-full"
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      exit={{ opacity: 0 }}
                    />
                  )}
                </AnimatePresence>
              </>
            )}
          </NavLink>
        ))}
      </nav>

      <div className="mt-auto w-full pt-4 border-t border-gray-100 flex items-center gap-3 px-2">
        <div className="w-8 h-8 rounded-full bg-gray-200 border border-gray-300"></div>
        <div>
          <p className="text-sm font-semibold text-gray-800">Admin User</p>
          <p className="text-xs text-gray-500">System Admin</p>
        </div>
      </div>
    </div>
  );
}
