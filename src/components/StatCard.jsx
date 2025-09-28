import { motion } from 'framer-motion';

export const StatCard = ({ title, value, unit, delay = 0.2, colors }) => (
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
