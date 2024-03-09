import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";

const domain = "http://localhost:3000";

const getToken = () => {
  return localStorage.getItem("accessToken");
};

// Async thunk to fetch the offices with authorization
export const fetchOffices = createAsyncThunk(
  "offices/fetchOffices",
  async (_, thunkAPI) => {
    try {
      const response = await axios.get(`${domain}/api/offices`, {
        headers: {
          Authorization: `Bearer ${getToken()}`,
        },
      });
      return response.data;
    } catch (error) {
      // thunkAPI to return a rejected value with a custom error message or handle errors
      const message =
        error.response?.data?.message || error.message || "An error occurred";
      return thunkAPI.rejectWithValue(message);
    }
  }
);

// Async thunk to create office
export const createOffice = createAsyncThunk(
  "offices/createOffice",
  async ({ name, company }, { rejectWithValue }) => {
    try {
      const token = getToken(); // Retrieve the authentication token
      console.log({ name, company });
      const response = await axios.post(
        `${domain}/api/offices`,
        {
          name,
          company,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      return response.data;
    } catch (error) {
      const message =
        error.response?.data?.message ||
        error.message ||
        "Failed to create office";
      return rejectWithValue(message);
    }
  }
);

// Async thunk to add user to an office
export const addUserToOffice = createAsyncThunk(
  "offices/addUserToOffice",
  async ({ officeId, userId }, { rejectWithValue }) => {
    try {
      const token = getToken(); // Retrieve the authentication token
      const response = await axios.patch(
        `${domain}/api/offices/${officeId}/add-user`,
        { userId }, // Body of the request
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      return response.data;
    } catch (error) {
      const message =
        error.response?.data?.message ||
        error.message ||
        "Failed to add user to office";
      return rejectWithValue(message);
    }
  }
);

// Async thunk to remove user from office
export const removeUserFromOffice = createAsyncThunk(
  "offices/removeUserFromOffice",
  async ({ officeId, userId }, { rejectWithValue }) => {
    try {
      const token = getToken(); // Retrieve the authentication token
      const response = await axios.patch(
        `${domain}/api/offices/${officeId}/remove-user`,
        { userId }, // Body of the request
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      return response.data;
    } catch (error) {
      const message =
        error.response?.data?.message ||
        error.message ||
        "Failed to remove user from office";
      return rejectWithValue(message);
    }
  }
);

// Async thunk to add shipment to office
export const addShipmentToOffice = createAsyncThunk(
  "offices/addShipmentToOffice",
  async ({ officeId, shipmentId }, { rejectWithValue }) => {
    try {
      const token = getToken();
      const response = await axios.patch(
        `${domain}/api/offices/${officeId}/add-shipment`,
        { shipmentId },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      return response.data;
    } catch (error) {
      const message =
        error.response?.data?.message ||
        error.message ||
        "Failed to add shipment to office";
      return rejectWithValue(message);
    }
  }
);

// Async thunk to fetch offices by company
export const fetchOfficesByCompany = createAsyncThunk(
  "offices/fetchOfficesByCompany",
  async (companyId, { rejectWithValue }) => {
    try {
      const token = getToken(); // Retrieve the authentication token
      const response = await axios.get(
        `${domain}/api/offices/company/${companyId}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      return response.data;
    } catch (error) {
      const message =
        error.response?.data?.message ||
        error.message ||
        "Failed to fetch offices by company";
      return rejectWithValue(message);
    }
  }
);

// Async thunk to delete an office
export const deleteOffice = createAsyncThunk(
  "offices/deleteOffice",
  async (officeId, { rejectWithValue }) => {
    try {
      const token = getToken(); // Retrieve the authentication token
      const response = await axios.delete(`${domain}/api/offices/${officeId}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      if (response.status === 200) {
        // Assuming the API returns a success message and the ID of the deleted office
        return { officeId: officeId, message: response.data.message };
      }
    } catch (error) {
      const message =
        error.response?.data?.message ||
        error.message ||
        "Failed to delete office";
      return rejectWithValue(message);
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
        state.status = "loading";
      })
      .addCase(createOffice.fulfilled, (state, action) => {
        state.offices.push(action.payload);
        state.status = "succeeded";
      })
      .addCase(createOffice.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.payload;
      })
      .addCase(addUserToOffice.fulfilled, (state, action) => {
        // Find the office in the state and update it
        const index = state.offices.findIndex(
          (office) => office._id === action.payload._id
        );
        if (index !== -1) {
          state.offices[index] = action.payload; // Update the office with the returned payload
        }
      })
      .addCase(addUserToOffice.rejected, (state, action) => {
        state.error = action.payload;
      })
      .addCase(removeUserFromOffice.pending, (state) => {})
      .addCase(removeUserFromOffice.fulfilled, (state, action) => {
        // Find the office in the state and update it to reflect the removal of the user
        const index = state.offices.findIndex(
          (office) => office._id === action.payload._id
        );
        if (index !== -1) {
          state.offices[index] = action.payload; // Update the office with the returned payload
        }
      })
      .addCase(removeUserFromOffice.rejected, (state, action) => {
        state.error = action.payload;
      })
      .addCase(deleteOffice.fulfilled, (state, action) => {
        // Remove the deleted office from state
        state.offices = state.offices.filter(
          (office) => office._id !== action.payload.officeId
        );
      })
      .addCase(deleteOffice.rejected, (state, action) => {
        state.error = action.payload;
      })
      .addCase(addShipmentToOffice.fulfilled, (state, action) => {
        // Find the office in the state and update it with the returned payload
        const index = state.offices.findIndex(
          (office) => office._id === action.payload._id
        );
        if (index !== -1) {
          state.offices[index] = action.payload;
        }
      })
      .addCase(addShipmentToOffice.rejected, (state, action) => {
        state.error = action.payload;
      });
  },
});

export default officeSlice.reducer;
