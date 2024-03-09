import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";

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

// Async thunk for fetching companies that have employees
export const fetchCompaniesWithEmployees = createAsyncThunk(
  "companies/fetchCompaniesWithEmployees",
  async (_, { rejectWithValue }) => {
    try {
      const response = await axios.get(
        `${domain}/api/companies/with-employees`,
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

// Async thunk to add user to company
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

// Async thunk to remove user from company
export const removeUserFromCompany = createAsyncThunk(
  "companies/removeUserFromCompany",
  async ({ companyId, userId }, { rejectWithValue }) => {
    try {
      const response = await axios.delete(
        `${domain}/api/companies/${companyId}/employees/${userId}`,
        {
          headers: {
            Authorization: `Bearer ${getToken()}`,
          },
        }
      );
      return { companyId, userId }; // Return both IDs to update the state
    } catch (error) {
      return rejectWithValue(error.response.data);
    }
  }
);

// Update company name
export const updateCompanyName = createAsyncThunk(
  "companies/updateCompanyName",
  async ({ companyId, newName }, { rejectWithValue }) => {
    try {
      const response = await axios.patch(
        `${domain}/api/companies/${companyId}/name`,
        { newName: newName },
        {
          headers: {
            Authorization: `Bearer ${getToken()}`,
          },
        }
      );

      return response.data; // This should include the updated company object
    } catch (err) {
      return rejectWithValue(err.response.data);
    }
  }
);

const initialState = {
  items: [],
  status: "idle", // 'idle' | 'loading' | 'succeeded' | 'failed'
  error: null,
};

// Defining the initial state and reducers
const companySlice = createSlice({
  name: "companies",
  initialState,
  reducers: {},
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
          state.items[companyIndex].employees.push(employee);
        }
      })
      .addCase(addUserToCompany.rejected, (state, action) => {
        state.error = action.payload || "Failed to add user to company";
      })
      .addCase(removeUserFromCompany.fulfilled, (state, action) => {
        const { companyId, userId } = action.payload;
        const companyIndex = state.items.findIndex(
          (company) => company._id === companyId
        );
        if (companyIndex !== -1) {
          // Filter out the user from the employees array
          state.items[companyIndex].employees = state.items[
            companyIndex
          ].employees.filter((employee) => employee._id !== userId);
        }
      })

      .addCase(removeUserFromCompany.rejected, (state, action) => {
        state.error = action.payload || "Failed to remove user from company";
      })
      .addCase(updateCompanyName.fulfilled, (state, action) => {
        const index = state.items.findIndex(
          (company) => company._id === action.payload._id
        );
        if (index !== -1) {
          state.items[index] = action.payload; // Update the company with the updated data
        }
      })
      .addCase(updateCompanyName.rejected, (state, action) => {
        state.error = action.payload || "Failed to update company name";
      })
      .addCase(fetchCompaniesWithEmployees.pending, (state) => {
        state.status = "loading";
      })
      .addCase(fetchCompaniesWithEmployees.fulfilled, (state, action) => {
        state.status = "succeeded";
        state.items = action.payload;
      })
      .addCase(fetchCompaniesWithEmployees.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.error.message;
      });
  },
});

export default companySlice.reducer;
