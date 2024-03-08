import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchOffices } from "../features/offices/officeSlice";
import { fetchCompaniesWithEmployees } from "../features/companies/companySlice";
import {
  createOffice,
  addUserToOffice,
  removeUserFromOffice,
  deleteOffice,
} from "../features/offices/officeSlice"; // Assuming you have this action
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

export default function OfficePage() {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const [modalOpen, setModalOpen] = useState(false);
  const [newOfficeName, setNewOfficeName] = useState("");
  const [selectedCompanyId, setSelectedCompanyId] = useState("");
  const [addUserModalOpen, setAddUserModalOpen] = useState(false);
  const [selectedUser, setSelectedUser] = useState("");
  const [selectedOffice, setSelectedOffice] = useState("");
  const [addUserError, setAddUserError] = useState("");

  // Fetch offices and companies when component mounts
  useEffect(() => {
    dispatch(fetchOffices());
    dispatch(fetchCompaniesWithEmployees());
  }, [dispatch]);

  const { offices, status, error } = useSelector((state) => state.offices);
  const companies = useSelector((state) => state.companies.items); // Adjust according to your state structure

  const handleBackToDashboard = () => {
    navigate("/employee/dashboard");
  };

  const handleOpenModal = () => setModalOpen(true);
  const handleCloseModal = () => setModalOpen(false);

  const [removeUserModalOpen, setRemoveUserModalOpen] = useState(false);
  const [userToRemove, setUserToRemove] = useState("");

  const handleOpenAddUserModal = (officeId) => {
    const office = offices.find((office) => office._id === officeId);
    setSelectedOffice(office);
    setAddUserModalOpen(true);
  };

  const handleOpenRemoveUserModal = (officeId) => {
    setSelectedOffice(offices.find((office) => office._id === officeId));
    setRemoveUserModalOpen(true);
  };

  const handleCreateOffice = () => {
    console.log("Selected Company ID:", selectedCompanyId); // Debugging line

    if (!newOfficeName || !selectedCompanyId) {
      console.log("Office name and company selection are required.");
      return;
    }

    const officeData = {
      name: newOfficeName,
      company: selectedCompanyId,
    };
    dispatch(createOffice(officeData));

    handleCloseModal();
  };

  const handleDeleteOfficeDirectly = async (officeId) => {
    await dispatch(deleteOffice(officeId))
      .unwrap()
      .then(() => {
        // Optionally, trigger a refresh of the offices list
        dispatch(fetchOffices());
      })
      .catch((error) => {
        console.error("Failed to delete office", error);
      });
  };

  const handleAddUserToSelectedOffice = (officeId, userId) => {
    if (!officeId || !userId) {
      setAddUserError("Please select a user.");
      return;
    }

    dispatch(addUserToOffice({ officeId, userId }))
      .unwrap()
      .then(() => {
        setAddUserModalOpen(false);
        setSelectedUser("");
        setAddUserError("");
        // Optionally, trigger a refresh or update of office details to reflect the added user
        dispatch(fetchOffices());
      })
      .catch((error) => {
        setAddUserError(error.message || "Failed to add user to office.");
      });
  };

  const handleRemoveUserFromSelectedOffice = async () => {
    await dispatch(
      removeUserFromOffice({
        officeId: selectedOffice._id,
        userId: userToRemove,
      })
    )
      .unwrap()
      .then(() => {
        setRemoveUserModalOpen(false);
        setUserToRemove("");
        // Refresh or update the office details
        dispatch(fetchOffices());
      })
      .catch((error) => {
        console.error("Failed to remove user from office", error);
      });
  };

  const columns = [
    { field: "id", headerName: "ID", width: 90, hide: true },
    { field: "name", headerName: "Name", width: 150 },
    { field: "employees", headerName: "Employees", width: 300 },
    { field: "companyName", headerName: "Company", width: 200 },
    {
      field: "actions",
      headerName: "Add User",
      sortable: false,
      renderCell: (params) => (
        <Button
          variant="contained"
          color="primary"
          onClick={() => handleOpenAddUserModal(params.row._id)}
        >
          Add User
        </Button>
      ),
      width: 150,
    },
    {
      field: "removeUserAction",
      headerName: "Remove User",
      width: 150,
      renderCell: (params) => (
        <Button
          variant="contained"
          color="secondary"
          onClick={() => handleOpenRemoveUserModal(params.row._id)}
        >
          Remove User
        </Button>
      ),
      disableClickEventBubbling: true,
    },
    {
      field: "deleteAction",
      headerName: "Delete",
      sortable: false,
      width: 100,
      renderCell: (params) => (
        <Button
          variant="contained"
          color="secondary"
          onClick={() => handleDeleteOfficeDirectly(params.row._id)}
        >
          Delete
        </Button>
      ),
    },
  ];

  // Static rows as an example, replace with your own data
  const rows = offices.map((office) => ({
    ...office,
    id: office._id,
    employees: office.employees.map((emp) => `${emp.email}`).join(", "),
    companyName: office.company.name,
  }));

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
          <Button
            variant="contained"
            color="success"
            onClick={handleBackToDashboard}
          >
            Back to Dashboard
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

      <Modal
        open={addUserModalOpen}
        onClose={() => setAddUserModalOpen(false)}
        aria-labelledby="add-user-modal-title"
        aria-describedby="add-user-modal-description"
      >
        <Box sx={style}>
          <Typography id="add-user-modal-title" variant="h6" component="h2">
            Add User to Office
          </Typography>
          <FormControl fullWidth sx={{ mt: 2 }}>
            <InputLabel id="user-select-label">User</InputLabel>
            <Select
              labelId="user-select-label"
              id="user-select"
              value={selectedUser}
              onChange={(e) => setSelectedUser(e.target.value)}
              // Add a displayEmpty property if you want to show an empty option as default
            >
              {(selectedOffice?.company?.employees || []).map((user) => (
                <MenuItem key={user._id} value={user._id}>
                  {user.email}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
          <Button
            variant="contained"
            color="primary"
            onClick={() => {
              handleAddUserToSelectedOffice(selectedOffice._id, selectedUser);
            }}
            sx={{ mt: 2 }}
          >
            Confirm
          </Button>
        </Box>
      </Modal>
      <Modal
        open={removeUserModalOpen}
        onClose={() => setRemoveUserModalOpen(false)}
        aria-labelledby="remove-user-modal-title"
        aria-describedby="remove-user-modal-description"
      >
        <Box sx={style}>
          <Typography id="remove-user-modal-title" variant="h6" component="h2">
            Remove User from Office
          </Typography>
          <FormControl fullWidth sx={{ mt: 2 }}>
            <InputLabel id="remove-user-select-label">User</InputLabel>
            <Select
              labelId="remove-user-select-label"
              id="remove-user-select"
              value={userToRemove}
              label="User"
              onChange={(e) => setUserToRemove(e.target.value)}
            >
              {/* Assuming each user has a unique ID and email */}
              {selectedOffice?.company?.employees.map((user) => (
                <MenuItem key={user._id} value={user._id}>
                  {user.email}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
          <Button
            variant="contained"
            color="primary"
            onClick={handleRemoveUserFromSelectedOffice}
            sx={{ mt: 2 }}
          >
            Remove User
          </Button>
          {addUserError && (
            <Typography color="error" sx={{ mt: 2 }}>
              {addUserError}
            </Typography>
          )}
        </Box>
      </Modal>
    </Box>
  );
}
