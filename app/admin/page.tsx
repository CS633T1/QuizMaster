"use client";

import { useFirebaseAuth } from "@/hooks/useFirebaseAuth";
import { Delete } from "@mui/icons-material";
import {
  List,
  ListItem,
  ListItemText,
  Paper,
  Typography,
  Container,
  IconButton,
  Tooltip,
} from "@mui/material";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

export default function AdminPage() {
  const [accounts, setAccounts] = useState([]);
  const [IsLoading, setIsLoading] = useState(true);
  const [error, setError] = useState("");
  const { user, loading, deleteAccount } = useFirebaseAuth();
  const router = useRouter();

  useEffect(() => {
    if (!loading && !user) {
      router.push("/");
    } else if (user) {
      user.email == "admin@gmail.com" &&
        fetch("/api/admin/get-users")
          .then((res) => {
            if (!res.ok) throw new Error("Failed to fetch users");
            return res.json();
          })
          .then((data) => {
            setAccounts(data.users);
            setIsLoading(false);
          })
          .catch((err) => {
            setError(err.message);
            setIsLoading(false);
          });
    }
  }, [user, loading, router]);

  if (!user) {
    return null; // This will prevent any flash of content before redirect
  }

  const handleDelete = async (uid: string) => {
    try {
      const response = await fetch("/api/admin/delete-user", {
        method: "POST",
        headers: {
          "Content-Type": "application/json", // Ensure the request is sent as JSON
        },
        body: JSON.stringify({ uid }), // Properly stringify the payload
      });

      if (!response.ok) {
        throw new Error("Failed to delete user");
      }

      const data = await response.json();
      alert("User deleted successfully!");
    } catch (err: any) {
      console.error(err.message || "Failed to delete user");
    }
  };

  return (
    <Container>
      <Typography variant="h4" gutterBottom>
        User Accounts
      </Typography>
      <Paper>
        <List>
          {accounts.length > 0 ? (
            accounts.map((account: any) => (
              <ListItem key={account.uid} divider>
                <ListItemText
                  primary={account.email}
                  secondary={`User ID: ${account.uid}`}
                />
                <Tooltip title="Delete">
                  <IconButton
                    onClick={() => handleDelete(account.uid)}
                    color="error"
                  >
                    <Delete />
                  </IconButton>
                </Tooltip>
              </ListItem>
            ))
          ) : (
            <Typography variant="body1" sx={{ p: 2 }}>
              No users found.
            </Typography>
          )}
        </List>
      </Paper>
    </Container>
  );
}
