import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { login, register } from "../../app/api.js"; // Adjust path as necessary

const initialState = {
  user: null,
  error: null,
  isLoading: false,
};

export const signIn = createAsyncThunk(
  "auth/signIn",
  async (credentials, thunkAPI) => {
    try {
      const response = await login(credentials);
      return response.data;
    } catch (error) {
      // Ensure the error is handled correctly
      const errorMessage =
        error.response && error.response.data && error.response.data.message
          ? error.response.data.message
          : "Login failed due to an unexpected error.";
      // Use rejectWithValue to pass the error message
      return thunkAPI.rejectWithValue(errorMessage);
    }
  }
);

export const signUp = createAsyncThunk(
  "auth/signUp",
  async (userData, thunkAPI) => {
    try {
      const { data } = await register(userData);
      localStorage.setItem("token", data.token);
      return { id: data.id, isAdmin: data.isAdmin };
    } catch (error) {
      return thunkAPI.rejectWithValue(error.response.data.message);
    }
  }
);

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    // Implement logout functionality
    logout(state) {
      state.user = null;
      localStorage.removeItem("token");
    },
  },
  extraReducers: (builder) => {
    builder
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
        state.user = action.payload;
        state.isLoading = false;
        state.error = null;
      })
      .addCase(signUp.rejected, (state, action) => {
        state.error = action.payload;
        state.isLoading = false;
      });
  },
});

export const { logout } = authSlice.actions;

export default authSlice.reducer;
