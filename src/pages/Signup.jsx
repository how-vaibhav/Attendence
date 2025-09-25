import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import { useSelector, useDispatch } from 'react-redux';
import { register, reset } from '../features/auth/authSlice.js';

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

export default function Signup() {
	const dispatch = useDispatch();
	const navigate = useNavigate();
	const [email, setEmail] = useState('');
	const [password, setPassword] = useState('');
	const [particles, setParticles] = useState([]);
	let error, errMessage;

	// Corrected: Moved the useSelector hook here so 'user' is available
	const { user, isError, isSuccess, isLoading, message } = useSelector(
		(state) => state.auth
	);

	useEffect(() => {
		if (user && isSuccess) {
			dispatch(reset());
			navigate('/');
		}
		if (user) navigate('/');
	}, [user, isSuccess, navigate, dispatch]);

	useEffect(() => {
		setParticles(generateParticles(50));
	}, []);

	async function handle(e) {
		e.preventDefault();
		const userData = { email, password };
		dispatch(register(userData));
	}

	// Framer Motion variants for the form card
	const formVariants = {
		hidden: { opacity: 0, y: 50 },
		visible: { opacity: 1, y: 0, transition: { duration: 0.8 } },
	};

	const headingVariants = {
		hidden: { opacity: 0, y: -20 },
		visible: { opacity: 1, y: 0, transition: { delay: 0.2, duration: 0.6 } },
	};

	const inputGroupVariants = {
		visible: {
			transition: {
				staggerChildren: 0.1,
			},
		},
	};

	const inputItemVariants = {
		hidden: { opacity: 0, y: 20 },
		visible: { opacity: 1, y: 0 },
	};

	return (
		<div
			className="font-sans antialiased text-gray-800 dark:text-gray-100 min-h-screen flex flex-col relative overflow-hidden"
			style={{
				background: 'linear-gradient(135deg, #1f2937, #374151)',
			}}
		>
			<div className="absolute top-0 left-0 w-full h-full animate-pulse-slow bg-gradient-to-br from-indigo-500/20 to-purple-500/20 opacity-40 mix-blend-multiply pointer-events-none z-10" />

			{/* Particle Animation Container */}
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

			<div className="flex-grow flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8 relative z-20 mt-10">
				<motion.div
					className="max-w-md w-full space-y-8 p-10 bg-white/60 dark:bg-gray-800/60 rounded-3xl shadow-2xl border border-gray-200/50 dark:border-gray-700/50 backdrop-blur-xl"
					variants={formVariants}
					initial="hidden"
					animate="visible"
				>
					<div className="text-center">
						<motion.h2
							className="mt-6 text-3xl font-extrabold bg-clip-text text-transparent bg-gradient-to-r from-indigo-600 to-purple-600 dark:from-indigo-400 dark:to-purple-400"
							variants={headingVariants}
							initial="hidden"
							animate="visible"
						>
							Create Account
						</motion.h2>
						<p className="mt-2 text-sm text-gray-600 dark:text-gray-400">
							Select your role to continue
						</p>
					</div>
					<form className="mt-8 space-y-6" onSubmit={handle}>
						<motion.div
							className="rounded-md shadow-sm"
							variants={inputGroupVariants}
							initial="hidden"
							animate="visible"
						>
							<motion.div variants={inputItemVariants}>
								<input
									required
									value={email}
									onChange={(e) => setEmail(e.target.value)}
									placeholder="Email"
									className="appearance-none relative block w-full px-4 py-3 border border-gray-300 dark:border-gray-600 placeholder-gray-500 dark:placeholder-gray-400 text-gray-900 dark:text-white focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 focus:z-10 sm:text-sm bg-gray-100 dark:bg-gray-700 transition"
								/>
							</motion.div>
							<motion.div variants={inputItemVariants}>
								<input
									required
									value={password}
									onChange={(e) => setPassword(e.target.value)}
									type="password"
									placeholder="Password"
									className="appearance-none relative block w-full px-4 py-3 border border-gray-300 dark:border-gray-600 placeholder-gray-500 dark:placeholder-gray-400 text-gray-900 dark:text-white focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 focus:z-10 sm:text-sm bg-gray-100 dark:bg-gray-700 transition"
								/>
							</motion.div>
						</motion.div>

						<div>
							<motion.button
								type="submit"
								disabled={isLoading}
								whileHover={{ scale: 1.02 }}
								whileTap={{ scale: 0.98 }}
								className="group relative w-full flex justify-center py-3 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
							>
								{isLoading ? 'Creating Account...' : 'Create Account'}
							</motion.button>
						</div>
					</form>
					<AnimatePresence>
						{isError && (
							<motion.p
								initial={{ opacity: 0, y: -10 }}
								animate={{ opacity: 1, y: 0 }}
								exit={{ opacity: 0, y: -10 }}
								className="mt-2 text-center text-red-600 dark:text-red-400 text-sm font-semibold"
							>
								{errMessage}
							</motion.p>
						)}
					</AnimatePresence>
					<div className="text-sm text-center">
						<p className="text-gray-600 dark:text-gray-400">
							Already have an account?{' '}
							<Link
								to="/login"
								className="font-medium text-indigo-600 hover:text-indigo-500 dark:text-indigo-400 dark:hover:text-indigo-300"
							>
								Login
							</Link>
						</p>
					</div>
				</motion.div>
			</div>

			<Footer />
		</div>
	);
}
