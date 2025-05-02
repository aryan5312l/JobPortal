import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";


export const fetchUser = createAsyncThunk('auth/validate', async (_, { rejectWithValue }) => {
    try {
        const response = await fetch(`${import.meta.env.VITE_USER_API_END_POINT}/auth/validate`, {
            method: "GET",
            credentials: 'include',

        });
        if (!response.ok) {
            const error = new Error('Failed to validate session');
            error.status = response.status;
            throw error;
          }
          return await response.json();

    } catch (error) {
        if (error.status !== 401) {
            console.error('Error in fetch user thunk:', error);
          }
          return rejectWithValue(error.message);
    }
});


const authSlice = createSlice({
    name: "auth",
    initialState: {
        loading: false,
        user: null
    },
    reducers: {
        setLoading: (state, action) => {
            state.loading = action.payload;
        },
        setUser: (state, action) => {
            state.user = action.payload;
        }
    },
    extraReducers: (builder) => {
        builder
            .addCase(fetchUser.pending, (state) => {
                state.loading = true;
            })
            .addCase(fetchUser.fulfilled, (state, action) => {
                state.loading = false;
                state.user = action.payload.user; // Assuming the response has a `user` object
            })
            .addCase(fetchUser.rejected, (state) => {
                state.loading = false;
                state.user = null; // Clear user if validation fails
            });
    },

})

export const { setLoading, setUser } = authSlice.actions;
export default authSlice.reducer