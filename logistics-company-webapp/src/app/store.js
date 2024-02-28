import { configureStore } from "@reduxjs/toolkit";
import userReducer from '../features/users/userSlice.jsx';
import authReducer from '../features/auth/authSlice.jsx';
import parcelReducer from '../features/parcels/parcelSlice.jsx';
import reportReducer from '../features/reports/reportSlice.jsx';
import companyReducer from "../features/companies/companySlice.jsx";

export const store = configureStore({
  reducer: {

    users: userReducer,
    auth: authReducer,
    parcel: parcelReducer,
    report: reportReducer,
    companies: companyReducer,
    // You might have more reducers
  },
  // Middleware can also be added here if needed
});
