import { Route, BrowserRouter as Router, Routes } from 'react-router-dom';
import Footer from './components/Footer';
import Navbar from './components/Navbar';
import AdminDashboard from './pages/AdminDashboard';
import ContactUs from './pages/ContactUs';
import Home from './pages/Home';
import LandlordDashboard from './pages/LandlordDashboard';
import Login from './pages/Login';
import Profile from './pages/Profile';
import Register from './pages/Register';
import TenantDashboard from './pages/TenantDashboard';
import PropertyDetail from './pages/PropertyDetail';

// Create router configuration
const routerConfig = {
  future: {
    v7_startTransition: true,
    v7_relativeSplatPath: true
  }
};

function App() {
  return (
    <Router {...routerConfig}>
      <div className="flex flex-col min-h-screen">
        <Navbar />
        <main className="flex-grow">
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/landlord" element={<LandlordDashboard />} />
            <Route path="/tenant" element={<TenantDashboard />} />
            <Route path="/admin" element={<AdminDashboard />} />
            <Route path="/contact" element={<ContactUs />} />
            <Route path="/profile" element={<Profile />} />
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
            <Route path="/property/:id" element={<PropertyDetail />} />
          </Routes>
        </main>
        <Footer />
      </div>
    </Router>
  );
}

export default App;