import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios"; // Assuming you're using axios for HTTP requests

const domain = "http://localhost:3000";

const getToken = () => {
  return localStorage.getItem("accessToken");
};

export const fetchOffices = createAsyncThunk(
  "offices/fetchOffices",
  async (_, thunkAPI) => {
    try {
      const response = await axios.get(`${domain}/api/offices`, {
        headers: {
          Authorization: `Bearer ${getToken()}`,
        },
      });
      return response.data; // Assuming the API returns an array of offices
    } catch (error) {
      // Use thunkAPI to return a rejected value with a custom error message or handle errors
      const message =
        error.response?.data?.message || error.message || "An error occurred";
      return thunkAPI.rejectWithValue(message);
    }
  }
);

export const createOffice = createAsyncThunk(
  "offices/createOffice",
  async (officeData, thunkAPI) => {
    try {
      const token = getToken(); // Retrieve the authentication token
      const response = await axios.post(`${domain}/api/offices`, officeData, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      return response.data;
    } catch (error) {
      const message =
        error.response?.data?.message ||
        error.message ||
        "Failed to create office";
      return thunkAPI.rejectWithValue(message);
    }
  }
);

const officeSlice = createSlice({
  name: "offices",
  initialState: {
    offices: [],
    status: "idle", // 'idle' | 'loading' | 'succeeded' | 'failed'
    error: null,
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchOffices.pending, (state) => {
        state.status = "loading";
        state.error = null; // Reset any errors from previous requests
      })
      .addCase(fetchOffices.fulfilled, (state, action) => {
        state.status = "succeeded";
        state.offices = action.payload; // Update the state with the fetched offices
      })
      .addCase(fetchOffices.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.payload; // Set the error message from the rejected action
      })
      .addCase(createOffice.pending, (state) => {
        // Optionally, set a loading state
        state.status = "loading";
      })
      .addCase(createOffice.fulfilled, (state, action) => {
        // Optionally, add the new office to the state
        state.offices.push(action.payload);
        state.status = "succeeded";
      })
      .addCase(createOffice.rejected, (state, action) => {
        // Handle errors
        state.status = "failed";
        state.error = action.payload;
      });
  },
});

export default officeSlice.reducer;
