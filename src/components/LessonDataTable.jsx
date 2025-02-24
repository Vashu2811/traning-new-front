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
import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { deletelesson, updateLesson } from "services/api";

const LessonDataTable = ({ lessons  ,onSaveEdit, onDelete,selectedCourseId,handleCourseChange,courses}) => {
  const [editDialogOpen, setEditDialogOpen] = useState(false);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [editLessonId, setEditLessonId] = useState("");
  const [editedLessonTitle, setEditedLessonTitle] = useState("");
  const [editedLessonLink, setEditedLessonLink] = useState("");
  const [editedLessonMessage, setEditedLessonMessage] = useState("");
  const [uploadedFile, setUploadedFile] = useState(null);
  const [loading, setLoading] = useState(true);

  const generateLessonId = () => {
    return Date.now().toString();
  };

  const handleEdit = (id, title, url, chat_message, uploadPDF) => {
    setEditLessonId(id);
    setEditedLessonTitle(title);
    setEditedLessonLink(url);
    setEditedLessonMessage(chat_message);
    setUploadedFile(uploadPDF);
    setEditDialogOpen(true);
  };

  const handleSaveEdit = async () => {
    const lessonData = {
      id: editLessonId,
      title: editedLessonTitle,
      url: editedLessonLink,
      chat_message: editedLessonMessage,
      file: uploadedFile,
      is_deleted: false,  // Ensure the lesson isn't marked as deleted
    };

    const payload = {
      overview: {
        ...lessonData,
      },
    };
    try {
      await onSaveEdit(editLessonId, payload);
      setEditDialogOpen(false);
      // Trigger a refresh or update your lessons list here
    } catch (error) {
      console.error('Failed to save the edited lesson:', error);
    }
  };

  const handleAddLesson = () => {
    setEditedLessonTitle("");
    setEditedLessonLink("");
    setEditedLessonMessage("");
    setUploadedFile(null);
    setEditDialogOpen(true);
  };

  const handleDelete = (id, title) => {
    setEditLessonId(id);
    setEditedLessonTitle(title);
    setDeleteDialogOpen(true);
  };

  const handleConfirmDelete = async () => {
    try {
      const data = {overview: { id: editLessonId, is_deleted: true }}
      await onDelete(editLessonId,data);
      setDeleteDialogOpen(false);
      // Refresh or update lessons here
    } catch (error) {
      console.error('Failed to delete the lesson:', error);
    }
  };
  useEffect(() => {
    if (lessons && lessons.length > 0) {
      setLoading(false); // If resources are already available, loading is complete
    }
  }, [lessons]);

  useEffect(() => {
    if (!lessons) {
      setLoading(true);
    }
  }, []);
  
  return (
    <>
      <div className="m-5 bg-[#1A1C1E] rounded-lg">
        <div className="header-title">
          <h4 className="text-[#BDBEBE] font-semibold text-xl">Lessons</h4>
        </div>
        
        <div className="mb-4 mx-12">
          <label htmlFor="course-select" className="block mb-2 text-sm font-medium text-[#BDBEBE]">Select Course:
          <select
            id="course-select"
            value={selectedCourseId}
            onChange={handleCourseChange}
            className="m-2 mt-4 px-2 py-1 rounded"
            style={{
              backgroundColor: "#37383A",
              color: "#BDBEBE",
              borderColor: "#BDBEBE",
              fontFamily: "Poppins, sans-serif",
            }}
          >
            {courses.map(course => (
              <option key={course.id} value={course.id}>
                {course.course_name}
              </option>
            ))}
          </select>
          </label>
        </div>

        <div className="lesson-section">
          {lessons ? (
            <>
              {lessons.length > 0 && (
                <TableContainer
                  component={Paper}
                  className="p-5 rounded-md"
                  sx={{ background: "transparent" }}
                >
                  <Table sx={{}}>
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
                          Name
                        </TableCell>
                        <TableCell
                          sx={{
                            fontSize: "16px",
                            color: "#BDBEBE",
                            fontFamily: "Poppins, sans-serif",
                          }}
                        >
                          Lesson Number
                        </TableCell>
                        <TableCell
                          sx={{
                            fontSize: "16px",
                            color: "#BDBEBE",
                            fontFamily: "Poppins, sans-serif",
                          }}
                        >
                          Lesson Description
                        </TableCell>
                        <TableCell
                          sx={{
                            fontSize: "16px",
                            color: "#BDBEBE",
                            fontFamily: "Poppins, sans-serif",
                          }}
                        >
                          Lesson url
                        </TableCell>
                        <TableCell
                          sx={{
                            fontSize: "16px",
                            color: "#BDBEBE",
                            fontFamily: "Poppins, sans-serif",
                          }}
                        >
                          Initial Chat Message
                        </TableCell>
                        <TableCell
                          sx={{
                            fontSize: "16px",
                            color: "#BDBEBE",
                            fontFamily: "Poppins, sans-serif",
                          }}
                        >
                          Transcription
                        </TableCell>
                        <TableCell
                          sx={{
                            fontSize: "16px",
                            color: "#BDBEBE",
                            fontFamily: "Poppins, sans-serif",
                          }}
                        >
                          Upload PDF to Train Bot
                        </TableCell>
                        <TableCell
                          sx={{
                            fontSize: "16px",
                            color: "#BDBEBE",
                            fontFamily: "Poppins, sans-serif",
                          }}
                        >
                          Actions
                        </TableCell>
                      </TableRow>
                    </TableHead>
                    <TableBody className="border-2 border-[#37383A] bg-[#1A1C1E]">
                      {lessons?.map((lesson) => (
                        <TableRow
                          key={lesson.id}
                          sx={{ border: "2px solid #37383A" }}
                        >
                          <TableCell
                            sx={{
                              color: "#BDBEBE",
                              fontFamily: "Poppins, sans-serif",
                              fontSize: "16px",
                            }}
                          >
                            {lesson?.id}
                          </TableCell>
                          <TableCell
                            sx={{
                              color: "#BDBEBE",
                              fontFamily: "Poppins, sans-serif",
                              fontSize: "16px",
                            }}
                          >
                            {lesson?.title}
                          </TableCell>
                          <TableCell
                            sx={{
                              color: "#BDBEBE",
                              fontFamily: "Poppins, sans-serif",
                              fontSize: "16px",
                            }}
                          >
                            {lesson?.lesson_number}
                          </TableCell>
                          <TableCell
                            sx={{
                              color: "#BDBEBE",
                              fontFamily: "Poppins, sans-serif",
                              fontSize: "16px",
                            }}
                          >
                            {lesson?.lesson_description}
                          </TableCell>
                          <TableCell
                            sx={{
                              color: "#5B52E7",
                              textDecoration:"underLine",
                              fontFamily: "Poppins, sans-serif",
                              fontSize: "16px",
                            }}
                          >
                            <Link to={lesson?.url}>Click here</Link>
                          </TableCell>
                          <TableCell
                            sx={{
                              color: "#BDBEBE",
                              fontFamily: "Poppins, sans-serif",
                              fontSize: "16px",
                            }}
                          >
                            {lesson?.chat_message}
                          </TableCell>
                          <TableCell
                            sx={{
                              color: "#BDBEBE",
                              fontFamily: "Poppins, sans-serif",
                              fontSize: "16px",
                            }}
                          >
                            <div className="h-96 overflow-y-scroll">
                            {lesson?.transcription}
                            </div>
                          </TableCell>
                          <TableCell
                            sx={{
                              color: "#BDBEBE",
                              fontFamily: "Poppins, sans-serif",
                              fontSize: "16px",
                            }}
                          >
                            {lesson?.uploadPDF}
                          </TableCell>
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
                                  lesson.id,
                                  lesson.title,
                                  lesson.url,
                                  lesson.chat_message,
                                  lesson.uploadPDF
                                )
                              }
                            >
                              <EditIcon />
                            </IconButton>
                            <IconButton
                              color="error"
                              aria-label="delete"
                              onClick={() =>
                                handleDelete(lesson.id, lesson.title)
                              }
                            >
                              <DeleteIcon />
                            </IconButton>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </TableContainer>
              )}
            </>
          ) : (
            <>
              <p className="p-10">Lessons not Found !!!</p>
            </>
          )}
          {/* </>
          )} */}
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
              {editLessonId ? "Edit Lesson" : "Add Lesson"}
            </DialogTitle>
            <DialogContent sx={{ background: "#242728", color: "#BDBEBE" }}>
              <TextField
                label="Name & Number Lessons"
                value={editedLessonTitle}
                onChange={(e) => setEditedLessonTitle(e.target.value)}
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
                label="Lesson url"
                value={editedLessonLink}
                onChange={(e) => setEditedLessonLink(e.target.value)}
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
                label="Initial Chat chat_message"
                multiline
                rows={4}
                value={editedLessonMessage}
                onChange={(e) => setEditedLessonMessage(e.target.value)}
                fullWidth
                sx={{
                  mb: 2,
                  "& textarea": {
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
                style={{ color: "blue" }}
              />
              <input
                type="file"
                accept=".pdf"
                onChange={(e) => setUploadedFile(e.target.files[0])}
              />
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
                {editLessonId ? "Save" : "Add"}
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
              <p>Are you sure you want to delete "{editedLessonTitle}"?</p>
            </DialogContent>
            <DialogActions
              sx={{
                background: "#242728",
                color: "#BDBEBE",
                fontFamily: "Poppins, sans-serif",
              }}
            >
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

export default LessonDataTable;
