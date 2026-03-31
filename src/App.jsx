import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { HelmetProvider } from 'react-helmet-async';
import { Layout } from './components/Layout';
import Dashboard from './pages/Dashboard';
import WaiterView from './pages/WaiterView';
import KitchenView from './pages/KitchenView';
import BillingView from './pages/BillingView';
import AdminPanel from './pages/AdminPanel';

function App() {
  return (
    <HelmetProvider>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Layout />}>
            <Route index element={<Dashboard />} />
            <Route path="waiter" element={<WaiterView />} />
            <Route path="kitchen" element={<KitchenView />} />
            <Route path="billing" element={<BillingView />} />
            <Route path="admin" element={<AdminPanel />} />
          </Route>
        </Routes>
      </BrowserRouter>
    </HelmetProvider>
  );
}

export default App;
