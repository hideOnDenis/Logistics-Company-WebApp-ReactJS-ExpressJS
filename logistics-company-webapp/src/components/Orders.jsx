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
          {shipments.map((shipment) => (
            <TableRow key={shipment._id}>
              <TableCell>{shipment._id}</TableCell>
              <TableCell>{shipment.createdBy.email}</TableCell>
              <TableCell>{shipment.destination}</TableCell>
              <TableCell>{shipment.status}</TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
      <Link color="primary" href="#" onClick={preventDefault} sx={{ mt: 3 }}>
        See more orders
      </Link>
    </React.Fragment>
  );
}
