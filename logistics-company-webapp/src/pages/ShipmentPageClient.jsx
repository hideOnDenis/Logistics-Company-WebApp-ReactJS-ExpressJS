import React, { useEffect, useState, useCallback } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  fetchClientShipments,
  createShipment,
} from "../features/shipments/shipmentSlice";
import { fetchCompanies } from "../features/companies/companySlice";
import { logout } from "../features/auth/authSlice.jsx";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import Typography from "@mui/material/Typography";
import Modal from "@mui/material/Modal";
import TextField from "@mui/material/TextField";
import Stack from "@mui/material/Stack";
import Select from "@mui/material/Select";
import MenuItem from "@mui/material/MenuItem";
import FormControl from "@mui/material/FormControl";
import InputLabel from "@mui/material/InputLabel";
import { DataGrid, GridToolbar } from "@mui/x-data-grid";
import { useNavigate } from "react-router-dom";

const style = {
  position: "absolute",
  top: "50%",
  left: "50%",
  transform: "translate(-50%, -50%)",
  width: 400,
  bgcolor: "background.paper",
  boxShadow: 24,
  p: 4,
};

export default function ShipmentPageClient() {
  const [open, setOpen] = useState(false);
  const [selectedCompany, setSelectedCompany] = useState("");
  const [destination, setDestination] = useState("");
  const [editRowsModel, setEditRowsModel] = useState({});

  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { shipments, status } = useSelector((state) => state.shipments);
  const companies = useSelector((state) => state.companies.items); // Accessing companies correctly

  useEffect(() => {
    if (companies.length === 0) {
      dispatch(fetchCompanies()); // Fetch companies if not already available
    }
    dispatch(fetchClientShipments()); // Use fetchClientShipments to fetch only the client's shipments
  }, [dispatch]);

  const handleOpen = () => setOpen(true);
  const handleClose = () => {
    setOpen(false);
    setSelectedCompany("");
    setDestination("");
  };

  const handleAddShipment = () => {
    dispatch(
      createShipment({
        company: selectedCompany,
        destination,
      })
    ).then(() => {
      dispatch(fetchShipments()); // Refetch shipments to get updated data including sender and company
    });
    handleClose();
  };

  const handleEditRowsModelChange = useCallback((model) => {
    setEditRowsModel(model);
  }, []);

  const handleLogout = () => {
    dispatch(logout()); // Dispatch the logout action
    navigate("/login"); // Redirect user to login page after logout
  };
  const companyOptions = companies?.map((company) => (
    <MenuItem key={company._id} value={company._id}>
      {company.name}
    </MenuItem>
  ));

  const columns = [
    {
      field: "id",
      headerName: "ID",
      width: 90,
      valueGetter: (params) => params.row._id,
    },
    {
      field: "createdBy",
      headerName: "Sender",
      width: 200,
      valueGetter: (params) => params.row.createdBy?.email || "",
    }, // Adjusted for populated data
    {
      field: "company",
      headerName: "Company",
      width: 200,
      valueGetter: (params) => params.row.company?.name || "",
    }, // Adjusted for populated data
    { field: "destination", headerName: "Destination", width: 200 },
    {
      field: "status",
      headerName: "Status",
      width: 130,
    },
    // Removed the delete action column
  ];

  return (
    <Box sx={{ height: "100%", width: "100%" }}>
      <Box
        sx={{
          display: "flex",
          justifyContent: "space-between", // This will push the button to the right
          alignItems: "center",
          p: 2,
        }}
      >
        <Typography variant="h4" sx={{ mb: 2 }}>
          Shipments
        </Typography>
        <Button variant="outlined" onClick={handleLogout}>
          Logout
        </Button>
        <Button variant="contained" onClick={handleOpen}>
          Add Shipment
        </Button>
      </Box>
      <DataGrid
        rows={shipments}
        columns={columns}
        pageSize={5}
        getRowId={(row) => row._id}
        rowsPerPageOptions={[5]}
        components={{ Toolbar: GridToolbar }}
        loading={status === "loading"}
        editRowsModel={editRowsModel}
        onEditRowsModelChange={handleEditRowsModelChange}
        sx={{
          height: "calc(100vh - 100px)", // Adjust the height based on your header/footer height
          width: "100%", // Ensure DataGrid takes full width
          ".MuiDataGrid-main": { height: "100%" }, // Make DataGrid main container take full height
        }}
      />
      <Modal
        open={open}
        onClose={handleClose}
        aria-labelledby="modal-title"
        aria-describedby="modal-description"
      >
        <Box sx={style}>
          <Typography id="modal-title" variant="h6" component="div">
            Add New Shipment
          </Typography>
          <Stack spacing={2} sx={{ mt: 2 }}>
            <FormControl fullWidth>
              <InputLabel id="company-select-label">Company</InputLabel>
              <Select
                labelId="company-select-label"
                value={selectedCompany}
                onChange={(e) => setSelectedCompany(e.target.value)}
                label="Company"
              >
                {companyOptions || (
                  <MenuItem value="">No Companies Available</MenuItem>
                )}
              </Select>
            </FormControl>
            <TextField
              label="Destination"
              fullWidth
              value={destination}
              onChange={(e) => setDestination(e.target.value)}
            />
            <Button onClick={handleClose}>Cancel</Button>
            <Button onClick={handleAddShipment} variant="contained">
              Add
            </Button>
          </Stack>
        </Box>
      </Modal>
    </Box>
  );
}
