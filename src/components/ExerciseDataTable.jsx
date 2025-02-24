import AddCircleOutlineIcon from "@mui/icons-material/AddCircleOutline";
import DeleteIcon from "@mui/icons-material/Delete";
import EditIcon from "@mui/icons-material/Edit";
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

import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

import { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";
import AccessCourse from "./AccessCourse";
import axios from "axios";

const ExerciseDataTable = ({ exercises = [], onSaveExercise, courseId }) => {
  
  const [fileUrl, setFileUrl] = useState("");

  const [editDialogOpen, setEditDialogOpen] = useState(false);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [editExerciseId, setEditExerciseId] = useState(null);
  const [editedExerciseTitle, setEditedExerciseTitle] = useState("");
  const [editedExerciseDescription, setEditedExerciseDescription] =
    useState("");
  const [editedExerciseNumber, setEditedExerciseNumber] = useState("");
  const [editedExerciseSteps, setEditedExerciseSteps] = useState("");
  const [uploadedPDF, setUploadedPDF] = useState(null);
  const { selectedCourse, storedUserId } = AccessCourse({ courseId });
  const [isDelete, setIsDelete] = useState(false);
  const CourseTrainerID = selectedCourse?.trainer_id;
  const [loading, setLoading] = useState(true);

  const handleEdit = (id, name, scenario, number, steps, file, isDelete) => {
    setEditExerciseId(id);
    setEditedExerciseTitle(name);
    setEditedExerciseDescription(scenario);
    setEditedExerciseNumber(number);
    setEditedExerciseSteps(steps);
    setUploadedPDF(file);
    setIsDelete(isDelete);
    setEditDialogOpen(true);
  };

  const handleFileUpload = async (file) => {
    const formData = new FormData();
    formData.append("file", file);
    formData.append("folderName", "exercises");
  
    const fileUploadPromise = axios.post(
      "https://coreutilities.hcomb.ai/v1/aws/uploadFile",
      formData,
      {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      }
    );
  
    return toast.promise(
      fileUploadPromise,
      {
        pending: "Uploading PDF, Please wait...",
        success: "PDF uploaded successfully!",
        error: "Failed to upload PDF. Please try again.",
      },
      {
        autoClose: 3000,
      }
    ).then(response => {
      setUploadedPDF(response.data.data);
      return response.data.data;
    }).catch(() => {
      return null;
    });
  };

  const handleSaveEdit = async () => {
    try {
      // Create an object with updated exercise data
      const updatedExercise = {
        id: editExerciseId,
        exercise_number: editedExerciseNumber,
        exercise_name: editedExerciseTitle,
        scenario: editedExerciseDescription,
        steps: editedExerciseSteps,
        file: uploadedPDF,
        is_deleted: isDelete,
      };

      // Check if required fields are filled
      if (
        !editedExerciseTitle ||
        !editedExerciseDescription ||
        !editedExerciseNumber ||
        !editedExerciseSteps
      ) {
        setEditDialogOpen(true);
        return;
      }

      if (editExerciseId) {
        // If editExerciseId is present, update the existing exercise
        onSaveExercise(updatedExercise, editExerciseId, null);
      } else {
        // If editExerciseId is null, add a new exercise
        const newExercise = {
          exercise_number: editedExerciseNumber,
          exercise_name: editedExerciseTitle,
          scenario: editedExerciseDescription,
          steps: editedExerciseSteps,
          file: uploadedPDF,
          is_deleted: "false",
        };

        onSaveExercise(null, null, newExercise);
      }

      // Clear the input fields and close the dialog
      setEditedExerciseTitle("");
      setEditedExerciseDescription("");
      setEditedExerciseNumber("");
      setEditedExerciseSteps("");
      setUploadedPDF(null);
      setIsDelete(false);
      setEditDialogOpen(false);
    } catch (error) {
      toast.error("Something Went Wrong, Please Try Again.", {
        autoClose: 3000,
      });
    }
  };
  const handleAddExercise = () => {
    setEditExerciseId(null);
    setEditedExerciseTitle("");
    setEditedExerciseDescription("");
    setEditedExerciseNumber("");
    setEditedExerciseSteps("");
    setUploadedPDF(null);
    setIsDelete(false);
    setEditDialogOpen(true);
  };

  const handleDelete = (id, name) => {
    setEditExerciseId(id);
    setEditedExerciseTitle(name);
    setDeleteDialogOpen(true);
  };

  const handleConfirmDelete = async () => {
    try {
      const editedExercise = {
        id: editExerciseId,
        is_deleted: "true",
      };
      await onSaveExercise(editedExercise, editExerciseId, null);
      setDeleteDialogOpen(false);
    } catch (error) {
      toast.error("Something Went Wrong, Please Try Again.", {
        autoClose: 3000,
      });
    }
  };

  const location = useLocation();

  useEffect(() => {
    if (exercises && exercises.length > 0) {
      setLoading(false);
    }
  }, [exercises]);

  useEffect(() => {
    if (!exercises) {
      setLoading(true);
    }
  }, []);

  const fetchFileUrl = async (fileName, folderName) => {
    try {
      const response = await axios.get(
        `https://coreutilities.hcomb.ai/v1/aws/getFile?fileName=${fileName}&folderName=${folderName}`
      );
      return response.data.data;
    } catch (error) {
      toast.error("Something Went Wrong, Please Try Again.", {
        autoClose: 3000,
      });
      return null;
    }
  };

  const openFile = async (fileName, folderName) => {
    const url = await fetchFileUrl(fileName, folderName);
    if (url) {
      window.open(url, "_blank");
    }
  };

  const getFileName = (url) => {
    const urlObj = new URL(url);
    const pathname = urlObj.pathname;
    return pathname.substring(pathname.lastIndexOf("/") + 1);
  };

  const hideAddButton = location.pathname === "/Exercises";
  return (
    <>
      <ToastContainer />
      <div className="m-5 bg-[#1A1C1E] rounded-lg">
        <div className="flex items-center justify-between header-title ">
          <h4 className="text-[#BDBEBE] font-semibold text-xl">Exercises</h4>

          {storedUserId === CourseTrainerID && (
            <Button
              variant="outlined"
              onClick={handleAddExercise}
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
              Add Exercise
            </Button>
          )}
        </div>

        <div className="exercise-section">
          {exercises ? (
            <>
              {exercises.length > 0 && (
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
                          Exercise Number
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
                        <TableCell
                          sx={{
                            fontSize: "16px",
                            color: "#BDBEBE",
                            fontFamily: "Poppins, sans-serif",
                          }}
                        >
                          Scenario
                        </TableCell>
                        <TableCell
                          sx={{
                            fontSize: "16px",
                            color: "#BDBEBE",
                            fontFamily: "Poppins, sans-serif",
                          }}
                        >
                          Steps
                        </TableCell>
                        <TableCell
                          sx={{
                            fontSize: "16px",
                            color: "#BDBEBE",
                            fontFamily: "Poppins, sans-serif",
                          }}
                        >
                          PDF
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
                      {exercises
                        ?.filter((data) => !data?.is_deleted)
                        .map((exercise) => (
                          <TableRow
                            key={exercise.id}
                            sx={{ border: "2px solid #37383A" }}
                          >
                            <TableCell
                              sx={{
                                color: "#BDBEBE",
                                fontFamily: "Poppins, sans-serif",
                                fontSize: "16px",
                              }}
                            >
                              {exercise?.id}
                            </TableCell>
                            <TableCell
                              sx={{
                                color: "#BDBEBE",
                                fontFamily: "Poppins, sans-serif",
                                fontSize: "16px",
                              }}
                            >
                              {exercise?.exercise_number}
                            </TableCell>
                            <TableCell
                              sx={{
                                color: "#BDBEBE",
                                fontFamily: "Poppins, sans-serif",
                                fontSize: "16px",
                              }}
                            >
                              {exercise?.exercise_name}
                            </TableCell>
                            <TableCell
                              sx={{
                                color: "#BDBEBE",
                                fontFamily: "Poppins, sans-serif",
                                fontSize: "16px",
                              }}
                            >
                              {exercise?.scenario}
                            </TableCell>
                            <TableCell
                              sx={{
                                color: "#BDBEBE",
                                fontFamily: "Poppins, sans-serif",
                                fontSize: "16px",
                              }}
                            >
                              {exercise?.steps}
                            </TableCell>
                            <TableCell
                              sx={{
                                color: "#BDBEBE",
                                fontFamily: "Poppins, sans-serif",
                                fontSize: "16px",
                              }}
                            >
                              {exercise?.file ? (
                                <button
                                  onClick={(e) => {
                                    e.preventDefault();
                                    openFile(
                                      getFileName(exercise.file),
                                      "exercises"
                                    );
                                  }}
                                  style={{ color: "#5b52e7" }}
                                >
                                  Open PDF
                                </button>
                              ) : (
                                "-"
                              )}
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
                                  onClick={() =>
                                    handleEdit(
                                      exercise.id,
                                      exercise.exercise_name,
                                      exercise.scenario,
                                      exercise.exercise_number,
                                      exercise.steps,
                                      exercises.file
                                    )
                                  }
                                >
                                  <EditIcon />
                                </IconButton>
                                <IconButton
                                  color="error"
                                  aria-label="delete"
                                  onClick={() =>
                                    handleDelete(exercise.id, exercise.Name)
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
              )}
            </>
          ) : (
            <p className="p-10">Exercise not Found !!!</p>
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
              {editExerciseId ? "Edit Exercise" : "Add Exercise"}
            </DialogTitle>
            <DialogContent sx={{ background: "#242728", color: "#BDBEBE" }}>
              <TextField
                label="Name"
                value={editedExerciseTitle}
                onChange={(e) => setEditedExerciseTitle(e.target.value)}
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
              <TextField
                label="Scenario"
                value={editedExerciseDescription}
                onChange={(e) => setEditedExerciseDescription(e.target.value)}
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
              <TextField
                label="Number"
                value={editedExerciseNumber}
                onChange={(e) => setEditedExerciseNumber(e.target.value)}
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
              <TextField
                label="Steps"
                value={editedExerciseSteps}
                onChange={(e) => setEditedExerciseSteps(e.target.value)}
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

              {/* PDF Upload Field */}
              <input
                type="file"
                accept="application/pdf"
                onChange={(e) => handleFileUpload(e.target.files[0])}
              />

              {/* Display uploaded PDF */}
            </DialogContent>
            <DialogActions sx={{ background: "#242728", color: "#BDBEBE" }}>
              <Button
                onClick={() => setEditDialogOpen(false)}
                sx={{
                  mr: 2,
                  mb: 4,
                  color: "#BDBEBE",
                  fontFamily: "Poppins, sans-serif",
                  "&:hover": {
                    background: "#282B2F",
                  },
                }}
              >
                Cancel
              </Button>
              <Button
                onClick={handleSaveEdit}
                variant="contained"
                sx={{
                  mr: 2,
                  mb: 4,
                  background: "#282B2F",
                  color: "#BDBEBE",
                  fontFamily: "Poppins, sans-serif",
                  "&:hover": {
                    background: "#282B2F",
                  },
                }}
              >
                {editExerciseId ? "Save" : "Add"}
              </Button>
            </DialogActions>
          </Dialog>

          <Dialog
            open={deleteDialogOpen}
            onClose={() => setDeleteDialogOpen(false)}
          >
            <DialogTitle
              sx={{
                background: "#242728",
                color: "#BDBEBE",
                fontFamily: "Poppins, sans-serif",
              }}
            >
              Confirm Deletion
            </DialogTitle>
            <DialogContent
              sx={{
                background: "#242728",
                color: "#BDBEBE",
                fontFamily: "Poppins, sans-serif",
              }}
            >
              <p>Are you sure you want to delete?</p>
            </DialogContent>
            <DialogActions sx={{ background: "#242728", color: "#BDBEBE" }}>
              <Button
                onClick={() => setDeleteDialogOpen(false)}
                sx={{
                  mr: 2,
                  mb: 2,
                  color: "#BDBEBE",
                  fontFamily: "Poppins, sans-serif",
                  "&:hover": {
                    background: "#282B2F",
                  },
                }}
              >
                Cancel
              </Button>
              <Button
                onClick={handleConfirmDelete}
                variant="contained"
                color="error"
                sx={{ mr: 2, mb: 2, fontFamily: "Poppins, sans-serif" }}
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

export default ExerciseDataTable;
