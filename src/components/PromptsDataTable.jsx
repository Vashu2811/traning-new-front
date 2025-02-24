import React, { useState } from "react";
import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  IconButton,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  TextField,
} from "@mui/material";
import AddCircleOutlineIcon from "@mui/icons-material/AddCircleOutline";
import DeleteIcon from "@mui/icons-material/Delete";
import EditIcon from "@mui/icons-material/Edit";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import AccessCourse from "./AccessCourse";

const PromptsDataTable = ({ prompts = [], onSavePrompt, courseId }) => {
  const [editDialogOpen, setEditDialogOpen] = useState(false);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [editPromptId, setEditPromptId] = useState(null);
  const [editedPromptName, setEditedPromptName] = useState("");
  const [editedPromptDescription, setEditedPromptDescription] = useState("");

  const { selectedCourse, storedUserId } = AccessCourse({ courseId });
  const CourseTrainerID = selectedCourse?.trainer_id;

  const handleEdit = (id, name) => {
    setEditPromptId(id);
    setEditedPromptName(name);
    setEditDialogOpen(true);
  };

  const handleSaveEdit = () => {
    if (!editedPromptName) {
      toast.error("Please fill in all fields", { autoClose: 3000 });
      return;
    }

    const updatedPrompt = {
      id: editPromptId,
      title: editedPromptName,
    };

    if (editPromptId) {
      onSavePrompt(updatedPrompt, editPromptId, null);
    } else {
      const newPrompt = {
        title: editedPromptName,
      };
      onSavePrompt(null, null, newPrompt);
    }

    setEditDialogOpen(false);
    clearFields();
  };

  const handleDelete = (id, name) => {
    setEditPromptId(id);
    setEditedPromptName(name);
    setDeleteDialogOpen(true);
  };
  const serialNumber = (index) => index + 1;

  const handleConfirmDelete = async () => {
    try {
      const editedPrompt = {
        id: editPromptId,
        is_deleted: "true",
      };
      await onSavePrompt(editedPrompt, editPromptId, null);
      setDeleteDialogOpen(false);
    } catch (error) {
      toast.error("Something Went Wrong, Please Try Again.", {
        autoClose: 3000,
      });
    }
  };

  const handleAddPrompt = () => {
    setEditPromptId(null);
    clearFields();
    setEditDialogOpen(true);
  };

  const clearFields = () => {
    setEditedPromptName("");
    setEditedPromptDescription("");
  };

  return (
    <>
      <ToastContainer />
      <div className="m-5 bg-[#1A1C1E] rounded-lg">
        <div className="flex items-center justify-between header-title">
          <h4 className="text-[#BDBEBE] font-semibold text-xl">Prompts</h4>

          {storedUserId === CourseTrainerID && (
            <Button
              variant="outlined"
              onClick={handleAddPrompt}
              sx={{
                background: "#5b52e7",
                borderColor: "#37383A",
                color: "#ffffff",
                fontFamily: "Poppins, sans-serif",
                "&:hover": {
                  background: "#5b52e7",
                  borderColor: "#37383A",
                },
              }}
            >
              <AddCircleOutlineIcon sx={{ mr: 1 }} />
              Add
            </Button>
          )}
        </div>

        <div className="prompts-section">
          {prompts?.length > 0 ? (
            <TableContainer
              component={Paper}
              className="p-5 rounded-md"
              sx={{ backgroundColor: "transparent" }}
            >
              <Table>
                <TableHead className="border-2 border-[#37383A] bg-[#292B2D]">
                  <TableRow sx={{ border: "2px solid #37383A" }}>
                    <TableCell
                      sx={{
                        fontSize: "16px",
                        color: "#BDBEBE",
                        fontFamily: "Poppins, sans-serif",
                      }}
                    >
                      ID
                    </TableCell>
                    <TableCell
                      sx={{
                        fontSize: "16px",
                        color: "#BDBEBE",
                        fontFamily: "Poppins, sans-serif",
                      }}
                    >
                      Name
                    </TableCell>
                    {storedUserId === CourseTrainerID && (
                      <TableCell
                        sx={{
                          fontSize: "16px",
                          color: "#BDBEBE",
                          fontFamily: "Poppins, sans-serif",
                        }}
                      >
                        Actions
                      </TableCell>
                    )}
                  </TableRow>
                </TableHead>
                <TableBody className="border-2 border-[#37383A] bg-[#1A1C1E]">
                  {prompts?.map((prompt, index) => (
                    <TableRow
                      key={prompt.id}
                      sx={{ border: "2px solid #37383A" }}
                    >
                      <TableCell
                        sx={{
                          color: "#BDBEBE",
                          fontFamily: "Poppins, sans-serif",
                          fontSize: "16px",
                        }}
                      >
                        {serialNumber(index)}
                      </TableCell>

                      <TableCell
                        sx={{
                          color: "#BDBEBE",
                          fontFamily: "Poppins, sans-serif",
                          fontSize: "16px",
                        }}
                      >
                        {prompt.title}
                      </TableCell>

                      {storedUserId === CourseTrainerID && (
                        <TableCell
                          sx={{
                            color: "#BDBEBE",
                            fontFamily: "Poppins, sans-serif",
                            fontSize: "16px",
                          }}
                          className="action-btn"
                        >
                          <IconButton
                            color="primary"
                            aria-label="edit"
                            onClick={() => handleEdit(prompt.id, prompt.title)}
                          >
                            <EditIcon />
                          </IconButton>
                          <IconButton
                            color="error"
                            aria-label="delete"
                            onClick={() =>
                              handleDelete(prompt.id, prompt.title)
                            }
                          >
                            <DeleteIcon />
                          </IconButton>
                        </TableCell>
                      )}
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TableContainer>
          ) : (
            <p className="p-10">No Prompts Found</p>
          )}

          <Dialog
            open={editDialogOpen}
            onClose={() => setEditDialogOpen(false)}
          >
            <DialogTitle
              sx={{
                py: 2,
                background: "#242728",
                color: "#BDBEBE",
                fontFamily: "Poppins, sans-serif",
              }}
            >
              {editPromptId ? "Edit Prompt" : "Add Prompt"}
            </DialogTitle>
            <DialogContent sx={{ background: "#242728", color: "#BDBEBE" }}>
              <TextField
                label="Name"
                value={editedPromptName}
                onChange={(e) => setEditedPromptName(e.target.value)}
                fullWidth
                sx={{
                  mb: 2,
                  "& input": {
                    color: "#BDBEBE !important",
                    fontFamily: "Poppins, sans-serif",
                  },
                  "& .MuiOutlinedInput-notchedOutline": {
                    borderColor: "#37383A !important",
                  },
                  "& .MuiInputLabel-outlined": {
                    color: "#BDBEBE !important",
                  },
                }}
              />
              {/* <TextField
                label="Description"
                value={editedPromptDescription}
                onChange={(e) => setEditedPromptDescription(e.target.value)}
                fullWidth
                sx={{
                  mb: 2,
                  "& input": {
                    color: "#BDBEBE !important",
                    fontFamily: "Poppins, sans-serif",
                  },
                  "& .MuiOutlinedInput-notchedOutline": {
                    borderColor: "#37383A !important",
                  },
                  "& .MuiInputLabel-outlined": {
                    color: "#BDBEBE !important",
                  },
                }}
              /> */}
            </DialogContent>
            <DialogActions sx={{ background: "#242728", color: "#BDBEBE" }}>
              <Button
                onClick={() => setEditDialogOpen(false)}
                sx={{ color: "#BDBEBE", fontFamily: "Poppins, sans-serif" }}
              >
                Cancel
              </Button>
              <Button
                onClick={handleSaveEdit}
                sx={{ color: "#5b52e7", fontFamily: "Poppins, sans-serif" }}
              >
                Save
              </Button>
            </DialogActions>
          </Dialog>

          <Dialog
            open={deleteDialogOpen}
            onClose={() => setDeleteDialogOpen(false)}
          >
            <DialogTitle
              sx={{
                py: 2,
                background: "#242728",
                color: "#BDBEBE",
                fontFamily: "Poppins, sans-serif",
              }}
            >
              Delete Prompt
            </DialogTitle>
            <DialogContent sx={{ background: "#242728", color: "#BDBEBE" }}>
              <p>
                Are you sure you want to delete the prompt "{editedPromptName}"?
              </p>
            </DialogContent>
            <DialogActions sx={{ background: "#242728", color: "#BDBEBE" }}>
              <Button
                onClick={() => setDeleteDialogOpen(false)}
                sx={{ color: "#BDBEBE", fontFamily: "Poppins, sans-serif" }}
              >
                Cancel
              </Button>
              <Button
                onClick={handleConfirmDelete}
                sx={{ color: "#5b52e7", fontFamily: "Poppins, sans-serif" }}
              >
                Delete
              </Button>
            </DialogActions>
          </Dialog>
        </div>
      </div>
    </>
  );
};

export default PromptsDataTable;
