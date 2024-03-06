import React from "react";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import Typography from "@mui/material/Typography";
import Modal from "@mui/material/Modal";
import { TextField, Stack } from "@mui/material";
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
  const columns = [
    { field: "id", headerName: "ID", width: 90, hide: true },
    { field: "name", headerName: "Name", width: 200 },
    { field: "employees", headerName: "Employees", width: 300 },
    // Other columns as needed...
  ];

  // Static rows as an example, replace with your own data
  const rows = [
    { id: 1, name: "Company A", employees: "John, Jane" },
    { id: 2, name: "Company B", employees: "Doe, Ann" },
    // More rows as needed...
  ];

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
          <Button variant="contained" color="primary">
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
        open={false}
        aria-labelledby="modal-modal-title"
        aria-describedby="modal-modal-description"
      >
        <Box sx={style}>
          {/* Modal content placeholders */}
          <Typography id="modal-modal-title" variant="h6" component="h2">
            Modal Title
          </Typography>
          <Stack spacing={2} sx={{ mt: 2 }}>
            <TextField
              autoFocus
              margin="dense"
              id="name"
              label="Name"
              type="text"
              fullWidth
              variant="outlined"
            />
            <Button variant="contained">Cancel</Button>
            <Button variant="contained" color="primary">
              Confirm
            </Button>
          </Stack>
        </Box>
      </Modal>
    </Box>
  );
}
