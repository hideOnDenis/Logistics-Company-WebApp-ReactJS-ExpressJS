// features/companies/companySlice.js
import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios"; // Assuming you're using axios for HTTP requests

const domain = "http://localhost:3000";

// Helper function to get the token from storage or state
const getToken = () => {
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

// // Async thunk for deleting a company with authorization
export const deleteCompany = createAsyncThunk(
  "companies/deleteCompany",
  async (companyId, { rejectWithValue }) => {
    try {
      const response = await axios.delete(
        `${domain}/api/companies/${companyId}`,
        {
          headers: {
            Authorization: `Bearer ${getToken()}`,
          },
        }
      );
      return companyId; // Return the ID of the deleted company to remove it from state
    } catch (err) {
      return rejectWithValue(err.response.data);
    }
  }
);

export const addUserToCompany = createAsyncThunk(
  "companies/addUserToCompany",
  async ({ companyId, userId }, { rejectWithValue }) => {
    try {
      const response = await axios.patch(
        `${domain}/api/companies/${companyId}/employees`,
        { userId },
        {
          headers: {
            Authorization: `Bearer ${getToken()}`,
          },
        }
      );
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response.data);
    }
  }
);

const initialState = {
  items: [],
  status: "idle", // 'idle' | 'loading' | 'succeeded' | 'failed'
  error: null,
};

// Continue with your slice as before...

// Define the initial state and reducers
const companySlice = createSlice({
  name: "companies",
  initialState,
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
      })
      .addCase(deleteCompany.fulfilled, (state, action) => {
        state.items = state.items.filter(
          (company) => company._id !== action.payload
        ); // Remove the company from the items array
        state.status = "succeeded";
      })
      .addCase(addUserToCompany.fulfilled, (state, action) => {
        const { companyId, employee } = action.payload;
        const companyIndex = state.items.findIndex(
          (company) => company._id === companyId
        );
        if (companyIndex !== -1) {
          // This assumes that the employees array exists. You might need to check or initialize it.
          state.items[companyIndex].employees.push(employee);
        }
      })
      .addCase(addUserToCompany.rejected, (state, action) => {
        // Optionally handle rejection
        state.error = action.payload || "Failed to add user to company";
      });
  },
});

export default companySlice.reducer;
