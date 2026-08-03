import { useEffect, useState } from "react";
import {
  Box, Paper, Typography, Table, TableHead, TableBody,
  TableRow, TableCell, TableContainer, IconButton, Tooltip,
  Chip, TextField, InputAdornment, CircularProgress,
} from "@mui/material";
import SearchIcon from "@mui/icons-material/Search";
import DeleteIcon from "@mui/icons-material/Delete";
import LockIcon from "@mui/icons-material/Lock";
import PersonOutlinedIcon from "@mui/icons-material/PersonOutlined";
import AdminPanelSettingsIcon from "@mui/icons-material/AdminPanelSettings";
import { toast } from "react-hot-toast";
import { getUsers, deleteUser } from "../../services/userService";
import type { User } from "../../types/user";
import ConfirmDialog from "../../components/common/ConfirmDialog";
import { useAuth } from "../../context/AuthContext";

const SUPER_ADMIN_EMAIL = "leader@gmail.com"; // keep in sync with backend app.super-admin-email

export default function Users() {
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [deleteId, setDeleteId] = useState<number | null>(null);

  const load = async () => {
    setLoading(true);
    try {
      const res = await getUsers();
      setUsers(res.data ?? []);
    } catch {
      toast.error("Failed to load users");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { load(); }, []);

  const handleDelete = async () => {
    if (!deleteId) return;
    try {
      await deleteUser(deleteId);
      toast.success("User deleted");
      load();
    } catch (err: any) {
      toast.error(err?.response?.data?.message ?? "Failed to delete user");
    }
  };

  const filtered = users.filter(
    (u) =>
      u.name.toLowerCase().includes(search.toLowerCase()) ||
      u.email.toLowerCase().includes(search.toLowerCase())
  );

  const adminCount = users.filter((u) => u.role === "ADMIN").length;
  const publisherCount = users.filter((u) => u.role === "PUBLISHER").length;
  const userCount = users.filter((u) => u.role === "USER").length;

  return (
    <Paper sx={{ p: 3, borderRadius: 3 }}>
      <Box display="flex" justifyContent="space-between" alignItems="flex-start" mb={3}>
        <Box>
          <Typography variant="h5" fontWeight={700}>Users</Typography>
          <Typography variant="body2" color="text.secondary">
            {users.length} total users
          </Typography>
        </Box>
        <Box display="flex" gap={1}>
          <Chip
            icon={<AdminPanelSettingsIcon sx={{ fontSize: "14px !important" }} />}
            label={`${adminCount} Admin`}
            size="small"
            sx={{ fontWeight: 700, bgcolor: "rgba(239,68,68,0.1)", color: "#ef4444" }}
          />
          <Chip
            label={`${publisherCount} Publishers`}
            size="small"
            sx={{ fontWeight: 700, bgcolor: "rgba(249,115,22,0.1)", color: "#f97316" }}
          />
          <Chip
            icon={<PersonOutlinedIcon sx={{ fontSize: "14px !important" }} />}
            label={`${userCount} Users`}
            size="small"
            sx={{ fontWeight: 700, bgcolor: "rgba(34,197,94,0.1)", color: "#22c55e" }}
          />
        </Box>
      </Box>

      <TextField
        placeholder="Search users..."
        value={search}
        onChange={(e) => setSearch(e.target.value)}
        size="small"
        sx={{ mb: 2, maxWidth: 320 }}
        InputProps={{
          startAdornment: (
            <InputAdornment position="start">
              <SearchIcon sx={{ fontSize: 18 }} />
            </InputAdornment>
          ),
        }}
      />

      {loading ? (
        <Box display="flex" justifyContent="center" py={6}>
          <CircularProgress />
        </Box>
      ) : (
        <TableContainer>
          <Table size="small">
            <TableHead>
              <TableRow>
                <TableCell>#</TableCell>
                <TableCell>Name</TableCell>
                <TableCell>Email</TableCell>
                <TableCell>Role</TableCell>
                <TableCell align="center">Actions</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {filtered.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={5} align="center" sx={{ py: 4, color: "text.secondary" }}>
                    No users found
                  </TableCell>
                </TableRow>
              ) : (
                filtered.map((user, idx) => (
                  <TableRow key={user.id} hover>
                    <TableCell>{idx + 1}</TableCell>
                    <TableCell sx={{ fontWeight: 600 }}>{user.name}</TableCell>
                    <TableCell>{user.email}</TableCell>
                    <TableCell>
                      <Chip
                        label={user.role}
                        size="small"
                        icon={
                          user.role === "ADMIN"
                            ? <AdminPanelSettingsIcon sx={{ fontSize: "14px !important" }} />
                            : <PersonOutlinedIcon sx={{ fontSize: "14px !important" }} />
                        }
                        sx={{
                          fontWeight: 700, fontSize: "0.7rem",
                          bgcolor: user.role === "ADMIN" ? "rgba(239,68,68,0.1)"
                            : user.role === "PUBLISHER" ? "rgba(249,115,22,0.1)"
                            : "rgba(34,197,94,0.1)",
                          color: user.role === "ADMIN" ? "#ef4444"
                            : user.role === "PUBLISHER" ? "#f97316"
                            : "#22c55e",
                        }}
                      />
                    </TableCell>
                    <TableCell align="center">
                      {user.role === "ADMIN" ? (
                        <Tooltip title="The admin account can't be deleted">
                          <span>
                            <IconButton size="small" disabled>
                              <LockIcon fontSize="small" />
                            </IconButton>
                          </span>
                        </Tooltip>
                      ) : (
                        <Tooltip title="Delete User">
                          <IconButton size="small" color="error" onClick={() => setDeleteId(user.id)}>
                            <DeleteIcon fontSize="small" />
                          </IconButton>
                        </Tooltip>
                      )}
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </TableContainer>
      )}

      <ConfirmDialog
        open={deleteId !== null}
        title="Delete User"
        message="Are you sure you want to delete this user? This action cannot be undone."
        onClose={() => setDeleteId(null)}
        onConfirm={handleDelete}
      />
    </Paper>
  );
}
