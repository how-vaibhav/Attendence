import supabase from '../supabase';
import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';

const getRole = (email) => {
	const isStudent = /\d/.test(email.split('@')[0]);

	if (isStudent) return 'student';
	return 'faculty';
};

const user = JSON.parse(localStorage.getItem('user-tally'));

const initialState = {
	user: user ? user : null,
	isError: false,
	isLoading: false,
	isSuccess: false,
	message: '',
};

export const register = createAsyncThunk(
	'auth/signup',
	async (userData, thunkAPI) => {
		const { email, password } = userData;

		const { data, error } = await supabase.auth.signUp({ email, password });

		if (error) return thunkAPI.rejectWithValue(error.message);

		const { user } = data.user;
		const role = getRole(email);

		const cleanUserData = {
			id: user.id,
			email: user.email,
			role: role,
		};

		localStorage.setItem('user-tally', JSON.stringify(cleanUserData));

		return cleanUserData;
	}
);

export const SignIn = createAsyncThunk(
	'auth/signin',
	async (userData, thunkAPI) => {
		const { data, error } = await supabase.auth.signInWithPassword(userData);

		if (error) return thunkAPI.rejectWithValue(error.message);

		const { user } = data;

		const { data: roleData, error: roleError } = await supabase
			.from('roles')
			.select('role')
			.eq('id', user.id)
			.single();

		if (roleError) return thunkAPI.rejectWithValue(roleError.message);

		const cleanUserData = {
			id: user.id,
			email: user.email,
			role: roleData.role,
		};
		return cleanUserData;
	}
);

export const SignOut = createAsyncThunk('auth/signout', async (thunkAPI) => {
	const { error } = await supabase.auth.signOut();

	if (error) return thunkAPI.rejectWithValue(error.message);

	localStorage.removeItem('user-tally');
});

const authSlice = createSlice({
	name: 'auth',
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
			.addCase(register.pending, (state) => {
				state.isLoading = true;
				state.isSuccess = false;
				state.isError = false;
			})
			.addCase(register.rejected, (state, action) => {
				state.isLoading = false;
				state.isSuccess = false;
				state.isError = true;
				state.message = action.payload;
			})
			.addCase(register.fulfilled, (state, action) => {
				state.isLoading = false;
				state.isSuccess = true;
				state.isError = false;
				state.user = action.payload;
			})
			.addCase(SignIn.pending, (state) => {
				state.isLoading = true;
				state.isSuccess = false;
				state.isError = false;
			})
			.addCase(SignIn.rejected, (state, action) => {
				state.isLoading = false;
				state.isSuccess = false;
				state.isError = true;
				state.message = action.payload;
			})
			.addCase(SignIn.fulfilled, (state, action) => {
				state.isLoading = false;
				state.isSuccess = true;
				state.isError = false;
				state.user = action.payload;
			})
			.addCase(SignOut.pending, (state) => {
				state.isLoading = true;
				state.isSuccess = false;
				state.isError = false;
			})
			.addCase(SignOut.rejected, (state, action) => {
				state.isLoading = false;
				state.isSuccess = false;
				state.isError = true;
				state.message = action.payload;
			})
			.addCase(SignOut.fulfilled, (state, action) => {
				state.isLoading = false;
				state.isSuccess = true;
				state.isError = false;
				state.user = null;
			});
	},
});

export const { reset } = authSlice.actions;

export default authSlice.reducer;
