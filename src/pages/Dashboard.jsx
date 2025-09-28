import { useEffect, useMemo, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import { useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import {
	facultyClasses,
	getClassSessions,
	getEnrolled,
	getStudents,
	getStudentsAttendance,
	reset,
} from '../features/attendanceRecord/recordsSlice';
import AdminDashboard from '../components/AdminDashboard';
import StudentDashboard from '../components/StudentDashboard';

export default function Dashboard() {
	const dispatch = useDispatch();
	const navigate = useNavigate();

	const { user } = useSelector((state) => state.auth);

	useEffect(() => {
		if (!user) navigate('/signup');
	}, [user, navigate]);

	const onNavigate = (newPath) => {
		navigate(newPath);
		window.scrollTo({ top: 0, behavior: 'smooth' });
	};

	const markPresentManual = () => {
		const currentSession = localStorage.getItem('attend_currentSession');
		if (!currentSession)
			return alert('No active session. Admin must start session.');
		const studs = JSON.parse(localStorage.getItem('attend_students')) || [];
		const me = studs.find((s) => s.email === user?.email);
		if (!me) return alert('Student record not found.');
		if (!me.attendedSessions) me.attendedSessions = [];
		if (me.attendedSessions.includes(currentSession))
			return alert('Already marked present for this session.');
		me.attendedSessions.push(currentSession);
		localStorage.setItem('attend_students', JSON.stringify(studs));
		setMyStudent({ ...me });
		alert('Marked present ✅');
	};

	const dashboardContent =
		user?.role === 'faculty' ? <AdminDashboard /> : <StudentDashboard />;

	const floatAnimation = {
		initial: { y: 0 },
		animate: {
			y: [0, -5, 0],
			transition: {
				duration: 5,
				repeat: Infinity,
				ease: 'easeInOut',
			},
		},
	};

	return (
		<div
			className="font-sans antialiased text-gray-800 dark:text-gray-100 min-h-screen flex flex-col relative overflow-hidden"
			style={{
				background: 'linear-gradient(135deg, #1f2937, #374151)',
			}}
		>
			<div className="absolute top-0 left-0 w-full h-full animate-pulse-slow bg-gradient-to-br from-indigo-500/20 to-purple-500/20 opacity-40 mix-blend-multiply pointer-events-none" />
			<Navbar onNavigate={onNavigate} />
			<main className="flex-grow pt-24 pb-12">
				<div className="max-w-7xl mx-auto px-6">
					{/* --- REVISED DASHBOARD HEADING WITH SMOOTHER ANIMATION --- */}
					<motion.h2
						initial={{ opacity: 0, x: -100 }}
						animate={{ opacity: 1, x: 0 }}
						transition={{ duration: 0.8, ease: 'easeOut' }}
						className="text-4xl md:text-6xl font-extrabold text-center mb-12 bg-clip-text text-transparent bg-gradient-to-r from-indigo-600 to-purple-600 dark:from-indigo-400 dark:to-purple-400"
					>
						Dashboard
					</motion.h2>

					<motion.div
						className="relative"
						variants={floatAnimation}
						initial="initial"
						animate="animate"
					>
						{dashboardContent}
					</motion.div>
				</div>
			</main>
			<Footer onNavigate={onNavigate} />
			<svg className="hidden">
				<defs>
					<linearGradient id="colorLineGradient" x1="0" y1="0" x2="1" y2="0">
						<stop offset="0%" stopColor="#ef4444" />
						<stop offset="25%" stopColor="#f97316" />
						<stop offset="50%" stopColor="#eab308" />
						<stop offset="75%" stopColor="#84cc16" />
						<stop offset="100%" stopColor="#22c55e" />
					</linearGradient>
				</defs>
			</svg>
		</div>
	);
}
