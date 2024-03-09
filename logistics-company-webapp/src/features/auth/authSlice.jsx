import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { login, register } from "../../app/api.js";

// Defining the initial state of auth slice
const initialState = {
  user: null, // The user object will be null when not logged in.
  error: null, // Error message for failed login or registration attempts.
  isLoading: false, // Tracks whether an async operation is in progress.
};

// Async thunk action for signing in (using the api.js)
export const signIn = createAsyncThunk(
  "auth/signIn",
  async (credentials, thunkAPI) => {
    try {
      // Attempt to log in with the provided credentials
      const response = await login(credentials);
      // Return the user data upon successful login
      return response.data;
    } catch (error) {
      // Ensure the error is handled correctly
      const errorMessage =
        error.response && error.response.data && error.response.data.message
          ? error.response.data.message
          : "User does not exist.";
      // Use rejectWithValue to pass the error message
      return thunkAPI.rejectWithValue(errorMessage);
    }
  }
);

// Async thunk action for signing up (using the api.js)
export const signUp = createAsyncThunk(
  "auth/signUp",
  async (userData, thunkAPI) => {
    try {
      // Attempt to register with the provided user data.
      const { data } = await register(userData);
      // Store the token in local storage for future requests
      localStorage.setItem("accessToken", data.token);
      // Return the user ID and admin status
      return { id: data.id, isAdmin: data.isAdmin };
    } catch (error) {
      // Reject the action with the server-provided error message
      return thunkAPI.rejectWithValue(error.response.data.message);
    }
  }
);

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    // Reducer to handle user logout
    logout(state) {
      state.user = null; // Clear the user state
      localStorage.clear(); // Clear the local storage (remove the token)
    },
  },
  extraReducers: (builder) => {
    builder
      // Handle the fulfilled state for signIn
      .addCase(signIn.fulfilled, (state, action) => {
        state.user = action.payload; // Only store non-sensitive user info

        state.error = null;
        state.isLoading = false;
      })
      .addCase(signIn.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(signIn.rejected, (state, action) => {
        state.error = action.payload;
        state.isLoading = false;
      })
      .addCase(signUp.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(signUp.fulfilled, (state, action) => {
        state.user = action.payload; // Update the user state with the new user's ID and admin status.
        state.isLoading = false;
        state.error = null;
      })
      .addCase(signUp.rejected, (state, action) => {
        state.error = action.payload;
        state.isLoading = false;
      });
  },
});

// Export the logout action creator.
export const { logout } = authSlice.actions;

// Export the reducer as the default export of this file
export default authSlice.reducer;
