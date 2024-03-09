import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";

const domain = "http://localhost:3000";

// Helper function to get the token from storage
const getToken = () => localStorage.getItem("accessToken");

// Fetch shipments
export const fetchShipments = createAsyncThunk(
  "shipments/fetchShipments",
  async (_, { rejectWithValue }) => {
    try {
      const response = await axios.get(`${domain}/api/shipments`, {
        headers: {
          Authorization: `Bearer ${getToken()}`,
        },
      });
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response.data);
    }
  }
);

// Create a new shipment
export const createShipment = createAsyncThunk(
  "shipments/createShipment",
  async ({ company, destination, weight }, { rejectWithValue }) => {
    try {
      const response = await axios.post(
        `${domain}/api/shipments`,
        { company, destination, weight }, // Include weight here
        { headers: { Authorization: `Bearer ${getToken()}` } }
      );
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response.data);
    }
  }
);

// Delete a shipment
export const deleteShipment = createAsyncThunk(
  "shipments/deleteShipment",
  async (shipmentId, { rejectWithValue }) => {
    try {
      await axios.delete(`${domain}/api/shipments/${shipmentId}`, {
        headers: {
          Authorization: `Bearer ${getToken()}`,
        },
      });
      return shipmentId;
    } catch (error) {
      return rejectWithValue(error.response.data);
    }
  }
);

// Update a shipment's status
export const updateShipmentStatus = createAsyncThunk(
  "shipments/updateShipmentStatus",
  async ({ shipmentId, status }, { rejectWithValue }) => {
    try {
      const response = await axios.patch(
        `${domain}/api/shipments/${shipmentId}/status`,
        { status },
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

// Async thunk to fetch only the client shipments (only for the user that's logged in)
export const fetchClientShipments = createAsyncThunk(
  "shipments/fetchClientShipments",
  async (_, { rejectWithValue }) => {
    try {
      const response = await axios.get(`${domain}/api/client/shipments`, {
        headers: {
          Authorization: `Bearer ${getToken()}`,
        },
      });
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response.data);
    }
  }
);

const initialState = {
  shipments: [],
  status: "idle", // 'idle' | 'loading' | 'succeeded' | 'failed'
  error: null,
};

const shipmentSlice = createSlice({
  name: "shipments",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchShipments.pending, (state) => {
        state.status = "loading";
      })
      .addCase(fetchShipments.fulfilled, (state, action) => {
        state.status = "succeeded";
        state.shipments = action.payload;
      })
      .addCase(fetchShipments.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.error.message;
      })
      .addCase(createShipment.fulfilled, (state, action) => {
        state.shipments.push(action.payload);
      })
      .addCase(deleteShipment.fulfilled, (state, action) => {
        state.shipments = state.shipments.filter(
          (shipment) => shipment._id !== action.payload
        );
      })
      .addCase(updateShipmentStatus.fulfilled, (state, action) => {
        const index = state.shipments.findIndex(
          (shipment) => shipment._id === action.payload._id
        );
        if (index !== -1) {
          state.shipments[index].status = action.payload.status;
        }
      })
      .addCase(fetchClientShipments.pending, (state) => {
        state.status = "loading";
      })
      .addCase(fetchClientShipments.fulfilled, (state, action) => {
        state.status = "succeeded";
        state.shipments = action.payload;
      })
      .addCase(fetchClientShipments.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.error.message;
      });
  },
});

export default shipmentSlice.reducer;
