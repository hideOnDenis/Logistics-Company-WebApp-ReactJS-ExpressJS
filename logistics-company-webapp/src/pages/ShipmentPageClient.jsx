import React, { useEffect, useState, useCallback } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  fetchClientShipments,
  createShipment,
} from "../features/shipments/shipmentSlice";
import { fetchCompaniesWithEmployees } from "../features/companies/companySlice";
import {
  fetchOffices,
  fetchOfficesByCompany,
  addShipmentToOffice,
} from "../features/offices/officeSlice";
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
  const [weight, setWeight] = useState("");
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { shipments, status } = useSelector((state) => state.shipments);
  const companies = useSelector((state) => state.companies.items); // Accessing companies correctly
  const { offices } = useSelector((state) => state.offices);
  const [selectedOffice, setSelectedOffice] = useState(""); // State for selected office
  const [customDestination, setCustomDestination] = useState(""); // State for custom destination if any

  useEffect(() => {
    dispatch(fetchCompaniesWithEmployees());
    dispatch(fetchClientShipments());
  }, [dispatch]);

  useEffect(() => {
    // Fetch offices only if selectedCompany is not empty
    if (selectedCompany) {
      dispatch(fetchOfficesByCompany(selectedCompany));
    } else {
      // If no company is selected (e.g., on page load), fetch all offices
      dispatch(fetchOffices());
    }
  }, [selectedCompany, dispatch]);

  const handleOpen = () => setOpen(true);
  const handleClose = () => {
    setOpen(false);
    setSelectedCompany("");
    setDestination("");
    setWeight("");
    setCustomDestination("");
  };

  const getOfficeNameById = (officeId) => {
    const office = offices.find((office) => office._id === officeId);
    return office ? `Office: ${office.name}` : "Custom Destination"; // Prepend "Office: " to the name
  };

  const handleAddShipment = async () => {
    if (weight > 0 && selectedCompany) {
      try {
        // First, create the shipment and get the response to obtain the new shipment's ID
        const createShipmentResponse = await dispatch(
          createShipment({
            company: selectedCompany,
            destination: selectedOffice || customDestination,
            weight: parseFloat(weight),
          })
        ).unwrap();

        // If an office is selected, link the shipment to the office
        if (selectedOffice) {
          await dispatch(
            addShipmentToOffice({
              officeId: selectedOffice,
              shipmentId: createShipmentResponse._id,
            })
          ).unwrap();
        }

        // Refresh the shipments and offices lists
        dispatch(fetchClientShipments());
        if (selectedOffice) {
          dispatch(fetchOfficesByCompany(selectedCompany));
        }

        // Close the modal and reset the form
        handleClose();
      } catch (error) {
        console.error("Failed to add shipment:", error);
        alert("Failed to add the shipment. Please try again.");
      }
    } else {
      alert("Please enter a valid weight and select a company.");
    }
  };

  const handleEditRowsModelChange = useCallback((model) => {
    setEditRowsModel(model);
  }, []);

  const handleLogout = () => {
    dispatch(logout()); // Dispatch the logout action
    navigate("/login"); // Redirect user to login page after logout
  };

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
    },
    {
      field: "company",
      headerName: "Company",
      width: 200,
      valueGetter: (params) => params.row.company?.name || "",
    },
    {
      field: "destination",
      headerName: "Destination",
      width: 200,
      valueGetter: (params) => {
        // Check if the destination matches the format of an ObjectId
        if (params.row.destination.match(/^[0-9a-fA-F]{24}$/)) {
          // It's an ObjectId, so get the office name
          return getOfficeNameById(params.row.destination);
        } else {
          // It's a custom destination string
          return params.row.destination;
        }
      },
    },

    {
      field: "weight",
      headerName: "Weight (kg)",
      type: "number",
      width: 200,
    },

    {
      field: "price",
      headerName: "Price",
      type: "number",
      width: 200,
      valueFormatter: (params) => `$${params.value.toFixed(2)}`,
    },
    {
      field: "status",
      headerName: "Status",
      width: 130,
    },
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
        <Button variant="outlined" onClick={handleLogout} sx={{ mr: 2 }}>
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
          height: "calc(100vh - 100px)",
          width: "100%", // Ensure DataGrid takes full width
          ".MuiDataGrid-main": { height: "100%" },
        }}
      />
      <Modal open={open} onClose={handleClose}>
        <Box sx={style}>
          <Typography id="modal-title" variant="h6" component="div">
            Add New Shipment
          </Typography>
          <Stack spacing={2} sx={{ mt: 2 }}>
            <FormControl fullWidth>
              <InputLabel id="company-select-label">Company</InputLabel>
              <Select
                labelId="company-select-label"
                id="company-select"
                value={selectedCompany}
                onChange={(e) => {
                  setSelectedCompany(e.target.value);
                  setSelectedOffice(""); // Reset selected office when company changes
                  setCustomDestination(""); // Reset custom destination as well
                }}
                label="Company"
              >
                {companies.map((company) => (
                  <MenuItem key={company._id} value={company._id}>
                    {company.name}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>

            {selectedCompany && (
              <FormControl fullWidth>
                <InputLabel id="office-select-label">Office</InputLabel>
                <Select
                  labelId="office-select-label"
                  id="office-select"
                  value={selectedOffice}
                  onChange={(e) => setSelectedOffice(e.target.value)}
                  displayEmpty
                >
                  <MenuItem value="">None (Specify Destination)</MenuItem>
                  {offices.map(
                    (office) =>
                      office.company._id === selectedCompany && (
                        <MenuItem key={office._id} value={office._id}>
                          {office.name}
                        </MenuItem>
                      )
                  )}
                </Select>
              </FormControl>
            )}

            {!selectedOffice && (
              <TextField
                label="Custom Destination"
                fullWidth
                value={customDestination}
                onChange={(e) => setCustomDestination(e.target.value)}
              />
            )}

            <TextField
              label="Weight (kg)"
              type="number"
              fullWidth
              value={weight}
              onChange={(e) => setWeight(e.target.value)}
              InputProps={{ inputProps: { min: 0 } }} // Ensure negative numbers can't be input
            />

            <Button onClick={handleAddShipment} variant="contained">
              Add
            </Button>
          </Stack>
        </Box>
      </Modal>
    </Box>
  );
}
