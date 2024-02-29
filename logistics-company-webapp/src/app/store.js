import { configureStore } from "@reduxjs/toolkit";
import userReducer from '../features/users/userSlice.jsx';
import authReducer from '../features/auth/authSlice.jsx';
import shipmentReducer from '../features/shipments/shipmentSlice.jsx';
import reportReducer from '../features/reports/reportSlice.jsx';
import companyReducer from "../features/companies/companySlice.jsx";

export const store = configureStore({
  reducer: {

    users: userReducer,
    auth: authReducer,
    shipments: shipmentReducer,
    report: reportReducer,
    companies: companyReducer,
    // You might have more reducers
  },
  // Middleware can also be added here if needed
});
