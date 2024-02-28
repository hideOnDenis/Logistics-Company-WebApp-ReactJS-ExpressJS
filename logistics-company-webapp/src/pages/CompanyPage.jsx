import React, { useEffect, useState } from "react";
import Box from "@mui/material/Box";
import { DataGrid, GridToolbar } from "@mui/x-data-grid";
import { useDispatch, useSelector } from "react-redux";
import {
  fetchCompanies,
  addCompany,
  deleteCompany,
  addUserToCompany,
} from "../features/companies/companySlice";
import { fetchUsers } from "../features/users/userSlice";
import Button from "@mui/material/Button";
import Typography from "@mui/material/Typography";
import Modal from "@mui/material/Modal";
import { TextField, Stack, Select, MenuItem } from "@mui/material";

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

export default function CompaniesPage() {
  const [open, setOpen] = useState(false);
  const [companyName, setCompanyName] = useState("");
  const [addUserToCompanyOpen, setAddUserToCompanyOpen] = useState(false);
  const [selectedCompany, setSelectedCompany] = useState("");
  const [selectedUser, setSelectedUser] = useState("");
  const handleOpen = () => setOpen(true);
  const handleClose = () => {
    setOpen(false);
    setCompanyName(""); // Reset company name on modal close
  };

  const handleOpenAddUserToCompanyModal = () => setAddUserToCompanyOpen(true);
  const handleCloseAddUserToCompanyModal = () => setAddUserToCompanyOpen(false);

  const dispatch = useDispatch();

  const { users } = useSelector((state) => state.users);

  useEffect(() => {
    dispatch(fetchUsers());
    dispatch(fetchCompanies());
  }, [dispatch]);

  const {
    items: companies,
    status: companiesStatus,
    error: companiesError,
  } = useSelector((state) => state.companies);

  const handleAddCompany = async () => {
    if (companyName.trim()) {
      const actionResult = await dispatch(addCompany({ name: companyName }));
      if (addCompany.fulfilled.match(actionResult)) {
        dispatch(fetchCompanies()); // Refetch companies list to update UI
      }
      handleClose(); // Close modal after attempting to add company
    }
  };

  const handleDeleteCompany = async (companyId) => {
    await dispatch(deleteCompany(companyId));
    // Optionally, refetch companies list to reflect the deletion
    dispatch(fetchCompanies());
  };

  const handleAddUserToCompanySubmit = async () => {
    const actionResult = await dispatch(
      addUserToCompany({ companyId: selectedCompany, userId: selectedUser })
    );
    if (addUserToCompany.fulfilled.match(actionResult)) {
      dispatch(fetchCompanies()); // Refetch companies list to update UI
    }
    handleCloseAddUserToCompanyModal(); // Close the modal
  };

  const columns = [
    { field: "id", headerName: "ID", width: 90, hide: true },
    { field: "name", headerName: "Name", width: 200 },
    {
      field: "employees",
      headerName: "Employees",
      width: 300,
      valueGetter: (params) =>
        params.row.employees.map((e) => e.email).join(", "),
    },
    {
      field: "actions",
      headerName: "Actions",
      sortable: false,
      width: 150,
      renderCell: (params) => (
        <>
          <Button
            variant="contained"
            color="secondary"
            onClick={() => handleDeleteCompany(params.row.id)}
          >
            Delete
          </Button>
        </>
      ),
    },
  ];

  const rows = companies.map((company, index) => ({
    ...company,
    id: company._id, // Use the `_id` provided by MongoDB
    employees: company.employees || [], // Ensure there is always an array to map over
  }));

  return (
    <Box sx={{ height: "100vh", width: "100%" }}>
      <Box
        sx={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          p: 2,
        }}
      >
        <Typography variant="h4" component="h1">
          Companies
        </Typography>
        <Button
          variant="contained"
          color="primary"
          onClick={handleOpenAddUserToCompanyModal}
          sx={{ marginLeft: "1300px" }}
        >
          Add User to Company
        </Button>
        <Button variant="contained" color="primary" onClick={handleOpen}>
          Add Company
        </Button>
      </Box>
      <DataGrid
        rows={rows}
        columns={columns}
        pageSize={5}
        loading={companiesStatus === "loading"}
        components={{ Toolbar: GridToolbar }}
        disableSelectionOnClick
        getRowId={(row) => row.id}
      />
      {companiesError && <p>Error: {companiesError}</p>}
      <Modal
        open={open}
        onClose={handleClose}
        aria-labelledby="modal-modal-title"
        aria-describedby="modal-modal-description"
      >
        <Box sx={style}>
          <Typography id="modal-modal-title" variant="h6" component="h2">
            Add New Company
          </Typography>
          <Stack spacing={2} sx={{ mt: 2 }}>
            <TextField
              autoFocus
              margin="dense"
              id="name"
              label="Company Name"
              type="text"
              fullWidth
              variant="outlined"
              value={companyName} // Bind TextField value to companyName state
              onChange={(e) => setCompanyName(e.target.value)} // Update companyName state on change
            />
            <Button onClick={handleClose} variant="contained">
              Cancel
            </Button>
            <Button
              onClick={handleAddCompany} // Use the handleAddCompany function to add a new company
              variant="contained"
              color="primary"
            >
              Add Company
            </Button>
          </Stack>
        </Box>
      </Modal>
      <Modal
        open={addUserToCompanyOpen}
        onClose={handleCloseAddUserToCompanyModal}
        aria-labelledby="add-user-to-company-modal-title"
        aria-describedby="add-user-to-company-modal-description"
      >
        <Box sx={style}>
          <Typography
            id="add-user-to-company-modal-title"
            variant="h6"
            component="h2"
          >
            Add User to Company
          </Typography>
          <Stack spacing={2} sx={{ mt: 2 }}>
            <Select
              value={selectedCompany}
              onChange={(e) => setSelectedCompany(e.target.value)}
              displayEmpty
              inputProps={{ "aria-label": "Select Company" }}
            >
              {companies.map((company) => (
                <MenuItem key={company._id} value={company._id}>
                  {company.name}
                </MenuItem>
              ))}
            </Select>
            <Select
              value={selectedUser}
              onChange={(e) => setSelectedUser(e.target.value)}
              displayEmpty
              fullWidth
              inputProps={{ "aria-label": "Select User" }}
            >
              {users
                .filter((user) => {
                  // Assuming companies are populated with employee details
                  const selectedCompanyObj = companies.find(
                    (company) => company._id === selectedCompany
                  );
                  // Filter out users already in the selected company
                  return !selectedCompanyObj?.employees.some(
                    (employee) => employee._id === user._id
                  );
                })
                .map((user) => (
                  <MenuItem key={user._id} value={user._id}>
                    {user.email}
                  </MenuItem>
                ))}
            </Select>

            <Button
              onClick={handleAddUserToCompanySubmit}
              variant="contained"
              color="primary"
            >
              Add User to Company
            </Button>
          </Stack>
        </Box>
      </Modal>
    </Box>
  );
}
