import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchShipments } from "../features/shipments/shipmentSlice"; // Adjust the import path as necessary
import {
  Link,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
  Typography,
  Box,
} from "@mui/material";
import Title from "./Title";

function preventDefault(event) {
  event.preventDefault();
}

export default function Orders() {
  const dispatch = useDispatch();
  const { shipments, status } = useSelector((state) => state.shipments);

  useEffect(() => {
    dispatch(fetchShipments());
  }, [dispatch]);

  // Check if shipments data is being loaded or if there is an error
  const isLoading = status === "loading";
  const hasShipments = shipments.length > 0;

  return (
    <React.Fragment>
      <Title>Recent Orders</Title>
      <Table size="small">
        <TableHead>
          <TableRow>
            <TableCell>ID</TableCell>
            <TableCell>Sender</TableCell>
            <TableCell>Destination</TableCell>
            <TableCell>Status</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {isLoading ? (
            <TableRow>
              <TableCell align="center" colSpan={4}>
                Loading shipments...
              </TableCell>
            </TableRow>
          ) : hasShipments ? (
            shipments.map((shipment) => (
              <TableRow key={shipment._id}>
                <TableCell>{shipment._id}</TableCell>
                <TableCell>{shipment.createdBy?.email || "N/A"}</TableCell>
                <TableCell>{shipment.destination || "N/A"}</TableCell>
                <TableCell>{shipment.status || "N/A"}</TableCell>
              </TableRow>
            ))
          ) : (
            <TableRow>
              <TableCell align="center" colSpan={4}>
                No shipments available.
              </TableCell>
            </TableRow>
          )}
        </TableBody>
      </Table>
      <Link color="primary" href="#" onClick={preventDefault} sx={{ mt: 3 }}>
        See more orders
      </Link>
    </React.Fragment>
  );
}
