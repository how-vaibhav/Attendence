import { StatCard } from './StatCard';
import { AnimatePresence, motion } from 'framer-motion';
import {
	CartesianGrid,
	Line,
	LineChart,
	ResponsiveContainer,
	Tooltip,
	XAxis,
	YAxis,
} from 'recharts';
import CustomTooltip from './CustomTooltip';
import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import {
	facultyClasses,
	getClassSessions,
	getStudents,
	getStudentsAttendance,
	reset,
} from '../features/attendanceRecord/recordsSlice';
import QRGenerator from './QRGenerator';

const AdminDashboard = () => {
	const [subject, setSubject] = useState(
		localStorage.getItem('subject') ? localStorage.getItem('subject') : null
	);
	const [avgAttendance, setAvgAttendance] = useState({
		averageAttendance: [],
		classAvg: 0.0,
	});
	const [chartData, setChartData] = useState([]);

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

	const NewStudentCard = ({ name, attendancePercentage, colour }) => (
		<motion.div
			className={`p-4 rounded-xl shadow-lg bg-white dark:bg-gray-800 transition-colors border border-gray-200 dark:border-gray-700 flex`}
			whileHover={{ y: -4, scale: 1.01 }}
		>
			<h4 className="text-md font-bold">{name}</h4>
			<h4 className="text-md font-bold ml-auto">{attendancePercentage}%</h4>
		</motion.div>
	);

	const dispatch = useDispatch();

	const {
		students,
		attendance,
		enrolled,
		sessions,
		isError,
		isLoading,
		isSuccess,
		message,
	} = useSelector((state) => state.records);

	useEffect(() => {
		dispatch(facultyClasses());
	}, [dispatch]);

	useEffect(() => {
		if (isSuccess) dispatch(reset());
	}, [dispatch]);

	useEffect(() => {
		if (!sessions || !students || !attendance) return;

		// Take last 7 sessions
		const last7Sessions = Array.isArray(sessions) ? sessions.slice(-7) : [];

		const totalEnrolledStudents = students.length;

		const data = last7Sessions.map((session) => {
			const sessionAttendance = attendance.filter(
				(record) => record.session_id == session.session_id
			);
			const studentsPresent = sessionAttendance.filter(
				(record) => record.present === true
			).length;

			const divisor = totalEnrolledStudents > 0 ? totalEnrolledStudents : 1;

			const attendancePercentage = Math.round(
				(studentsPresent / divisor) * 100
			);

			return {
				name: session.date
					? new Date(session.date).toLocaleDateString()
					: `Session ${session.session_id}`, // fallback if date is null
				'Attendance %': attendancePercentage,
			};
		});

		setChartData(data);
	}, [sessions, students, attendance]);

	useEffect(() => {
		const totalSessions = sessions.length;

		if (totalSessions === 0)
			return setAvgAttendance({ averageAttendance: [], classAvg: 0.0 });

		const studentAttendanceMap = attendance.reduce((acc, record) => {
			const { student_id, present } = record;

			if (!acc[student_id]) {
				acc[student_id] = { attendedCount: 0, student_id: student_id };
			}

			if (present) acc[student_id].attendedCount += 1;

			return acc;
		}, {});

		const averageAttendance = Object.values(studentAttendanceMap).map(
			(student) => {
				const percentage = (student.attendedCount / totalSessions) * 100;
				return {
					student_id: student.student_id,
					attendance_percentage: parseFloat(percentage.toFixed(2)),
				};
			}
		);

		const totalStudents = averageAttendance.length;

		if (totalStudents === 0) {
			setAvgAttendance({ averageAttendance, classAvg: 0.0 });
			return;
		}

		const sumOfPercentages = averageAttendance.reduce((sum, student) => {
			return sum + student.attendance_percentage;
		}, 0);

		const classAvg = sumOfPercentages / totalStudents;

		setAvgAttendance({ averageAttendance, classAverage: classAvg });
	}, [sessions, attendance]);

	const subjectChange = (e) => {
		setSubject(e.target.value);
		dispatch(getStudents(subject));
		dispatch(getClassSessions(subject));
		dispatch(getStudentsAttendance(subject));
	};

	const studentAverages = avgAttendance.averageAttendance;

	const attendanceLookup = studentAverages.reduce((map, student) => {
		map[student.student_id] = student.attendance_percentage;
		return map;
	}, {});

	return (
		<>
			<div className="mb-15">
				{enrolled?.length === 0 ? (
					<p>Not enrolled.</p>
				) : (
					<div className="relative w-full max-w-3xl mx-auto">
						<select
							id="class-select"
							value={subject}
							onChange={subjectChange}
							disabled={!enrolled || enrolled.length === 0}
							className="block w-full px-6 py-4 pr-12 text-gray-700 dark:text-gray-200 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-700 rounded-xl shadow-md focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 cursor-pointer transition-colors disabled:opacity-50 disabled:cursor-not-allowed text-lg"
						>
							<option value="" disabled>
								Select Class
							</option>
							{[...new Map(enrolled.map((e) => [e.class_id, e])).values()].map(
								(enr) => (
									<option value={enr.class_id} key={enr.class_id}>
										{enr.classes.class_name}
									</option>
								)
							)}
						</select>
					</div>
				)}
			</div>
			<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
				<StatCard
					title="Total Students"
					value={students.length}
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
					value={avgAttendance.classAverage}
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
										<CartesianGrid strokeDasharray="3 3" strokeOpacity={0.5} />
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
							{students.map((s) => {
								const percentage = attendanceLookup[s.user_id];
								const attendanceDisplay =
									percentage !== undefined
										? `${percentage.toFixed(2)}`
										: '0.00%';
								return (
									<motion.div key={s.user_id} variants={itemVariants}>
										<NewStudentCard
											name={s.role_name}
											attendancePercentage={attendanceDisplay}
										/>
									</motion.div>
								);
							})}
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
											Session-{s.session_id} on {s.date}
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
	);
};

export default AdminDashboard;
