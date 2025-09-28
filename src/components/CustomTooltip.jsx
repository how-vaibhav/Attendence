import React from 'react';

const CustomTooltip = ({ active, payload, label }) => {
	if (active && payload && payload.length) {
		return (
			<div className="bg-gray-900/80 dark:bg-gray-200/80 backdrop-blur-md rounded-lg p-4 shadow-lg border border-gray-700 dark:border-gray-300">
				<p className="text-sm font-semibold text-white dark:text-gray-900 mb-1">
					{label} this is custom
				</p>
				<p className="text-xs text-indigo-300 dark:text-indigo-600">{`Attendance: ${payload[0].value}%`}</p>
			</div>
		);
	}
	return null;
};

export default CustomTooltip;
