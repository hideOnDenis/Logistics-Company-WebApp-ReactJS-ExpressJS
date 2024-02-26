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

  // Function to handle the admin status toggle and refetch users
  const handleToggleAdmin = async (userId) => {
    await dispatch(toggleAdminStatus(userId)); // Dispatch the toggle admin action
    dispatch(fetchUsers()); // Refetch users to update the UI with the new status
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
    <Box sx={{ height: 400, width: "100%" }}>
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
