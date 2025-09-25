import supabase from '../supabase';
import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';

const enrolled = JSON.parse(localStorage.getItem('enrolled'));
const attendance = JSON.parse(localStorage.getItem('attendance'));
const sessions = JSON.parse(localStorage.getItem('sessions'));
const students = JSON.parse(localStorage.getItem('students'));

const initialState = {
	students: students ? students : [],
	attendance: attendance ? attendance : [],
	enrolled: enrolled ? enrolled : [],
	sessions: sessions ? sessions : [],
	isError: false,
	isLoading: false,
	isSuccess: false,
	message: '',
};

export const getStudents = createAsyncThunk(
	'students/enrolled',
	async (class_id) => {
		const {
			data: { user },
		} = await supabase.auth.getUser();

		const {
			data: { role },
		} = await supabase.from('roles').select('role').eq('id', user.id).single();

		if (role != 'faculty')
			return thunkAPI.rejectWithValue(
				'Only faculty can access enrolled students.'
			);

		const { data, error } = await supabase.rpc('get_enrolled_students', {
			p_class_id: class_id,
		});

		if (error) return thunkAPI.rejectWithValue(error.message);

		localStorage.setItem('students', JSON.stringify(data));

		return data;
	}
);

export const getStudentsAttendance = createAsyncThunk(
	'student/attendance',
	async (classId, thunkAPI) => {
		const {
			data: { user },
		} = await supabase.auth.getUser();

		if (!user) return thunkAPI.rejectWithValue('No authenticated user');

		const studentUid = user.id;

		const {
			data: { role },
		} = await supabase.from('roles').select('role').single();

		if (role === 'faculty') {
			const { data, error } = await supabase.rpc('get_class_attendance', {
				p_class_id: classId,
			});

			if (error) return thunkAPI.rejectWithValue(error.message);

			localStorage.setItem('attendance', JSON.stringify(data));

			return data;
		}

		const { data, error } = await supabase.rpc('get_student_class_attendance', {
			p_student_id: studentUid,
			p_class_id: classId,
		});

		if (error) {
			return thunkAPI.rejectWithValue(error.message);
		}

		localStorage.setItem('attendance', JSON.stringify(data));

		return data;
	}
);

export const getEnrolled = createAsyncThunk('/enrolled', async (thunkAPI) => {
	const {
		data: { user },
	} = await supabase.auth.getUser();

	if (!user) return thunkAPI.rejectWithValue('No user found.');

	const { data, error } = await supabase
		.from('enrollment')
		.select('class_id, classes (class_name)');

	if (error) return thunkAPI.rejectWithValue(error.message);

	localStorage.setItem('enrolled', JSON.stringify(data));

	return data;
});

export const getClassSessions = createAsyncThunk(
	'sessions',
	async (class_id) => {
		// Authenticate the user to ensure they are logged in.
		const {
			data: { user },
		} = await supabase.auth.getUser();

		// If no user is authenticated, return an error message.
		if (!user) {
			return 'User does not exist!';
		}

		// Query the 'Sessions' table to get all sessions
		// that match the provided class_id.
		const { data, error } = await supabase
			.from('sessions')
			.select('*')
			.eq('class_id', class_id);

		// If there was a database error, return a generic error message.
		if (error) {
			return 'Error loading sessions';
		}

		localStorage.setItem('sessions', JSON.stringify(data));

		// The 'data' returned from Supabase is an array-like object, not a
		// true JavaScript Array. This converts it into a proper array
		// so it can be used with array methods like .map() or .length.
		return data;
	}
);

const recordSlice = createSlice({
	name: 'records',
	initialState,
	reducers: {
		reset: (state) => {
			(state.isError = false), (state.isLoading = false);
			state.isSuccess = false;
			state.message = null;
		},
	},
	extraReducers: (builder) => {
		builder
			.addCase(getStudentsAttendance.pending, (state) => {
				state.isLoading = true;
				state.isSuccess = false;
				state.isError = false;
			})
			.addCase(getStudentsAttendance.rejected, (state, action) => {
				state.isLoading = false;
				state.isSuccess = false;
				state.isError = true;
				state.message = action.payload;
				localStorage.removeItem('attendance');
			})
			.addCase(getStudentsAttendance.fulfilled, (state, action) => {
				state.isLoading = false;
				state.isSuccess = true;
				state.isError = false;
				state.attendance = action.payload;
			})
			.addCase(getEnrolled.pending, (state) => {
				state.isLoading = true;
				state.isSuccess = false;
				state.isError = false;
			})
			.addCase(getEnrolled.rejected, (state, action) => {
				state.isLoading = false;
				state.isSuccess = false;
				state.isError = true;
				state.message = action.payload;
				localStorage.removeItem('enrolled');
			})
			.addCase(getClassSessions.fulfilled, (state, action) => {
				state.isLoading = false;
				state.isSuccess = true;
				state.isError = false;
				state.sessions = action.payload;
			})
			.addCase(getClassSessions.pending, (state) => {
				state.isLoading = true;
				state.isSuccess = false;
				state.isError = false;
			})
			.addCase(getClassSessions.rejected, (state, action) => {
				state.isLoading = false;
				state.isSuccess = false;
				state.isError = true;
				state.message = action.payload;
				localStorage.removeItem('sessions');
			})
			.addCase(getStudents.fulfilled, (state, action) => {
				state.isLoading = false;
				state.isSuccess = true;
				state.isError = false;
				state.students = action.payload;
			})
			.addCase(getStudents.pending, (state) => {
				state.isLoading = true;
				state.isSuccess = false;
				state.isError = false;
			})
			.addCase(getStudents.rejected, (state, action) => {
				state.isLoading = false;
				state.isSuccess = false;
				state.isError = true;
				state.message = action.payload;
				localStorage.removeItem('students');
			});
	},
});

export const { reset } = recordSlice.actions;

export default recordSlice.reducer;
