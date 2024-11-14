import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import Navbar from './components/Navbar';
import Home from './components/Home';
import Schedule from './components/Schedule';
import Register from './components/Register';
import AdminLogin from './components/admin/AdminLogin';
import Dashboard from './components/admin/Dashboard';
import UserLogin from './components/UserLogin';
import ParticipantDashboard from './components/auth/ParticipantDashboard';
import VolunteerDashboard from './components/auth/VolunteerDashboard';

function App() {
  return (
    <AuthProvider>
      <Router>
        <div className="min-h-screen bg-gray-50">
          <Navbar />
          <div className="pt-16"> {/* Add padding-top to account for fixed navbar */}
            <Routes>
              <Route path="/" element={<Home />} />
              <Route path="/schedule" element={<Schedule />} />
              <Route path="/register" element={<Register />} />
              <Route path="/login" element={<UserLogin />} />
              <Route path="/admin/*" element={<AdminLogin />} />
              <Route path="/admin/dashboard" element={<Dashboard />} />
              <Route path="/participant/dashboard" element={<ParticipantDashboard />} />
              <Route path="/volunteer/dashboard" element={<VolunteerDashboard />} />
            </Routes>
          </div>
        </div>
      </Router>
    </AuthProvider>
  );
}

export default App;