import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import AppLayout from './layouts/AppLayout.jsx';
import { ToastProvider } from './components/Toast.jsx';
import Dashboard from './pages/Dashboard.jsx';
import Medicines from './pages/Medicines.jsx';
import MedicineForm from './pages/MedicineForm.jsx';
import MedicineDetail from './pages/MedicineDetail.jsx';
import NotFound from './pages/NotFound.jsx';

export default function App() {
  return (
    <BrowserRouter>
      <ToastProvider>
        <Routes>
          <Route element={<AppLayout />}>
            <Route index element={<Navigate to="/dashboard" replace />} />
            <Route path="/dashboard" element={<Dashboard />} />
            <Route path="/medicines" element={<Medicines />} />
            <Route path="/medicines/add" element={<MedicineForm />} />
            <Route path="/medicines/:id" element={<MedicineDetail />} />
            <Route path="/medicines/:id/edit" element={<MedicineForm />} />
            <Route path="*" element={<NotFound />} />
          </Route>
        </Routes>
      </ToastProvider>
    </BrowserRouter>
  );
}
