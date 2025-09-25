import { configureStore } from '@reduxjs/toolkit';

import authReducer from '../features/auth/authSlice.js';
import recordReducer from '../features/attendanceRecord/recordsSlice.js';

export const store = configureStore({
	reducer: {
		auth: authReducer,
		records: recordReducer,
	},
});
