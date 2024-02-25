import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { getAllUsers, toggleAdminStatus } from "../../services/authService.js";

export const fetchUsers = createAsyncThunk("users/fetchUsers", async () => {
  const response = await getAllUsers();
  return response;
});

const initialState = {
  users: [],
  isLoading: false,
  error: null,
};

const userSlice = createSlice({
  name: "user",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchUsers.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(fetchUsers.fulfilled, (state, action) => {
        state.isLoading = false;
        state.users = action.payload;
      })
      .addCase(fetchUsers.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.error.message;
      })
      .addCase(toggleUserAdminStatus.fulfilled, (state, action) => {
        const index = state.users.findIndex(
          (user) => user.id === action.payload.id
        );
        if (index !== -1) {
          state.users[index] = action.payload;
        }
      });
  },
});

export default userSlice.reducer;
