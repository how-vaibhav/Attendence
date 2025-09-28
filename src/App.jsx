import { Routes, Route } from 'react-router-dom';
import Home from './pages/Home';
import Login from './pages/Login';
import Signup from './pages/Signup';
import Dashboard from './pages/Dashboard';
import Complaint from './pages/Complaint';
import Contact from './pages/Contact';
import AdminComplaints from './pages/AdminComplaints';
import { ThemeProvider } from './context/ThemeContext';
import Profile from './pages/Profile';

export default function App() {
	return (
		<ThemeProvider>
			<Routes>
				<Route path="/" element={<Home />} />
				<Route path="/login" element={<Login />} />
				<Route path="/signup" element={<Signup />} />
				<Route path="/dashboard" element={<Dashboard />} />
				<Route path="/complaint" element={<Complaint />} />
				<Route path="/admin/complaints" element={<AdminComplaints />} />
				<Route path="/contact" element={<Contact />} />
				<Route path="/profile" element={<Profile />} />
			</Routes>
		</ThemeProvider>
	);
}
