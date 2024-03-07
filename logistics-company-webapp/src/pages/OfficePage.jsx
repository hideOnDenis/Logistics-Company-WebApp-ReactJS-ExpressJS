import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchOffices } from "../features/offices/officeSlice";
import { fetchCompaniesWithEmployees } from "../features/companies/companySlice";
import { createOffice } from "../features/offices/officeSlice"; // Assuming you have this action
import {
  Box,
  Button,
  Typography,
  Modal,
  TextField,
  Stack,
  MenuItem,
  Select,
  FormControl,
  InputLabel,
} from "@mui/material";
import { DataGrid, GridToolbar } from "@mui/x-data-grid";

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

export default function OfficePage() {
  const dispatch = useDispatch();
  const [modalOpen, setModalOpen] = useState(false);
  const [newOfficeName, setNewOfficeName] = useState("");
  const [selectedCompanyId, setSelectedCompanyId] = useState("");

  // Fetch offices and companies when component mounts
  useEffect(() => {
    dispatch(fetchOffices());
    dispatch(fetchCompaniesWithEmployees());
  }, [dispatch]);

  const { offices, status, error } = useSelector((state) => state.offices);
  const companies = useSelector((state) => state.companies.items); // Adjust according to your state structure

  const handleOpenModal = () => setModalOpen(true);
  const handleCloseModal = () => setModalOpen(false);

  const handleCreateOffice = () => {
    const officeData = {
      name: newOfficeName,
      companyId: selectedCompanyId, // Ensure your backend expects this format
    };
    dispatch(createOffice(officeData));
    handleCloseModal();
  };

  const columns = [
    { field: "id", headerName: "ID", width: 90, hide: true },
    { field: "name", headerName: "Name", width: 150 },
    { field: "employees", headerName: "Employees", width: 300 },
    { field: "companyName", headerName: "Company", width: 200 }, // Add this line
  ];

  // Static rows as an example, replace with your own data
  const rows = offices.map((office) => ({
    ...office,
    id: office._id, // Ensuring unique ID is used
    employees: office.employees.join(", "), // Transform array of employees into a string, if necessary
    companyName: office.company.name, // Accessing the company name from the populated company object
  }));

  if (status === "loading") return <p>Loading...</p>;
  if (error) return <p>Error: {error}</p>;

  return (
    <Box sx={{ height: "100vh", width: "100%" }}>
      <Box
        sx={{
          display: "flex",
          justifyContent: "flex-end",
          alignItems: "center",
          gap: "8px",
          p: 2,
        }}
      >
        <Typography variant="h4" component="h1" sx={{ flexGrow: 1 }}>
          Office
        </Typography>
        <Box
          sx={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            gap: "8px",
            p: 2,
          }}
        >
          {/* Replace with static or placeholder buttons */}
          <Button variant="contained" color="success">
            Back to Dashboard
          </Button>
          <Button variant="contained" color="secondary">
            Remove User from Office
          </Button>
          <Button variant="contained" color="primary">
            Add User to Office
          </Button>
          <Button variant="contained" color="primary" onClick={handleOpenModal}>
            Add Office
          </Button>
        </Box>
      </Box>
      <DataGrid
        rows={rows}
        columns={columns}
        pageSize={5}
        components={{ Toolbar: GridToolbar }}
        disableSelectionOnClick
        getRowId={(row) => row.id}
        sx={{
          height: "calc(100vh - 100px)", // Adjust based on your actual header/footer height
          "& .MuiDataGrid-main": { height: "100%" },
        }}
      />
      {/* Modal placeholders */}
      <Modal
        open={modalOpen}
        onClose={handleCloseModal}
        aria-labelledby="modal-modal-title"
        aria-describedby="modal-modal-description"
      >
        <Box sx={style}>
          <Typography id="modal-modal-title" variant="h6" component="h2">
            Add New Office
          </Typography>
          <Stack spacing={2} sx={{ mt: 2 }}>
            <TextField
              autoFocus
              margin="dense"
              id="name"
              label="Office Name"
              type="text"
              fullWidth
              variant="outlined"
              value={newOfficeName}
              onChange={(e) => setNewOfficeName(e.target.value)}
            />
            <FormControl fullWidth>
              <InputLabel id="company-select-label">Company</InputLabel>
              <Select
                labelId="company-select-label"
                id="company-select"
                value={selectedCompanyId}
                label="Company"
                onChange={(e) => setSelectedCompanyId(e.target.value)}
              >
                {companies.map((company) => (
                  <MenuItem key={company._id} value={company._id}>
                    {company.name}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
            <Button variant="contained" onClick={handleCloseModal}>
              Cancel
            </Button>
            <Button
              variant="contained"
              color="primary"
              onClick={handleCreateOffice}
            >
              Confirm
            </Button>
          </Stack>
        </Box>
      </Modal>
    </Box>
  );
}
