import { configureStore } from "@reduxjs/toolkit";
import userReducer from '../features/users/userSlice.jsx';
import authReducer from '../features/auth/authSlice.jsx';
import parcelsReducer from '../features/parcels/parcelsSlice.jsx';
import reportsReducer from '../features/reports/reportsSlice.jsx';

export const store = configureStore({
  reducer: {

    users: userReducer,
    auth: authReducer,
    parcels: parcelsReducer,
    reports: reportsReducer,
    // You might have more reducers
  },
  // Middleware can also be added here if needed
});
