// features/companies/companySlice.js
import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios"; // Assuming you're using axios for HTTP requests

const domain = "http://localhost:3000";
// Helper function to get the token from storage or state
const getToken = () => {
  // Assuming the token is stored in local storage; adjust as needed
  return localStorage.getItem("accessToken");
};

// Async thunk for fetching companies with authorization
export const fetchCompanies = createAsyncThunk(
  "companies/fetchCompanies",
  async (_, { rejectWithValue }) => {
    try {
      const response = await axios.get(`${domain}/api/companies`, {
        headers: {
          Authorization: `Bearer ${getToken()}`,
        },
      });
      return response.data;
    } catch (err) {
      return rejectWithValue(err.response.data);
    }
  }
);

// Async thunk for adding a new company with authorization
export const addCompany = createAsyncThunk(
  "companies/addCompany",
  async (companyData, { rejectWithValue }) => {
    try {
      const response = await axios.post(
        `${domain}/api/companies`,
        companyData,
        {
          headers: {
            Authorization: `Bearer ${getToken()}`,
          },
        }
      );
      return response.data;
    } catch (err) {
      return rejectWithValue(err.response.data);
    }
  }
);

// Continue with your slice as before...

// Define the initial state and reducers
const companySlice = createSlice({
  name: "companies",
  initialState: {
    items: [],
    status: "idle", // 'idle' | 'loading' | 'succeeded' | 'failed'
    error: null,
  },
  reducers: {
    // Reducer to reset state or perform other actions
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchCompanies.pending, (state) => {
        state.status = "loading";
      })
      .addCase(fetchCompanies.fulfilled, (state, action) => {
        state.status = "succeeded";
        state.items = action.payload;
      })
      .addCase(fetchCompanies.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.error.message;
      });
    // Handle other async actions similarly
  },
});

export default companySlice.reducer;
