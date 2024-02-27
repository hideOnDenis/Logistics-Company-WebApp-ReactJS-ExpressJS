import { useEffect } from "react";
import Box from "@mui/material/Box";
import { DataGrid, GridToolbar } from "@mui/x-data-grid";
import { useDispatch, useSelector } from "react-redux";
import { fetchUsers, toggleAdminStatus } from "../features/users/userSlice";
import Button from "@mui/material/Button";

export default function UsersPage() {
  const dispatch = useDispatch();
  const { users, isLoading, error } = useSelector((state) => state.users);

  useEffect(() => {
    dispatch(fetchUsers());
  }, [dispatch]);

  const handleToggleAdmin = async (userId) => {
    await dispatch(toggleAdminStatus(userId));
    dispatch(fetchUsers());
  };

  const columns = [
    { field: "id", headerName: "ID", width: 90, hide: true },
    { field: "email", headerName: "Email", width: 200 },
    {
      field: "isAdmin",
      headerName: "Is Admin?",
      width: 130,
      valueGetter: (params) => (params.row.isAdmin ? "Yes" : "No"),
    },
    {
      field: "actions",
      headerName: "Actions",
      sortable: false,
      width: 150,
      renderCell: (params) => (
        <Button
          variant="contained"
          color={params.row.isAdmin ? "secondary" : "primary"}
          onClick={() => handleToggleAdmin(params.row.id)}
        >
          {params.row.isAdmin ? "Make Client" : "Make Admin"}
        </Button>
      ),
    },
  ];

  const rows = users.map((user, index) => ({
    ...user,
    id: user._id || index,
  }));

  return (
    // Adjusted Box styles to fill the whole viewport
    <Box
      sx={{
        height: "100vh",
        width: "100%",
        "& .MuiDataGrid-root": { border: 0 },
      }}
    >
      <DataGrid
        rows={rows}
        columns={columns}
        pageSize={5}
        loading={isLoading}
        components={{ Toolbar: GridToolbar }}
        disableSelectionOnClick
      />
      {error && <p>Error: {error}</p>}
    </Box>
  );
}
