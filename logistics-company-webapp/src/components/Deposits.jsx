import React, { useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { fetchShipments } from "../features/shipments/shipmentSlice";
import Link from "@mui/material/Link";
import Typography from "@mui/material/Typography";
import Title from "./Title";

// Prevents the default action for an event, useful for stopping link navigation
function preventDefault(event) {
  event.preventDefault();
}

export default function Deposits() {
  const dispatch = useDispatch(); // Accesses the Redux dispatch function.
  const { shipments, status } = useSelector((state) => state.shipments); // Retrieves shipments and their loading status from Redux store.

  // Fetch shipments data when the component mounts.
  useEffect(() => {
    dispatch(fetchShipments());
  }, [dispatch]);

  // Function to calculate total profits from all shipments
  const calculateTotalProfits = (shipments) => {
    // Sums up the price of each shipment.
    return shipments.reduce((total, shipment) => total + shipment.price, 0);
  };

  const totalProfits = calculateTotalProfits(shipments); // Holds the total profits calculated from shipments

  // Formats the total profits as currency in US dollars
  const formattedTotalProfits = new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
  }).format(totalProfits);

  return (
    <React.Fragment>
      <Title>Recent Profits</Title>
      {status === "loading" ? (
        <Typography component="p" variant="h4">
          Loading...
        </Typography>
      ) : (
        <>
          <Typography component="p" variant="h4">
            {formattedTotalProfits}
          </Typography>
          <Typography color="text.secondary" sx={{ flex: 1 }}>
            on 12 March, 2024
          </Typography>
        </>
      )}
      <div>
        <Link color="primary" href="#" onClick={preventDefault}>
          View balance
        </Link>
      </div>
    </React.Fragment>
  );
}
