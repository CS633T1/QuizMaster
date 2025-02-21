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
  Box,
} from "@mui/material";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { deleteUser } from "../server-actions/deleteUser";
import { deletePastQuizByUser, getAllQuiz } from "@/hooks/useFirebaseStore";
import QuizTable from "../components/QuizTable";

export default function AdminPage() {
  const [accounts, setAccounts] = useState([]);
  const [IsLoading, setIsLoading] = useState(true);
  const [error, setError] = useState("");
  const { user, loading, deleteAccount } = useFirebaseAuth();
  const router = useRouter();
  const [quizData, setQuizData] = useState<any>();

  useEffect(() => {
    if (!loading && !user) {
      router.push("/");
    } else if (user && user?.email === "admin@gmail.com") {
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
      const fetchData = async () => {
        setQuizData(await getAllQuiz());
      };
      fetchData();
    } else if (user && user?.email !== "admin@gmail.com") {
      router.push("/");
    }
  }, [user, loading, router]);

  if (!user) {
    return null; // This will prevent any flash of content before redirect
  }

  const handleDelete = async (uid: string, email: string) => {
    console.log("Delete user with ID ", uid);
    try {
      await deleteUser(user.toJSON(), uid);
      // if deleteUserRes was successful, which it is if it hasnt errored out at this line delete all quizzes associated with that email....
      await deletePastQuizByUser(email);
      window.location.reload();
    } catch (error) {
      setError(`${error}`);
    }
  };

  return (
    <Container sx={{ marginTop: "30px" }}>
      <Typography variant="h4" gutterBottom>
        User Accounts
      </Typography>
      {error && <h1>{error}</h1>}
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
                    onClick={() => handleDelete(account.uid, account?.email)}
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
      <Box sx={{ marginTop: "30px" }}>
        <Typography variant="h4" gutterBottom>
          All Quizzes
        </Typography>
        <QuizTable data={quizData} />
      </Box>
    </Container>
  );
}
