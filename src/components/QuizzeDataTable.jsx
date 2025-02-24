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
  MenuItem,
  Paper,
  Select,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  TextField,
} from "@mui/material";
import { useEffect, useState } from "react";
import { TailSpin } from "react-loader-spinner";
import { useLocation, useParams } from "react-router-dom";
import { Addquizzes, Updatequizzes } from "services/api";
import AccessCourse from "./AccessCourse";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
const   QuizzeDataTable = ({ quizzes, onSaveQuiz, courseId }) => {
  const [quizzesData, setQuizzesData] = useState(false);
  useEffect(() => {
    setQuizzesData(quizzes?.length > 0);
  }, [quizzes]);

  useEffect(() => {
    if (quizzes?.length > 0) {
      setQuizzesData(true);
    }
  }, [quizzes]);

  const { lessonId } = useParams();
  const [editDialogOpen, setEditDialogOpen] = useState(false);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  // const [addOptionDialogOpen, setAddOptionDialogOpen] = useState(false);
  const [editQuizId, setEditQuizId] = useState(null);
  const [loading, setLoading] = useState(true);

  const [editedQuizQuestion, setEditedQuizQuestion] = useState("");
  const [editedOption1, setEditedOption1] = useState("");
  const [editedOption2, setEditedOption2] = useState("");
  const [editedOption3, setEditedOption3] = useState("");
  const [editedOption4, setEditedOption4] = useState("");
  const [correctAnswer, setCorrectAnswer] = useState("");
  const [isDelete, setIsDelete] = useState(false);

  // const [newOption, setNewOption] = useState("");
  // const [selectedQuizIdForOption, setSelectedQuizIdForOption] = useState(null);

  const { selectedCourse, storedUserId } = AccessCourse({ courseId });
  const CourseTrainerID = selectedCourse?.trainer_id;
  // const handleEdit = (id, question, option1, option2, option3, option4) => {
  //   setEditQuizId(id);
  //   setEditedQuizQuestion(question);
  //   setEditedOption1(option1);
  //   setEditedOption2(option2);
  //   setEditedOption3(option3);
  //   setEditedOption4(option4);
  //   setEditDialogOpen(true);
  // };
  const handleEdit = (id, question, options, correctAnswer) => {
    setEditQuizId(id);
    setEditedQuizQuestion(question);
    // Set state for each option individually
    setEditedOption1(options[0] || "");
    setEditedOption2(options[1] || "");
    setEditedOption3(options[2] || "");
    setEditedOption4(options[3] || "");

    setCorrectAnswer(correctAnswer);
    setIsDelete(isDelete);

    setEditDialogOpen(true);
  };
  const handleSaveEdit = async () => {
    try {
      const updatedQuiz = {
        id: editQuizId,
        question: editedQuizQuestion,
        answer_options: [
          editedOption1,
          editedOption2,
          editedOption3,
          editedOption4,
        ],
        correct_answers: [correctAnswer],
        is_deleted: isDelete,
      };

      if (
        !editedQuizQuestion ||
        !editedOption1 ||
        !editedOption2 ||
        !editedOption3 ||
        !editedOption4 ||
        !correctAnswer
      ) {
        toast.error("Please Provide All Data.", {
          autoClose: 3000,
        });
        setEditDialogOpen(false);
        return;
      }

      if (editQuizId) {
        onSaveQuiz(updatedQuiz, editQuizId, null);
        
      } else {
        const newQuiz = {
          question: editedQuizQuestion,
          answer_options: [
            editedOption1,
            editedOption2,
            editedOption3,
            editedOption4,
          ],
          correct_answers: [correctAnswer],
          is_deleted: isDelete,
        };
        onSaveQuiz(null, null, newQuiz); // const response = await Addquizzes(lessonId, { quizzes: [newQuiz] });
      }

      // Clear the input fields and close the dialog
      setEditedQuizQuestion("");
      setEditedOption1("");
      setEditedOption2("");
      setEditedOption3("");
      setEditedOption4("");
      setCorrectAnswer("");
      setIsDelete(false);

      setEditDialogOpen(false);
    } catch (error) {
      toast.error("Something Went Wrong, Please Try Again.", {
        autoClose: 3000,
      });
    }
  };
  const handleAddQuiz = () => {
    setEditQuizId(null);
    setEditedQuizQuestion("");
    setEditedOption1("");
    setEditedOption2("");
    setEditedOption3("");
    setEditedOption4("");
    setCorrectAnswer("");
    setIsDelete(false);

    setEditDialogOpen(true);
  };
  const handleDelete = (id) => {
    setEditQuizId(id);
    setDeleteDialogOpen(true);
  };

  const handleConfirmDelete = async () => {
    try {
      const editedQuizz = {
        id: editQuizId,
        is_deleted: "true",
      };
      await onSaveQuiz(editedQuizz, editQuizId, null);
      setDeleteDialogOpen(false);
    } catch (error) {
      toast.error("Something Went Wrong, Please Try Again.", {
        autoClose: 3000,
      });
    }
  };

  const location = useLocation();

  const hideAddButton = location.pathname === "/Quizzes";

  useEffect(() => {
    if (quizzes && quizzes.length > 0) {
      setLoading(false); // If resources are already available, loading is complete
    }
  }, [quizzes]);

  useEffect(() => {
    if (!quizzes) {
      setLoading(true);
    }
  }, []);
  return (
    <>
      <ToastContainer />
      <div className="m-5 bg-[#1A1C1E] rounded-lg">
        <div className="flex items-center justify-between header-title">
          <h4 className="text-[#BDBEBE] font-semibold text-xl">Quizzes</h4>
          {/* Add Quiz Button */}
          {storedUserId === CourseTrainerID && (
            <Button
              variant="outlined"
              onClick={handleAddQuiz}
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
              Add Quiz
            </Button>
          )}
        </div>

        <div className="quizze-section">
          {quizzes ? (
            <>
              {quizzes.length > 0 &&  (
                <TableContainer
                  component={Paper}
                  className="p-5 rounded-md"
                  sx={{ backgroundColor: "transparent" }}
                >
                  <Table>
                    <TableHead className="border-2 border-[#37383A] bg-[#292B2D]">
                      <TableRow>
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
                          Question
                        </TableCell>
                        <TableCell
                          sx={{
                            fontSize: "16px",
                            color: "#BDBEBE",
                            fontFamily: "Poppins, sans-serif",
                          }}
                        >
                          Option 1
                        </TableCell>
                        <TableCell
                          sx={{
                            fontSize: "16px",
                            color: "#BDBEBE",
                            fontFamily: "Poppins, sans-serif",
                          }}
                        >
                          Option 2
                        </TableCell>
                        <TableCell
                          sx={{
                            fontSize: "16px",
                            color: "#BDBEBE",
                            fontFamily: "Poppins, sans-serif",
                          }}
                        >
                          Option 3
                        </TableCell>
                        <TableCell
                          sx={{
                            fontSize: "16px",
                            color: "#BDBEBE",
                            fontFamily: "Poppins, sans-serif",
                          }}
                        >
                          Option 4
                        </TableCell>
                        <TableCell
                          sx={{
                            fontSize: "16px",
                            color: "#BDBEBE",
                            fontFamily: "Poppins, sans-serif",
                          }}
                        >
                          Correct Answer
                        </TableCell>
                        {storedUserId === CourseTrainerID && (
                          <TableCell
                            sx={{
                              fontSize: "16px",
                              color: "#BDBEBE",
                              fontFamily: "Poppins, sans-serif",
                              minWidth: "100px",
                              // width: "100%"
                            }}
                          >
                            Actions
                          </TableCell>
                        )}
                      </TableRow>
                    </TableHead>
                    <TableBody className="border-2 border-[#37383A] bg-[#1A1C1E]">
                      {quizzes
                        ?.filter((data) => !data.is_deleted)
                        .map((quiz) => (
                          <TableRow
                            key={quiz.id}
                            sx={{ border: "2px solid #37383A" }}
                          >
                            <TableCell
                              sx={{
                                color: "#BDBEBE",
                                fontFamily: "Poppins, sans-serif",
                                fontSize: "16px",
                              }}
                            >
                              {quiz?.id}
                            </TableCell>
                            <TableCell
                              sx={{
                                color: "#BDBEBE",
                                fontFamily: "Poppins, sans-serif",
                                fontSize: "16px",
                              }}
                            >
                              {quiz?.question}
                            </TableCell>
                            {quiz?.answer_options?.map((option, index) => (
                              <TableCell
                                key={index}
                                sx={{
                                  color: "#BDBEBE",
                                  fontFamily: "Poppins, sans-serif",
                                  fontSize: "16px",
                                }}
                              >
                                {option}
                              </TableCell>
                            ))}
                            {/* Conditionally render empty cells for missing options */}
                            {Array.from({
                              length: 4 - quiz?.answer_options?.length,
                            }).map((_, index) => (
                              <TableCell
                                key={quiz.answer_options.length + index}
                                sx={{
                                  color: "#BDBEBE",
                                  fontFamily: "Poppins, sans-serif",
                                  fontSize: "16px",
                                }}
                              >
                                {/* You can add any placeholder text or leave it empty */}
                              </TableCell>
                            ))}
                            <TableCell
                              sx={{
                                color: "#BDBEBE",
                                fontFamily: "Poppins, sans-serif",
                                fontSize: "16px",
                              }}
                            >
                              {quiz?.correct_answers}
                            </TableCell>
                            {storedUserId === CourseTrainerID && (
                              <TableCell
                                colSpan={4 - quiz.answer_options?.length + 1}
                                className="action-btn"
                              >
                                <IconButton
                                  color="primary"
                                  aria-label="edit"
                                  onClick={() =>
                                    handleEdit(
                                      quiz.id,
                                      quiz.question,
                                      quiz.answer_options, // pass all answer options as an array
                                      quiz.correct_answers[0]
                                    )
                                  }
                                >
                                  <EditIcon />
                                </IconButton>
                                <IconButton
                                  color="error"
                                  aria-label="delete"
                                  onClick={() => handleDelete(quiz.id)}
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
            <p className="p-10">Quizz not Found !!!</p>
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
              {editQuizId ? "Edit Quiz" : "Add Quiz"}
            </DialogTitle>
            <DialogContent sx={{ background: "#242728", color: "#BDBEBE" }}>
              <TextField
                label="Question"
                value={editedQuizQuestion}
                onChange={(e) => setEditedQuizQuestion(e.target.value)}
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
                label="Option 1"
                value={editedOption1}
                onChange={(e) => setEditedOption1(e.target.value)}
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
                label="Option 2"
                value={editedOption2}
                onChange={(e) => setEditedOption2(e.target.value)}
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
                label="Option 3"
                value={editedOption3}
                onChange={(e) => setEditedOption3(e.target.value)}
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
                label="Option 4"
                value={editedOption4}
                onChange={(e) => setEditedOption4(e.target.value)}
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
              <Select
                onChange={(e) => setCorrectAnswer(e.target.value)}
                value={correctAnswer}
                fullWidth
                displayEmpty
                margin="normal"
              >
                <MenuItem value="" disabled>
                  Select Correct Answer
                </MenuItem>
                {[
                  editedOption1,
                  editedOption2,
                  editedOption3,
                  editedOption4,
                ].map((option, index) => (
                  <MenuItem key={index} value={option}>
                    {option}
                  </MenuItem>
                ))}
              </Select>
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
                {editQuizId ? "Save" : "Add"}
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
                onClick={handleConfirmDelete}
                variant="contained"
                color="error"
                sx={{ mr: 2, mb: 4, fontFamily: "Poppins, sans-serif" }}
              >
                Delete
              </Button>
            </DialogActions>
          </Dialog>

          {/* <Dialog
          open={addOptionDialogOpen}
          onClose={() => setAddOptionDialogOpen(false)}
        >
          <DialogTitle
            sx={{
              my: 2,
            }}
          >
            Add Option
          </DialogTitle>
          <DialogContent>
            <TextField
              label="New Option"
              value={newOption}
              onChange={(e) => setNewOption(e.target.value)}
              fullWidth
            />
          </DialogContent>
          <DialogActions>
            <Button
              onClick={() => setAddOptionDialogOpen(false)}
              sx={{ mr: 2, mb: 4, color: "#5B53E7" }}
            >
              Cancel
            </Button>
            <Button
              onClick={handleSaveOption}
              variant="contained"
              color="primary"
              sx={{
                mr: 2,
                mb: 4,
                background: "#5B53E7",
                color: "#FFF",
                "&:hover": {
                  background: "#5B53E7",
                },
              }}
            >
              Save
            </Button>
          </DialogActions>
        </Dialog> */}
        </div>
      </div>
    </>
  );
};

export default QuizzeDataTable;
