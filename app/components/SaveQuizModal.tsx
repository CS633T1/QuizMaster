import {
  Dialog,
  DialogContent,
  Typography,
  TextField,
  Button,
} from "@mui/material";

export const SaveQuizModal = (props: {
  isOpen: boolean;
  handleSetText: any;
  handleOnSubmit: any;
}) => {
  return (
    <Dialog open={props.isOpen}>
      <DialogContent
        sx={{ display: "flex", flexDirection: "column", gap: "10px" }}
      >
        <Typography variant="h5" align="center" gutterBottom>
          Enter Quiz Title
        </Typography>
        <TextField onChange={(e) => props.handleSetText(e?.target?.value)} />
        <Button variant="contained" onClick={props.handleOnSubmit}>
          Save Quiz
        </Button>
      </DialogContent>
    </Dialog>
  );
};
