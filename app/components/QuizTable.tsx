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
} from "@mui/material";
import { Replay, Edit, Delete } from "@mui/icons-material";
import { useRouter } from "next/navigation";
import { SaveQuizModal } from "./SaveQuizModal";
import { useState } from "react";
import { saveQuiz } from "@/hooks/useFirebaseStore";

export interface QuizItem {
  id: number;
  quizTitle: string;
  score: number;
  userId: string;
}

export interface QuizTableProps {
  data: QuizItem[];
}

const QuizTable = (props: QuizTableProps) => {
  const { data } = props;
  const [isOpen, setIsOpen] = useState<boolean>(false);
  const [id, setId] = useState<string>("");

  const [newTitle, setNewTitle] = useState<string>("");

  const router = useRouter();

  // Placeholder functions for actions
  const handleRetake = (id: number) => {
    console.log(`Retake quiz with id ${id}`);
    // console.log(getQuizData("H5ryxtsSkg28uVvWqa4m"));
    router.push(`/?quizId=${id}`);
    // navigate to /?quizId={id}
    // make sure home page reads that if there is a query param in the URL, fetch that quiz data from FireStore and load it into the state w/ setQuizData(data);

    // WHEN they SAVE AGAIN....
    // IF there is a quizID in the URL...
    // Find that quiz in the DB, update ONLY the score with the new one.
    // If you don't update the old DB entry, it will simply create a new one with their new score so they'll have dupe.
  };

  const handleSave = async () => {
    // We only need to pass in the ID and the new title to this function
    await saveQuiz({ quizTitle: newTitle }, id);
    setIsOpen(false);
    window.location.reload();
  };

  const handleEdit = (id: string) => {
    setIsOpen(true); //open modal
    setId(id); //set the ID so we know what we're currently editting

    console.log(`Edit quiz with id ${id}`);
    // Edit the title of the quiz only
    // Call something in firestore to update just that param...
  };

  const handleDelete = (id: string) => {
    console.log(`Delete quiz with id ${id}`);
    // Delete ONLY that collection/id from the DB.
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
                <TableCell>{row.score}</TableCell>
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
                      onClick={() => handleDelete(row.id)}
                      color="error"
                    >
                      <Delete />
                    </IconButton>
                  </Tooltip>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
      <SaveQuizModal
        isOpen={isOpen}
        handleSetText={setNewTitle}
        handleOnSubmit={handleSave}
      />
    </>
  );
};

export default QuizTable;
