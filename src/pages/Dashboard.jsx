import { useMemo } from 'react';
import { Helmet } from 'react-helmet-async';
import { motion } from 'framer-motion';
import { AreaChart, Area, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid } from 'recharts';
import { DollarSign, Utensils, Users, ChefHat, Activity } from 'lucide-react';
import { useStore } from '../store/useStore';

export default function Dashboard() {
  const { orders, history } = useStore();

  const stats = useMemo(() => {
    const totalRev = history.reduce((sum, order) => sum + order.total, 0);
    const served = history.length;
    
    // Get unique active tables count using a Set
    const tables = new Set(orders.map(o => o.tableNumber)).size;
    const queue = orders.filter(o => o.status === 'PENDING').length;
    
    return {
      revenue: totalRev.toFixed(2),
      served,
      tables,
      queue
    };
  }, [orders, history]);

  // Dummy chart data for illustration
  const chartData = [
    { time: '10am', revenue: 120 },
    { time: '11am', revenue: 210 },
    { time: '12pm', revenue: 450 },
    { time: '1pm', revenue: 580 },
    { time: '2pm', revenue: 320 },
    { time: '3pm', revenue: 190 },
    { time: 'now', revenue: parseFloat(stats.revenue) || 200 },
  ];

  // Merge lists to build activity feed, sort by timestamp
  const activities = useMemo(() => {
    const all = [
      ...orders.map(o => ({ ...o, type: o.status === 'PENDING' ? 'created' : 'updated' })),
      ...history.map(h => ({ ...h, type: 'completed' }))
    ];
    return all.sort((a, b) => b.timestamp - a.timestamp).slice(0, 5);
  }, [orders, history]);

  const cards = [
    { label: 'Total Revenue', value: `$${stats.revenue}`, icon: DollarSign, color: 'text-green-600', bg: 'bg-green-100' },
    { label: 'Orders Served', value: stats.served, icon: Utensils, color: 'text-blue-600', bg: 'bg-blue-100' },
    { label: 'Active Tables', value: stats.tables, icon: Users, color: 'text-purple-600', bg: 'bg-purple-100' },
    { label: 'Kitchen Queue', value: stats.queue, icon: ChefHat, color: 'text-orange-600', bg: 'bg-orange-100' },
  ];

  return (
    <div className="space-y-6">
      <Helmet>
        <title>Dashboard | RestoFlow</title>
        <meta name="description" content="Overview of restaurant performance and active metrics." />
      </Helmet>

      <div>
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Overview</h1>
        <p className="text-gray-500">Welcome back. Here is what's happening today.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {cards.map((card, idx) => (
          <motion.div
            key={card.label}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: idx * 0.1 }}
            className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 flex items-center gap-4"
          >
            <div className={`w-14 h-14 rounded-full ${card.bg} flex items-center justify-center`}>
              <card.icon className={card.color} size={28} />
            </div>
            <div>
              <p className="text-sm text-gray-500 font-medium">{card.label}</p>
              <h3 className="text-2xl font-bold text-gray-900">{card.value}</h3>
            </div>
          </motion.div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Chart */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.4 }}
          className="lg:col-span-2 bg-white rounded-2xl shadow-sm border border-gray-100 p-6"
        >
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-lg font-bold text-gray-900">Revenue Flow</h2>
            <select className="bg-gray-50 border border-gray-200 text-sm rounded-lg px-3 py-1.5 focus:outline-none focus:ring-2 focus:ring-purple-500">
              <option>Today</option>
              <option>This Week</option>
            </select>
          </div>
          <div className="h-72 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={chartData} margin={{ top: 10, right: 10, left: 0, bottom: 0 }}>
                <defs>
                  <linearGradient id="colorRev" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#8b5cf6" stopOpacity={0.3}/>
                    <stop offset="95%" stopColor="#8b5cf6" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f3f4f6" />
                <XAxis dataKey="time" axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: '#9ca3af' }} dy={10} />
                <YAxis axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: '#9ca3af' }} dx={-10} />
                <Tooltip 
                  contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }}
                  labelStyle={{ color: '#6b7280', marginBottom: '4px' }}
                />
                <Area type="monotone" dataKey="revenue" stroke="#8b5cf6" strokeWidth={3} fillOpacity={1} fill="url(#colorRev)" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </motion.div>

        {/* Activity Feed */}
        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.5 }}
          className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 flex flex-col"
        >
          <div className="flex items-center gap-2 mb-6 text-gray-900">
            <Activity size={20} className="text-purple-600" />
            <h2 className="text-lg font-bold">Activity Feed</h2>
          </div>
          
          <div className="flex-1 overflow-y-auto pr-2 space-y-6">
            {activities.length === 0 ? (
              <p className="text-center text-gray-500 mt-10">No recent activity</p>
            ) : (
              activities.map((act) => (
                <div key={act.id + act.type} className="relative flex gap-4">
                  <div className="absolute left-4 top-8 bottom-[-24px] w-0.5 bg-gray-100 last:hidden"></div>
                  <div className={`w-8 h-8 rounded-full flex-shrink-0 z-10 flex items-center justify-center border-2 border-white
                    ${act.type === 'created' ? 'bg-blue-500' : act.type === 'completed' ? 'bg-green-500' : 'bg-orange-500'}`}
                  >
                     <div className="w-2.5 h-2.5 bg-white rounded-full"></div>
                  </div>
                  <div>
                    <p className="text-sm font-medium text-gray-900">
                      {act.type === 'created' && `Table ${act.tableNumber} ordered`}
                      {act.type === 'updated' && `Table ${act.tableNumber} status: ${act.status}`}
                      {act.type === 'completed' && `Table ${act.tableNumber} sorted & paid`}
                    </p>
                    <p className="text-xs text-gray-500 mt-0.5">
                      {new Date(act.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                    </p>
                  </div>
                </div>
              ))
            )}
          </div>
        </motion.div>
      </div>
    </div>
  );
}
