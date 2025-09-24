import React, { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
	LineChart,
	Line,
	XAxis,
	YAxis,
	Tooltip,
	ResponsiveContainer,
	CartesianGrid,
} from 'recharts';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';

// Function to generate random particles for background
const generateParticles = (count) => {
	const particles = [];
	for (let i = 0; i < count; i++) {
		particles.push({
			id: i,
			size: Math.random() * 20 + 10,
			left: Math.random() * 100 + '%',
			animationDuration: Math.random() * 10 + 15 + 's',
			animationDelay: Math.random() * 10 + 's',
		});
	}
	return particles;
};

// --- Utility component for the animated progress bar (re-used) ---
const AttendanceProgress = ({ myStudent, sessions }) => {
	const totalSessions = sessions?.length || 1;
	const attendedSessions = myStudent?.attendedSessions?.length || 0;
	const attendancePercentage = (attendedSessions / totalSessions) * 100;

	let progressColor = 'bg-green-500';
	let textColor = 'text-green-500';
	if (attendancePercentage < 75) {
		progressColor = 'bg-orange-500';
		textColor = 'text-orange-500';
	}
	if (attendancePercentage < 50) {
		progressColor = 'bg-red-500';
		textColor = 'text-red-500';
	}

	return (
		<motion.div
			initial={{ opacity: 0, y: 20 }}
			animate={{ opacity: 1, y: 0 }}
			transition={{ duration: 0.8 }}
			className="bg-white/60 dark:bg-gray-800/60 backdrop-blur-md rounded-2xl p-6 shadow-lg border border-white/20 dark:border-gray-700/50"
		>
			<h3 className="font-semibold text-xl mb-2">My Attendance Summary</h3>
			<p className="text-sm text-gray-600 dark:text-gray-300">
				You've attended{' '}
				<span className="font-bold text-indigo-600 dark:text-indigo-400">
					{attendedSessions}
				</span>{' '}
				out of{' '}
				<span className="font-bold text-indigo-600 dark:text-indigo-400">
					{totalSessions}
				</span>{' '}
				sessions.
			</p>
			<div className="mt-4 bg-gray-200 dark:bg-gray-700 rounded-full h-2.5">
				<motion.div
					initial={{ width: 0 }}
					animate={{ width: `${attendancePercentage}%` }}
					transition={{ duration: 1.5, ease: 'easeOut' }}
					className={`h-2.5 rounded-full ${progressColor}`}
				/>
			</div>
			<p className={`text-right text-sm font-bold mt-2 ${textColor}`}>
				{attendancePercentage.toFixed(1)}%
			</p>
		</motion.div>
	);
};

// Custom Tooltip component for Recharts
const CustomTooltip = ({ active, payload, label }) => {
	if (active && payload && payload.length) {
		return (
			<div className="bg-gray-900/80 dark:bg-gray-200/80 backdrop-blur-md rounded-lg p-4 shadow-lg border border-gray-700 dark:border-gray-300">
				<p className="text-sm font-semibold text-white dark:text-gray-900 mb-1">
					{label}
				</p>
				<p className="text-xs text-indigo-300 dark:text-indigo-600">{`Attendance: ${payload[0].value}%`}</p>
			</div>
		);
	}
	return null;
};

// --- Variants for list staggering animation ---
const containerVariants = {
	hidden: { opacity: 0 },
	visible: {
		opacity: 1,
		transition: {
			staggerChildren: 0.1,
		},
	},
};

const itemVariants = {
	hidden: { opacity: 0, y: 20 },
	visible: {
		opacity: 1,
		y: 0,
		transition: {
			type: 'spring',
			stiffness: 400,
			damping: 10,
		},
	},
};

