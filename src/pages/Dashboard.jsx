import { useEffect, useMemo, useState } from 'react';
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
import QRGenerator from '../components/QRGenerator';
import { useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import {
	getClassSessions,
	getEnrolled,
	getStudents,
	getStudentsAttendance,
	reset,
} from '../features/attendanceRecord/recordsSlice';

let attendanceP;
// --- NEW COMPONENT: ANIMATED STAT CARD ---
const StatCard = ({ title, value, unit, delay = 0.2, colors }) => (
	<motion.div
		initial={{ opacity: 0, scale: 0.95 }}
		animate={{ opacity: 1, scale: 1 }}
		transition={{ duration: 0.6, delay }}
		whileHover={{ y: -5, scale: 1.05 }}
		className={`bg-white/60 dark:bg-gray-800/60 backdrop-blur-md rounded-2xl p-6 shadow-lg border border-white/20 dark:border-gray-700/50 ${colors.bg}`}
	>
		<p className="text-sm font-medium text-gray-600 dark:text-gray-300">
			{title}
		</p>
		<h3 className={`text-3xl font-extrabold mt-1 ${colors.text}`}>
			<span className="count-up">{value}</span>
			<span className="text-xl font-semibold text-gray-700 dark:text-gray-200 ml-1">
				{unit}
			</span>
		</h3>
	</motion.div>
);

// Animated attendance progress bar for students
const AttendanceProgress = ({ class_code }) => {
	const dispatch = useDispatch();
	const { attendance, sessions } = useSelector((state) => state.records);
	if (class_code === null) return null;

	useEffect(() => {
		if (class_code) {
			dispatch(reset());
			dispatch(getClassSessions(class_code));
			dispatch(getStudentsAttendance(class_code));
		}
	}, [dispatch, class_code]);

	const totalSessions = sessions?.length || 0;
	const attendedSessions = attendance?.length || 0;
	const attendancePercentage =
		totalSessions > 0 ? (attendedSessions / totalSessions) * 100 : 0;

	let progressColor = 'bg-green-500';
	let textColor = 'text-green-500';
	if (attendancePercentage < 75 && attendancePercentage >= 50) {
		progressColor = 'bg-orange-500';
		textColor = 'text-orange-500';
	} else if (attendancePercentage < 50) {
		progressColor = 'bg-red-500';
		textColor = 'text-red-500';
	}
	attendanceP = attendancePercentage;

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

// Custom Tooltip for Recharts
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

// Student Card component with new hover effects
const NewStudentCard = ({ name }) => (
	<motion.div
		className={`p-4 rounded-xl shadow-lg bg-white dark:bg-gray-800 transition-colors border border-gray-200 dark:border-gray-700 `}
		whileHover={{ y: -4, scale: 1.01 }}
	>
		<h4 className="text-md font-bold">{name}</h4>
	</motion.div>
);

// Variants for list staggering animation
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

export default function Dashboard() {
	const dispatch = useDispatch();
	const navigate = useNavigate();
	const [subject, setSubject] = useState(
		localStorage.getItem('subject') ? localStorage.getItem('subject') : null
	);
	const [myStudent, setMyStudent] = useState(null);

	const [chartData, setChartData] = useState([]);

	const { user } = useSelector((state) => state.auth);
	const {
		students,
		sessions = [],
		attendance = [],
		enrolled,
		isError,
		isSuccess,
		isLoading,
	} = useSelector((state) => state.records);

	useEffect(() => {
		if (!user) navigate('/signup');
	}, [user, navigate]);
	useEffect(() => {
		dispatch(getEnrolled());
	}, [dispatch]);

	useEffect(() => {
		localStorage.setItem('subject', subject);
	}, [subject]);

	useEffect(() => {
		if (isSuccess) {
			dispatch(reset());
		}
	}, [isSuccess, dispatch, reset]);

	const onNavigate = (newPath) => {
		navigate(newPath);
		window.scrollTo({ top: 0, behavior: 'smooth' });
	};

	useEffect(() => {
		if (!sessions || !students || !attendance) return;

		// Take last 7 sessions
		const last7Sessions = Array.isArray(sessions) ? sessions.slice(-7) : [];

		const data = last7Sessions.map((sess) => {
			// Exclude logged-in user from total count
			const totalStudents = students.filter(
				(s) => s.user_id !== user?.id
			).length;

			// Count students who were present in this session
			const attendCount = attendance.filter(
				(att) =>
					att.session_id === sess.session_id &&
					att.present &&
					att.student_id !== user?.id // optional: exclude self if needed
			).length;

			return {
				name: sess.date
					? new Date(sess.date).toLocaleDateString()
					: `Session ${sess.session_id}`, // fallback if date is null
				'Attendance %':
					totalStudents > 0
						? Math.round((attendCount / totalStudents) * 100)
						: 0,
			};
		});

		setChartData(data);
	}, [sessions, students, attendance]);

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

	const handleChange = (e) => {
		setSubject(e.target.value);
	};

	const handleFaculty = (e) => {
		setSubject(e.target.value);
		dispatch(getStudents(subject));
		dispatch(getClassSessions(subject));
		dispatch(getStudentsAttendance(subject));
	};

	let name = user ? user.email : 'Guest';
	if (user) {
		name = name.split('_')[0];
		name = name[0].toUpperCase() + name.slice(1);
	}

	const dashboardContent =
		user?.role === 'faculty' ? (
			<>
				<div className="mb-15">
					{enrolled?.length === 0 ? (
						<p>Not enrolled.</p>
					) : (
						<div className="relative w-full max-w-3xl mx-auto">
							<select
								id="class-select"
								value={subject}
								onChange={handleFaculty}
								disabled={!enrolled || enrolled.length === 0}
								className="block w-full px-6 py-4 pr-12 text-gray-700 dark:text-gray-200 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-700 rounded-xl shadow-md focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 cursor-pointer transition-colors disabled:opacity-50 disabled:cursor-not-allowed text-lg"
							>
								<option value="" disabled>
									Select Class
								</option>
								{[
									...new Map(enrolled.map((e) => [e.class_id, e])).values(),
								].map((enr) => (
									<option value={enr.class_id} key={enr.class_id}>
										{enr.classes.class_name}
									</option>
								))}
							</select>

							{/* Down arrow icon */}
							<div className="pointer-events-none absolute inset-y-0 right-4 flex items-center text-gray-400">
								<svg
									className="h-6 w-6"
									xmlns="http://www.w3.org/2000/svg"
									viewBox="0 0 20 20"
									fill="currentColor"
								>
									<path
										fillRule="evenodd"
										d="M5.23 7.21a.75.75 0 011.06.02L10 10.94l3.71-3.71a.75.75 0 111.08 1.04l-4.25 4.25a.75.75 0 01-1.08 0L5.21 8.27a.75.75 0 01.02-1.06z"
										clipRule="evenodd"
									/>
								</svg>
							</div>
						</div>
					)}
				</div>
				<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
					<StatCard
						title="Total Students"
						value={students.length - 1}
						unit=""
						colors={{
							bg: 'bg-indigo-50/70 dark:bg-indigo-950/70',
							text: 'text-indigo-600 dark:text-indigo-400',
						}}
						delay={0.1}
					/>
					<StatCard
						title="Total Sessions"
						value={sessions.length}
						unit=""
						colors={{
							bg: 'bg-green-50/70 dark:bg-green-950/70',
							text: 'text-green-600 dark:text-green-400',
						}}
						delay={0.2}
					/>
					<StatCard
						title="Average Attendance"
						value={
							chartData.length
								? (
										chartData.reduce(
											(acc, curr) => acc + curr['Attendance %'],
											0
										) / chartData.length
								  ).toFixed(0)
								: 0
						}
						unit="%"
						colors={{
							bg: 'bg-purple-50/70 dark:bg-purple-950/70',
							text: 'text-purple-600 dark:text-purple-400',
						}}
						delay={0.3}
					/>
				</div>

				<div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
					<div className="lg:col-span-2 space-y-8">
						<motion.div
							initial={{ opacity: 0, y: 20 }}
							animate={{ opacity: 1, y: 0 }}
							transition={{ duration: 0.8 }}
							className="bg-white/60 dark:bg-gray-800/60 backdrop-blur-md rounded-2xl p-8 shadow-lg border border-white/20 dark:border-gray-700/50"
						>
							<h3 className="font-bold text-2xl text-indigo-700 dark:text-indigo-400 mb-2">
								Class Attendance Trend
							</h3>
							<p className="text-sm text-gray-500 dark:text-gray-400 mb-6">
								Insights from the last 7 sessions.
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
												stroke="url(#colorLineGradient)"
												strokeWidth={4}
												dot={{ stroke: '#8b5cf6', strokeWidth: 2, r: 5 }}
												activeDot={{ r: 8, stroke: '#8b5cf6', strokeWidth: 2 }}
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
										No sessions yet — start a session to view analytics.
									</p>
								</div>
							)}
						</motion.div>
						<div className="mt-8">
							<h3 className="font-bold text-2xl text-gray-800 dark:text-gray-100 mb-4">
								Student List
							</h3>
							<motion.div
								variants={containerVariants}
								initial="hidden"
								animate="visible"
								className="grid md:grid-cols-2 gap-6"
							>
								{students
									.filter((s) => s.user_id !== user?.id) // exclude logged-in user
									.map((s) => (
										<motion.div key={s.user_id} variants={itemVariants}>
											<NewStudentCard name={s.role_name} />
										</motion.div>
									))}
							</motion.div>
							{!students.length && (
								<p className="text-center text-gray-500 dark:text-gray-400 mt-8">
									No students enrolled yet.
								</p>
							)}
						</div>
					</div>
					<div className="space-y-8">
						<motion.div
							initial={{ opacity: 0, scale: 0.95 }}
							animate={{ opacity: 1, scale: 1 }}
							transition={{ duration: 0.6, delay: 0.2 }}
							whileHover={{ scale: 1.02 }}
						>
							<QRGenerator />
						</motion.div>
						<motion.div
							initial={{ opacity: 0, scale: 0.95 }}
							animate={{ opacity: 1, scale: 1 }}
							transition={{ duration: 0.6, delay: 0.3 }}
							whileHover={{ scale: 1.02 }}
							className="bg-white/60 dark:bg-gray-800/60 backdrop-blur-md rounded-2xl p-6 shadow-lg border border-white/20 dark:border-gray-700/50"
						>
							<h4 className="font-semibold text-lg mb-4">Recent Sessions</h4>
							<ul className="space-y-3">
								<AnimatePresence>
									{Array.isArray(sessions) && sessions.length > 0 ? (
										sessions.slice(0, 5).map((s) => (
											<motion.li
												key={s.session_id}
												initial={{ opacity: 0, y: -10 }}
												animate={{ opacity: 1, y: 0 }}
												exit={{ opacity: 0, x: -20 }}
												transition={{ duration: 0.3 }}
												className="p-3 bg-gray-100 dark:bg-gray-700 rounded-md transition-colors"
											>
												{s.date}
											</motion.li>
										))
									) : (
										<li className="text-sm text-gray-500 dark:text-gray-400">
											No sessions yet.
										</li>
									)}
								</AnimatePresence>
							</ul>
						</motion.div>
					</div>
				</div>
			</>
		) : (
			// Student View
			<>
				<div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
					<div className="lg:col-span-2 space-y-8">
						<motion.div
							initial={{ opacity: 0, y: 20 }}
							animate={{ opacity: 1, y: 0 }}
							transition={{ duration: 0.8 }}
							className="bg-white/60 dark:bg-gray-800/60 backdrop-blur-md rounded-2xl p-8 shadow-lg border border-white/20 dark:border-gray-700/50"
						>
							<h3 className="font-bold text-2xl text-indigo-700 dark:text-indigo-400 mb-2">
								Welcome, {name}! 👋
							</h3>
							<p className="text-gray-600 dark:text-gray-300">
								Your personalized attendance and analytics are ready.
							</p>
						</motion.div>
						<div>
							{enrolled?.length === 0 ? (
								<p>Not enrolled.</p>
							) : (
								<div className="relative w-full max-w-3xl mx-auto">
									<select
										id="class-select"
										value={subject}
										onChange={handleChange}
										disabled={!enrolled || enrolled.length === 0}
										className="block w-full px-6 py-4 pr-12 text-gray-700 dark:text-gray-200 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-700 rounded-xl shadow-md focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 cursor-pointer transition-colors disabled:opacity-50 disabled:cursor-not-allowed text-lg"
									>
										<option value="" disabled>
											Select Class
										</option>
										{enrolled &&
											enrolled.map((enr) => (
												<option value={enr.class_id} key={enr.class_id}>
													{enr.classes.class_name}
												</option>
											))}
									</select>

									{/* Down arrow icon */}
									<div className="pointer-events-none absolute inset-y-0 right-4 flex items-center text-gray-400">
										<svg
											className="h-6 w-6"
											xmlns="http://www.w3.org/2000/svg"
											viewBox="0 0 20 20"
											fill="currentColor"
										>
											<path
												fillRule="evenodd"
												d="M5.23 7.21a.75.75 0 011.06.02L10 10.94l3.71-3.71a.75.75 0 111.08 1.04l-4.25 4.25a.75.75 0 01-1.08 0L5.21 8.27a.75.75 0 01.02-1.06z"
												clipRule="evenodd"
											/>
										</svg>
									</div>
								</div>
							)}
						</div>
						<motion.div
							initial={{ opacity: 0, y: 20 }}
							animate={{ opacity: 1, y: 0 }}
							transition={{ duration: 0.8, delay: 0.2 }}
						>
							{subject && <AttendanceProgress class_code={subject} />}
						</motion.div>
						<motion.div
							initial={{ opacity: 0, y: 20 }}
							animate={{ opacity: 1, y: 0 }}
							transition={{ duration: 0.8, delay: 0.4 }}
							className="bg-white/60 dark:bg-gray-800/60 backdrop-blur-md rounded-2xl p-6 shadow-lg border border-white/20 dark:border-gray-700/50"
						>
							<h4 className="font-semibold text-lg mb-2">Notifications</h4>
							<div
								className={`text-sm py-2 px-3 rounded-lg border ${
									attendanceP < 75
										? 'bg-red-50 text-red-700 border-red-300 dark:bg-red-950 dark:border-red-800 dark:text-red-300'
										: 'bg-green-50 text-green-700 border-green-300 dark:bg-green-950 dark:border-green-800 dark:text-green-300'
								}`}
							>
								{attendanceP < 75 ? (
									<span>
										⚠️ Your attendance is below 75%. Please attend classes
										regularly.
									</span>
								) : (
									<span>✅ Your attendance is on track. Great job!</span>
								)}
							</div>
						</motion.div>
					</div>
					<div className="space-y-8">
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
									// onClick={d}
									className="w-full py-3 px-4 rounded-full bg-indigo-600 text-white font-semibold hover:bg-indigo-700 transition transform"
								>
									Scan & Mark Present
								</motion.button>
								<motion.button
									whileHover={{ scale: 1.01 }}
									whileTap={{ scale: 0.99 }}
									onClick={() => (window.location.href = '/complaint')}
									className="w-full py-3 px-4 rounded-full bg-transparent border-2 border-indigo-600 text-indigo-600 font-semibold hover:bg-indigo-50 transition dark:text-indigo-400 dark:border-indigo-400 dark:hover:bg-indigo-900/40"
								>
									Raise a Complaint
								</motion.button>
								<motion.button
									whileHover={{ scale: 1.01 }}
									whileTap={{ scale: 0.99 }}
									onClick={() => alert('Profile page placeholder')}
									className="w-full py-3 px-4 rounded-full bg-transparent border-2 border-gray-300 text-gray-600 font-semibold hover:bg-gray-100 transition dark:border-gray-600 dark:text-gray-300 dark:hover:bg-gray-700"
								>
									View Profile
								</motion.button>
							</div>
						</motion.div>
					</div>
				</div>
			</>
		);

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
