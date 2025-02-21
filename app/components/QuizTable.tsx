import type React from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  IconButton,
  Tooltip,
  Button,
} from "@mui/material";
import { Replay, Edit, Delete } from "@mui/icons-material";
import { useRouter } from "next/navigation";
import { SaveQuizModal } from "./SaveQuizModal";
import { useState } from "react";
import { deleteQuiz, saveQuiz } from "@/hooks/useFirebaseStore";
import DeleteQuizModal from "./DeleteQuizModal";
import ContentCopyIcon from "@mui/icons-material/ContentCopy";

export interface QuizItem {
  id: string;
  quizTitle: string;
  score: number;
  userId: string;
}

export interface QuizTableProps {
  data: QuizItem[];
}

const QuizTable = (props: QuizTableProps) => {
  const { data } = props;
  const [isSaveModalOpen, setIsSaveModalOpen] = useState<boolean>(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState<boolean>(false);

  const [id, setId] = useState<string>("");

  const [newTitle, setNewTitle] = useState<string>("");
  const [copied, setCopied] = useState<string>("");
  const dev = process.env.NODE_ENV !== "production";
  // API Base URL
  const base_url = dev
    ? "http://localhost:3000"
    : process.env.NEXT_PUBLIC_API_URL;

  const router = useRouter();

  const handleRetake = (id: string) => {
    // navigate to /?quizId={id}
    // make sure home page reads that if there is a query param in the URL, fetch that quiz data from FireStore and load it into the state w/ setQuizData(data);

    // WHEN they SAVE AGAIN....
    // IF there is a quizID in the URL...
    // Find that quiz in the DB, update ONLY the score with the new one.
    // If you don't update the old DB entry, it will simply create a new one with their new score so they'll have dupe.
    console.log(`Retake quiz with id ${id}`);
    router.push(`/quiz/?quizId=${id}`);
  };

  const handleSave = async () => {
    // We only need to pass in the ID and the new title to this function
    await saveQuiz({ quizTitle: newTitle }, id);
    setIsSaveModalOpen(false);
    window.location.reload();
  };

  const handleEdit = (id: string) => {
    // Edit the title of the quiz only
    // Call something in firestore to update just that param...
    setIsSaveModalOpen(true); //open modal
    setId(id); //set the ID so we know what we're currently editting
    console.log(`Edit quiz with id ${id}`);
  };

  const handleOpenDeleteModal = (id: string) => {
    setIsDeleteModalOpen(true);
    setId(id);
  };

  const handleDelete = async () => {
    // Delete ONLY that collection/id from the DB.
    console.log(`Delete quiz with id ${id}`);
    await deleteQuiz(id);
    window.location.reload();
  };

  const handleCopy = async (id: string) => {
    try {
      await navigator.clipboard.writeText(base_url + `/quiz?quizId=${id}`);
      setCopied(id);
      setTimeout(() => setCopied(""), 2000); // Reset "copied" state after 2 seconds
    } catch (err) {
      console.error("Failed to copy:", err);
    }
  };

  return (
    <>
      <TableContainer component={Paper}>
        <Table sx={{ minWidth: 650 }} aria-label="quiz table">
          <TableHead>
            <TableRow>
              <TableCell>ID</TableCell>
              <TableCell>Quiz Title</TableCell>
              <TableCell>Score</TableCell>
              <TableCell>User</TableCell>
              <TableCell align="center">Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {data?.map((row) => (
              <TableRow key={row.id}>
                <TableCell>{row.id}</TableCell>
                <TableCell>{row.quizTitle}</TableCell>
                <TableCell>{row.score}%</TableCell>
                <TableCell>{row.userId}</TableCell>
                <TableCell align="center">
                  <Tooltip title="Retake">
                    <IconButton
                      onClick={() => handleRetake(row.id)}
                      color="primary"
                    >
                      <Replay />
                    </IconButton>
                  </Tooltip>
                  <Tooltip title="Edit">
                    <IconButton
                      onClick={() => handleEdit(row.id)}
                      color="primary"
                    >
                      <Edit />
                    </IconButton>
                  </Tooltip>
                  <Tooltip title="Delete">
                    <IconButton
                      onClick={() => handleOpenDeleteModal(row.id)}
                      color="error"
                    >
                      <Delete />
                    </IconButton>
                  </Tooltip>
                  <Button
                    variant="outlined"
                    color="primary"
                    onClick={() => handleCopy(row.id)}
                    startIcon={<ContentCopyIcon />}
                  >
                    {copied == row.id ? "Copied!" : "Copy Link"}
                  </Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
      <SaveQuizModal
        isOpen={isSaveModalOpen}
        handleSetText={setNewTitle}
        handleOnSubmit={handleSave}
      />
      <DeleteQuizModal
        handleDelete={handleDelete}
        open={isDeleteModalOpen}
        onClose={() => setIsDeleteModalOpen(false)}
      />
    </>
  );
};

export default QuizTable;
