import { motion } from 'framer-motion';
import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import {
	getClassSessions,
	getEnrolled,
	getStudentsAttendance,
	reset,
} from '../features/attendanceRecord/recordsSlice';

const StudentDashboard = () => {
	const dispatch = useDispatch();

	const { user } = useSelector((state) => state.auth);
	const {
		enrolled,
		sessions,
		attendance,
		isError,
		isSuccess,
		isLoading,
		message,
	} = useSelector((state) => state.records);

	const [subject, setSubject] = useState(
		localStorage.getItem('subject') ? localStorage.getItem('subject') : null
	);

	const totalSessions = sessions?.length;
	const attendedSessions = attendance?.filter(
		(record) => record.present === true
	).length;
	const attendancePercentage =
		totalSessions > 0 ? (attendedSessions / totalSessions) * 100 : 0;

	let name = user ? user.email : 'Guest';
	if (user) {
		name = name.split('_')[0];
		name = name[0].toUpperCase() + name.slice(1);
	}

	const handleChange = (e) => {
		setSubject(e.target.value);
		dispatch(getClassSessions(subject));
		dispatch(getStudentsAttendance(subject));
	};

	useEffect(() => {
		dispatch(getEnrolled());
	}, [dispatch]);

	useEffect(() => {
		if (isSuccess) dispatch(reset());
	}, [dispatch]);

	useEffect(() => {
		localStorage.setItem('subject', subject);
	}, [subject]);

	const AttendanceProgress = () => {
		let progressColor = 'bg-green-500';
		let textColor = 'text-green-500';
		if (attendancePercentage < 75 && attendancePercentage >= 50) {
			progressColor = 'bg-orange-500';
			textColor = 'text-orange-500';
		} else if (attendancePercentage < 50) {
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

	return (
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
							</div>
						)}
					</div>
					<motion.div
						initial={{ opacity: 0, y: 20 }}
						animate={{ opacity: 1, y: 0 }}
						transition={{ duration: 0.8, delay: 0.2 }}
					>
						{subject && <AttendanceProgress />}
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
								attendancePercentage < 75
									? 'bg-red-50 text-red-700 border-red-300 dark:bg-red-950 dark:border-red-800 dark:text-red-300'
									: 'bg-green-50 text-green-700 border-green-300 dark:bg-green-950 dark:border-green-800 dark:text-green-300'
							}`}
						>
							{attendancePercentage < 75 ? (
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
};

export default StudentDashboard;
