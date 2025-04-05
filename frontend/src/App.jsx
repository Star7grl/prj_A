import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import RegisterPage from './pages/RegisterPage';
import LoginPage from './pages/LoginPage';
import HomePage from './pages/HomePage';
import ServicesPage from './pages/ServicesPage';
import RoomsPage from './pages/RoomsPage';
import ProfilePage from './pages/ProfilePage';
import AdminPanelPage from './pages/AdminPanelPage';
import ServicesManagementPage from './pages/ServicesManagementPage';
import RoomsManagementPage from './pages/RoomsManagementPage';
import ForgotPasswordPage from './pages/ForgotPasswordPage';
import RoomDetailPage from './pages/RoomDetailPage';
import BookingPage from './pages/BookingPage';
import Header from './components/Header';
import ProtectedRoute from './components/ProtectedRoute';

const App = () => {
  return (
    <Router>
      <Header />
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/register" element={<RegisterPage />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/services" element={<ServicesPage />} />
        <Route path="/rooms" element={<RoomsPage />} />
        <Route path="/rooms/:id" element={<RoomDetailPage />} />
        <Route path="/booking/:roomId" element={<ProtectedRoute><BookingPage /></ProtectedRoute>} />
        <Route path="/profile" element={<ProtectedRoute><ProfilePage /></ProtectedRoute>} />
        <Route path="/admin" element={<ProtectedRoute><AdminPanelPage /></ProtectedRoute>} />
        <Route path="/admin/services" element={<ProtectedRoute><ServicesManagementPage /></ProtectedRoute>} />
        <Route path="/admin/rooms" element={<ProtectedRoute><RoomsManagementPage /></ProtectedRoute>} />
        <Route path="/forgot-password" element={<ForgotPasswordPage />} />
        <Route path="*" element={<Navigate to="/" />} />
      </Routes>
    </Router>
  );
};

export default App;