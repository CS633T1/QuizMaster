"use client";

import type React from "react";
import { useState } from "react";
import { useRouter } from "next/navigation";
import {
  Button,
  Container,
  Typography,
  Box,
  Paper,
  Grid,
  List,
  ListItem,
  ListItemText,
  ListItemIcon,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  Divider,
  Switch,
  TextField,
} from "@mui/material";
import {
  AccountCircle,
  Notifications,
  Security,
  DeleteForever,
} from "@mui/icons-material";
import { useFirebaseAuth } from "@/hooks/useFirebaseAuth";

export default function UserSettings() {
  const router = useRouter();
  const { user, logOut, deleteAccount } = useFirebaseAuth(); //if there is a user, then you are logged in

  const [openDialog, setOpenDialog] = useState(false);

  const handleOpenDialog = () => setOpenDialog(true);
  const handleCloseDialog = () => setOpenDialog(false);

  const handleDelete = async () => {
    console.log("Deleting account...");
    try {
      await deleteAccount();
      router.push("/");
    } catch (error: any) {
      console.error("Error deleting account:", error);

      switch (error.code) {
        case "auth/requires-recent-login":
          window?.alert(
            "For security reasons, please log out and log back in before deleting your account."
          );
          break;
        case "auth/wrong-password":
          window?.alert(
            "The password you entered is incorrect. Please try again."
          );
          break;
        case "auth/too-many-requests":
          window?.alert(
            "Too many unsuccessful attempts. Please try again later."
          );
          break;
        case "auth/network-request-failed":
          window?.alert(
            "Network error. Please check your internet connection and try again."
          );
          break;
        case "auth/user-token-expired":
          window?.alert(
            "Your session has expired. Please log out and log back in."
          );
          break;
        default:
          window?.alert(
            "An unexpected error occurred. Please try again later."
          );
      }
      await logOut();
      router.push("/login");
    }
  };

  return (
    <Container maxWidth="md">
      <Box sx={{ my: 4 }}>
        <Typography variant="h4" component="h1" gutterBottom>
          User Settings
        </Typography>
        <Grid container spacing={3}>
          <Grid item xs={12} md={9}>
            <Paper sx={{ p: 3 }}>
              <Typography variant="h6" gutterBottom>
                Account Settings
              </Typography>
              <Box component="form" noValidate autoComplete="off">
                <TextField
                  margin="normal"
                  fullWidth
                  id="email"
                  name="email"
                  disabled
                  value={user?.email}
                />
              </Box>
              <Box sx={{ mt: 3 }}>
                <Typography variant="h6" gutterBottom>
                  Reset Password
                </Typography>
                <Button
                  onClick={() => router?.push("/reset-password")}
                  type="submit"
                  variant="contained"
                  sx={{ mt: 3, mb: 2 }}
                >
                  Reset Password
                </Button>
              </Box>
              <Divider sx={{ my: 3 }} />
              <Box>
                <Typography variant="h6" gutterBottom color="error">
                  Danger Zone
                </Typography>
                <Button
                  variant="outlined"
                  color="error"
                  startIcon={<DeleteForever />}
                  onClick={handleOpenDialog}
                >
                  Delete Account
                </Button>
              </Box>
            </Paper>
          </Grid>
        </Grid>

        <Dialog
          open={openDialog}
          onClose={handleCloseDialog}
          aria-labelledby="alert-dialog-title"
          aria-describedby="alert-dialog-description"
        >
          <DialogTitle id="alert-dialog-title">
            {"Are you sure you want to delete your account?"}
          </DialogTitle>
          <DialogContent>
            <DialogContentText id="alert-dialog-description">
              This action cannot be undone. All of your data will be permanently
              deleted.
            </DialogContentText>
          </DialogContent>
          <DialogActions>
            <Button onClick={handleCloseDialog}>Cancel</Button>
            <Button onClick={handleDelete} color="error" autoFocus>
              Delete
            </Button>
          </DialogActions>
        </Dialog>
      </Box>
    </Container>
  );
}