// --- Main Student Dashboard Component ---
export default function StudentDashboard() {
	const { user } = useAuth();
	const navigate = useNavigate();
	const [sessions, setSessions] = useState([]);
	const [myStudent, setMyStudent] = useState(null);
	const [filterClass, setFilterClass] = useState('all');
	const [particles, setParticles] = useState([]);

	// useEffect(() => {
	//   if (!user || user.role !== "student") {
	//     navigate("/login");
	//     return;
	//   }
	//   const storedSessions =
	//     JSON.parse(localStorage.getItem("attend_sessions")) || [];
	//   const storedStudents =
	//     JSON.parse(localStorage.getItem("attend_students")) || [];

	//   const me = storedStudents.find((s) => s.email === user.email);
	//   setMyStudent(me || null);

	//   // Add a className property to mock session data for filtering
	//   const sessionsWithClass = storedSessions.map((session, index) => ({
	//     ...session,
	//     className: `Class ${String.fromCharCode(65 + (index % 3))}`, // A, B, C
	//   }));

	//   setSessions(sessionsWithClass);
	//   setParticles(generateParticles(50));
	// }, [user, navigate]);

	if (!user || !myStudent) {
		return null; // Or a loading spinner
	}

	const classNames = [...new Set(sessions.map((s) => s.className))];

	const filteredSessions = sessions.filter(
		(session) => filterClass === 'all' || session.className === filterClass
	);

	const markPresentManual = () => {
		const currentSessionId = localStorage.getItem('attend_currentSession');
		if (!currentSessionId) {
			alert('No active session. Admin must start a new session.');
			return;
		}

		if (myStudent.attendedSessions.includes(currentSessionId)) {
			alert('Already marked present for this session.');
			return;
		}

		// Simulate marking present by updating local storage
		const updatedStudent = {
			...myStudent,
			attendedSessions: [...myStudent.attendedSessions, currentSessionId],
		};

		const storedStudents =
			JSON.parse(localStorage.getItem('attend_students')) || [];
		const studentIndex = storedStudents.findIndex((s) => s.id === myStudent.id);
		if (studentIndex > -1) {
			storedStudents[studentIndex] = updatedStudent;
			localStorage.setItem('attend_students', JSON.stringify(storedStudents));
			setMyStudent(updatedStudent); // Update state to trigger re-render
			alert('Marked present ✅');
		}
	};

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

	// Create data for the student-specific attendance chart
	const chartData = sessions.map((session) => {
		const isPresent = (myStudent.attendedSessions || []).includes(session.id);
		return {
			name: new Date(session.createdAt).toLocaleDateString(),
			'Attendance %': isPresent ? 100 : 0,
		};
	});

	return (
		<div
			className="font-sans antialiased text-gray-800 dark:text-gray-100 min-h-screen flex flex-col relative overflow-hidden"
			style={{
				background: 'linear-gradient(135deg, #1f2937, #374151)',
			}}
		>
			<div className="absolute top-0 left-0 w-full h-full animate-pulse-slow bg-gradient-to-br from-indigo-500/20 to-purple-500/20 opacity-40 mix-blend-multiply pointer-events-none z-10" />

			{/* --- PARTICLE ANIMATION CONTAINER --- */}
			<div className="particle-container">
				{particles.map((particle) => (
					<div
						key={particle.id}
						className="particle"
						style={{
							width: particle.size,
							height: particle.size,
							left: particle.left,
							animationDuration: particle.animationDuration,
							animationDelay: particle.animationDelay,
						}}
					/>
				))}
			</div>

			<Navbar />
			<main className="flex-grow pt-24 pb-12">
				<div className="max-w-7xl mx-auto px-6">
					<motion.h2
						initial={{ opacity: 0, x: -100 }}
						animate={{ opacity: 1, x: 0 }}
						transition={{ duration: 0.8, ease: 'easeOut' }}
						className="text-4xl md:text-6xl font-extrabold text-center mb-12 bg-clip-text text-transparent bg-gradient-to-r from-indigo-600 to-purple-600 dark:from-indigo-400 dark:to-purple-400"
					>
						My Dashboard
					</motion.h2>

					<motion.div
						className="relative"
						variants={floatAnimation}
						initial="initial"
						animate="animate"
					>
						<div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
							{/* Main Content Area - Left Side */}
							<div className="lg:col-span-2 space-y-8">
								{/* Welcome Card */}
								<motion.div
									initial={{ opacity: 0, y: 20 }}
									animate={{ opacity: 1, y: 0 }}
									transition={{ duration: 0.8 }}
									className="bg-white/60 dark:bg-gray-800/60 backdrop-blur-md rounded-2xl p-8 shadow-lg border border-white/20 dark:border-gray-700/50"
								>
									<h3 className="font-bold text-2xl text-indigo-700 dark:text-indigo-400 mb-2">
										Welcome, {user.name}! 👋
									</h3>
									<p className="text-gray-600 dark:text-gray-300">
										Your personalized attendance and analytics are ready.
									</p>
								</motion.div>

								{/* Attendance Progress Card */}
								<motion.div
									initial={{ opacity: 0, y: 20 }}
									animate={{ opacity: 1, y: 0 }}
									transition={{ duration: 0.8, delay: 0.2 }}
								>
									<AttendanceProgress
										myStudent={myStudent}
										sessions={sessions}
									/>
								</motion.div>

								{/* --- STUDENT ATTENDANCE TREND CHART --- */}
								<motion.div
									initial={{ opacity: 0, y: 20 }}
									animate={{ opacity: 1, y: 0 }}
									transition={{ duration: 0.8, delay: 0.3 }}
									className="bg-white/60 dark:bg-gray-800/60 backdrop-blur-md rounded-2xl p-8 shadow-lg border border-white/20 dark:border-gray-700/50"
								>
									<h3 className="font-bold text-2xl text-indigo-700 dark:text-indigo-400 mb-2">
										My Attendance Trend
									</h3>
									<p className="text-sm text-gray-500 dark:text-gray-400 mb-6">
										A visual history of your presence in all sessions.
									</p>
									{chartData.length ? (
										<div style={{ height: 260 }}>
											<ResponsiveContainer width="100%" height="100%">
												<LineChart data={chartData}>
													<CartesianGrid
														strokeDasharray="3 3"
														strokeOpacity={0.5}
													/>
													<XAxis dataKey="name" stroke="#888" />
													<YAxis stroke="#888" />
													<Tooltip content={<CustomTooltip />} />
													<Line
														type="monotone"
														dataKey="Attendance %"
														stroke="url(#studentLineGradient)"
														strokeWidth={3}
														dot={{ stroke: '#8b5cf6', strokeWidth: 2, r: 5 }}
														activeDot={{
															r: 8,
															stroke: '#8b5cf6',
															strokeWidth: 2,
														}}
														isAnimationActive={true}
														animationDuration={1500}
														animationEasing="ease-in-out"
													/>
												</LineChart>
											</ResponsiveContainer>
										</div>
									) : (
										<div className="min-h-[260px] flex items-center justify-center">
											<p className="text-md text-gray-500 dark:text-gray-400">
												No sessions yet — attend your first class to see your
												trend.
											</p>
										</div>
									)}
								</motion.div>

								{/* --- ATTENDANCE HISTORY & ASSESSMENT --- */}
								<div className="bg-white/60 dark:bg-gray-800/60 backdrop-blur-md rounded-2xl p-6 shadow-lg border border-white/20 dark:border-gray-700/50">
									<div className="flex justify-between items-center mb-4">
										<h4 className="font-semibold text-lg">My Sessions</h4>
										<select
											className="text-sm bg-gray-100 dark:bg-gray-700 rounded-md py-1 px-2 border border-gray-300 dark:border-gray-600"
											value={filterClass}
											onChange={(e) => setFilterClass(e.target.value)}
										>
											<option value="all">All Classes</option>
											{classNames.map((name, index) => (
												<option key={index} value={name}>
													{name}
												</option>
											))}
										</select>
									</div>
									<motion.ul
										variants={containerVariants}
										initial="hidden"
										animate="visible"
										className="space-y-3 max-h-80 overflow-y-auto pr-2"
									>
										<AnimatePresence>
											{filteredSessions.length > 0 ? (
												filteredSessions.map((session) => (
													<motion.li
														key={session.id}
														variants={itemVariants}
														className="p-3 rounded-lg shadow-sm flex items-center justify-between transition-colors"
														whileHover={{
															scale: 1.01,
															backgroundColor: 'rgba(255, 255, 255, 0.1)',
														}}
														style={{
															backgroundColor:
																myStudent.attendedSessions.includes(session.id)
																	? 'rgba(34, 197, 94, 0.1)' // green-500
																	: 'rgba(239, 68, 68, 0.1)', // red-500
														}}
													>
														<div className="flex items-center">
															<span
																className={`h-2 w-2 rounded-full mr-3 ${
																	myStudent.attendedSessions.includes(
																		session.id
																	)
																		? 'bg-green-500'
																		: 'bg-red-500'
																}`}
															></span>
															<div>
																<p className="text-sm font-medium">
																	{new Date(
																		session.createdAt
																	).toLocaleDateString()}
																</p>
																<p className="text-xs text-gray-500 dark:text-gray-400">
																	{session.className}
																</p>
															</div>
														</div>
														<span className="text-sm font-bold">
															{myStudent.attendedSessions.includes(session.id)
																? 'Present'
																: 'Absent'}
														</span>
													</motion.li>
												))
											) : (
												<motion.li
													initial={{ opacity: 0 }}
													animate={{ opacity: 1 }}
													className="text-center text-gray-500 dark:text-gray-400 py-4"
												>
													No sessions found for this class.
												</motion.li>
											)}
										</AnimatePresence>
									</motion.ul>
								</div>
							</div>

							{/* Sidebar for Student - Right Side */}
							<div className="space-y-8">
								{/* Notifications Card */}
								<motion.div
									initial={{ opacity: 0, y: 20 }}
									animate={{ opacity: 1, y: 0 }}
									transition={{ duration: 0.8, delay: 0.4 }}
									className="bg-white/60 dark:bg-gray-800/60 backdrop-blur-md rounded-2xl p-6 shadow-lg border border-white/20 dark:border-gray-700/50"
								>
									<h4 className="font-semibold text-lg mb-2">Notifications</h4>
									<div
										className={`text-sm py-2 px-3 rounded-lg border ${
											((myStudent?.attendedSessions?.length || 0) /
												(sessions?.length || 1)) *
												100 <
											75
												? 'bg-red-50 text-red-700 border-red-300 dark:bg-red-950 dark:border-red-800 dark:text-red-300'
												: 'bg-green-50 text-green-700 border-green-300 dark:bg-green-950 dark:border-green-800 dark:text-green-300'
										}`}
									>
										{((myStudent?.attendedSessions?.length || 0) /
											(sessions?.length || 1)) *
											100 <
										75 ? (
											<span>
												⚠️ Your attendance is below 75%. Please attend classes
												regularly.
											</span>
										) : (
											<span>✅ Your attendance is on track. Great job!</span>
										)}
									</div>
								</motion.div>

								{/* Quick Actions Card */}
								<motion.div
									initial={{ opacity: 0, scale: 0.95 }}
									animate={{ opacity: 1, scale: 1 }}
									transition={{ duration: 0.6, delay: 0.2 }}
									whileHover={{ scale: 1.02 }}
									className="bg-white/60 dark:bg-gray-800/60 backdrop-blur-md rounded-2xl p-6 shadow-lg border border-white/20 dark:border-gray-700/50"
								>
									<h4 className="font-semibold text-lg mb-4">Quick Actions</h4>
									<div className="space-y-3">
										<motion.button
											whileHover={{ scale: 1.01 }}
											whileTap={{ scale: 0.99 }}
											onClick={markPresentManual}
											className="w-full py-3 px-4 rounded-full bg-indigo-600 text-white font-semibold hover:bg-indigo-700 transition transform"
										>
											Mark Present
										</motion.button>
										<motion.button
											whileHover={{ scale: 1.01 }}
											whileTap={{ scale: 0.99 }}
											onClick={() => navigate('/complaint')}
											className="w-full py-3 px-4 rounded-full bg-transparent border-2 border-indigo-600 text-indigo-600 font-semibold hover:bg-indigo-50 transition dark:text-indigo-400 dark:border-indigo-400 dark:hover:bg-indigo-900/40"
										>
											Raise a Complaint
										</motion.button>
										{/* ADDED 'View Profile' button */}
										<motion.button
											whileHover={{ scale: 1.01 }}
											whileTap={{ scale: 0.99 }}
											onClick={() => navigate('/profile')}
											className="w-full py-3 px-4 rounded-full bg-transparent border-2 border-gray-300 text-gray-600 font-semibold hover:bg-gray-100 transition dark:border-gray-600 dark:text-gray-300 dark:hover:bg-gray-700"
										>
											View Profile
										</motion.button>
									</div>
								</motion.div>
							</div>
						</div>
					</motion.div>
				</div>
			</main>
			<Footer />
			{/* Required for the chart gradient fill */}
			<svg className="hidden">
				<defs>
					<linearGradient id="studentLineGradient" x1="0" y1="0" x2="1" y2="0">
						<stop offset="0%" stopColor="#4c51bf" /> {/* Indigo-600 */}
						<stop offset="100%" stopColor="#d53f8c" /> {/* Pink-600 */}
					</linearGradient>
				</defs>
			</svg>
			{/* Required for the particle animation */}
			<style>{`
        @keyframes pulse-slow {
          0%, 100% { opacity: 0.4; }
          50% { opacity: 0.6; }
        }
        .animate-pulse-slow { animation: pulse-slow 10s infinite ease-in-out; }
        .particle-container {
          position: absolute;
          top: 0;
          left: 0;
          width: 100%;
          height: 100%;
          overflow: hidden;
          z-index: 0;
          pointer-events: none;
        }
        .particle {
          position: absolute;
          background-color: rgba(147, 197, 253, 0.4);
          border-radius: 50%;
          animation: floatAndFade infinite ease-in-out both;
        }
        @keyframes floatAndFade {
          0% { transform: translateY(0) scale(0); opacity: 0; }
          20% { opacity: 0.2; transform: translateY(-20%) scale(0.6); }
          50% { opacity: 0.6; transform: translateY(-50%) scale(1); }
          80% { opacity: 0.2; transform: translateY(-80%) scale(0.6); }
          100% { transform: translateY(-100%) scale(0); opacity: 0; }
        }
      `}</style>
		</div>
	);
}
