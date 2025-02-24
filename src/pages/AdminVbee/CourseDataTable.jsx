import React, { useEffect, useState } from "react";
import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  IconButton,
  MenuItem,
  Paper,
  Table,
  TableBody,
  TablePagination,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  TextField,
} from "@mui/material";
import AddCircleOutlineIcon from "@mui/icons-material/AddCircleOutline";
import DeleteIcon from "@mui/icons-material/Delete";
import EditIcon from "@mui/icons-material/Edit";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const ITEM_HEIGHT = 48;

const CourseDataTable = ({ courses, onSaveCourse, onSaveAssignment }) => {
  const [editDialogOpen, setEditDialogOpen] = useState(false);
  const [editCourseId, setEditCourseId] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [editedCourseName, setEditedCourseName] = useState("");
  const [editedTrainerId, setEditedTrainerId] = useState(null);
  const [editedTrainerName, setEditedTrainerName] = useState("");
  const [assignDialogOpen, setAssignDialogOpen] = useState(false);
  const [trainingName, setTrainingName] = useState("");
  const [trainingId, setTrainingId] = useState("");
  const [selectedCourse, setSelectedCourse] = useState("");
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [courseToDelete, setCourseToDelete] = useState(null);

  const MenuProps = {
    PaperProps: {
      style: {
        maxHeight: ITEM_HEIGHT * 7, // Limit to 7 items visible at once
        width: 250,
      },
    },
  };

  const handleDelete = (course) => {
    setCourseToDelete(course);
    setDeleteDialogOpen(true);
  };
  
  const handlePageChange = (event, newPage) => {
    setPage(newPage);
  };
  const handleRowsPerPageChange = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };


  const handleConfirmDelete = async () => {
    if (!courseToDelete) return;

    try {
      const updatedCourse = {
        ...courseToDelete,
        is_deleted: true,
      };

      await onSaveCourse(updatedCourse, courseToDelete.id, null);

      toast.success("Course deleted successfully!", { autoClose: 3000 });
    } catch (error) {
      toast.error("Something Went Wrong, Please Try Again.", {
        autoClose: 3000,
      });
    }

    setDeleteDialogOpen(false);
    setCourseToDelete(null);
  };

  const handleEdit = (id, name, trainerId, trainerName) => {
    if (
      trainerId !== null &&
      trainerName !== null &&
      trainerId !== undefined &&
      trainerName !== undefined
    ) {
      const isAssigned = courses.some(
        (course) =>
          course.trainer_id === trainerId && course.trainer_name === trainerName
      );

      setEditCourseId(id);
      setEditedCourseName(name);
      setEditedTrainerId(trainerId);
      setEditedTrainerName(trainerName);
      setEditDialogOpen(true);
    } else {
      toast.error("Assign Course First", {
        autoClose: 3000,
      });
    }
  };

  useEffect(() => {
    if (assignDialogOpen) {
      setTrainingName("");
      setTrainingId("");
      setSelectedCourse("");
    }
  }, [assignDialogOpen]);

  const handleSaveEdit = () => {
    try {
      const updatedCourse = {
        id: editCourseId,
        course_name: editedCourseName,
        trainer_id: editedTrainerId,
        trainer_name: editedTrainerName,
      };

      if (!editedCourseName) {
        toast.error("All Fields Are Mandatory.", {
          autoClose: 3000,
        });

        setEditDialogOpen(false);
        return;
      }

      if (editCourseId) {
        onSaveCourse(updatedCourse, editCourseId, null);
      } else {
        const newCourse = {
          course_name: editedCourseName,
          trainer_id: editedTrainerId,
          trainer_name: editedTrainerName,
        };
        onSaveCourse(null, null, newCourse);
      }

      setEditedCourseName("");
      setEditedTrainerId(null);
      setEditedTrainerName("");
      setEditDialogOpen(false);
    } catch (error) {
      toast.error("Something Went Wrong, Please Try Again.", {
        autoClose: 3000,
      });
    }
  };

  const handleAddCourse = () => {
    setEditCourseId(null);
    setEditedCourseName("");
    setEditedTrainerId(null);
    setEditedTrainerName("");
    setEditDialogOpen(true);
  };

  const handleAssignCourse = () => {
    setAssignDialogOpen(true);
  };

  const handleSaveAssignment = async () => {
    try {
      if (!trainingName || !trainingId || !selectedCourse) {
        toast.error("All Fields Are Mandatory.", {
          autoClose: 3000,
        });
        return;
      }
      const { id: courseId, course_name: courseName } = selectedCourse;

      const assignmentData = {
        trainer_name: trainingName,
        trainer_id: trainingId,
        id: courseId, // Use courseId for course_id
        course_name: courseName, // Include the courseName
      };

      await onSaveAssignment(assignmentData);

      setAssignDialogOpen(false);
    } catch (error) {
      toast.error("Something Went Wrong, Please Try Again.", {
        autoClose: 3000,
      });
    }
  };
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(5);

  const sortedCourses = [...courses].sort((a, b) => a.id - b.id);

  const filteredCourses = courses.filter((course) =>
    course.course_name.toLowerCase().includes(searchTerm.toLowerCase())
  );
  const paginatedCourses = filteredCourses.slice(
    page * rowsPerPage,
    page * rowsPerPage + rowsPerPage
  );
  return (
    <>
      <ToastContainer />
      <div className="m-5 bg-[#1A1C1E] rounded-lg border border-[#37383A]">
        <div className="flex items-center justify-between header-title">
          <h4 className="text-xl font-semibold">Manage Courses</h4>
          <div className="flex flex-wrap gap-2">
            <Button
              variant="contained"
              onClick={handleAddCourse}
              sx={{
                background: "#5B53E7",
                color: "#FFF",
                fontFamily: "Poppins, sans-serif",
                "&:hover": { background: "#5B53E7" },
              }}
            >
              <AddCircleOutlineIcon className="mr-1" /> Add Course
            </Button>
            <Button
              variant="contained"
              onClick={handleAssignCourse}
              sx={{
                background: "#5B53E7",
                color: "#FFF",
                fontFamily: "Poppins, sans-serif",
                "&:hover": { background: "#5B53E7" },
              }}
            >
              <AddCircleOutlineIcon className="mr-1" /> Assign Course
            </Button>
          </div>
        </div>

        <div className="m-5 course-section">
          <div className="pb-2">
            <TextField
              placeholder="Search by Course Name"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              variant="outlined"
              InputProps={{
                style: {
                  color: "#E0E0E0",
                  fontSize: "16px",
                },
              }}
              sx={{
                width: "100%",
                backgroundColor: "#1E1E1F",
                borderRadius: 2,
                "& .MuiOutlinedInput-root": {
                  "& fieldset": {
                    borderColor: "#5A5A5C",
                  },
                  "&:hover fieldset": {
                    borderColor: "#757575",
                  },
                  "&.Mui-focused fieldset": {
                    borderColor: "#4A90E2",
                    boxShadow: "0 0 5px rgba(74, 144, 226, 0.6)",
                  },
                },
                "& input::placeholder": {
                  color: "#757575",
                  opacity: 1,
                },
                maxWidth: "400px",
              }}
            />
          </div>
         <div>
         <TableContainer component={Paper}>
            <Table>
              <TableHead className="border-2 border-[#37383A] bg-[#292B2D]">
                <TableRow sx={{ border: "2px solid #37383A" }}>
                  {[
                    "No.",
                    "Course Name",
                    "Trainer ID",
                    "Trainer Name",
                    "Actions",
                  ].map((heading, index) => (
                    <TableCell
                      key={index}
                      sx={{
                        fontSize: "16px",
                        color: "#BDBEBE",
                        fontFamily: "Poppins, sans-serif",
                      }}
                    >
                      {heading}
                    </TableCell>
                  ))}
                </TableRow>
              </TableHead>

              {/* <TableBody className="border-2 border-[#37383A] bg-[#1A1C1E]">
                {filteredCourses
                  .sort((a, b) => a.id - b.id)
                  .map((course, index) => (
                    <TableRow
                      key={course?.id}
                      sx={{ border: "2px solid #37383A" }}
                    >
                      <TableCell
                        sx={{
                          color: "#BDBEBE",
                          fontFamily: "Poppins, sans-serif",
                          fontSize: "16px",
                        }}
                      >
                        {index + 1}
                      </TableCell>

                      <TableCell
                        sx={{
                          color: "#BDBEBE",
                          fontFamily: "Poppins, sans-serif",
                          fontSize: "16px",
                        }}
                      >
                        {course?.course_name}
                      </TableCell>
                      <TableCell
                        sx={{
                          color: "#BDBEBE",
                          fontFamily: "Poppins, sans-serif",
                          fontSize: "16px",
                        }}
                      >
                        {course?.trainer_id}
                      </TableCell>
                      <TableCell
                        sx={{
                          color: "#BDBEBE",
                          fontFamily: "Poppins, sans-serif",
                          fontSize: "16px",
                        }}
                      >
                        {course?.trainer_name}
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
                              course.id,
                              course.course_name,
                              course.trainer_id,
                              course.trainer_name
                            )
                          }
                        >
                          <EditIcon />
                        </IconButton>

                        <IconButton
                          color="error"
                          aria-label="delete"
                          onClick={() => handleDelete(course)}
                        >
                          <DeleteIcon />
                        </IconButton>
                      </TableCell>
                    </TableRow>
                  ))}
              </TableBody> */}
                <TableBody className="border-2 border-[#37383A] bg-[#1A1C1E]">
                {paginatedCourses.map((course, index) => (
                  <TableRow key={course.id}  sx={{ border: "2px solid #37383A" }} >
                    <TableCell sx={{ color: "#BDBEBE" , }}>{index + 1 + page * rowsPerPage}</TableCell>
                    <TableCell sx={{ color: "#BDBEBE" , border: "2px solid #37383A" }}>{course.course_name}</TableCell>
                    <TableCell sx={{ color: "#BDBEBE" , border: "2px solid #37383A" }}>{course.trainer_id}</TableCell>
                    <TableCell sx={{ color: "#BDBEBE" , border: "2px solid #37383A" }}>{course.trainer_name}</TableCell>
                    <TableCell>
                      <IconButton
                        color="primary"
                        onClick={() =>
                          setEditDialogOpen(true) || setEditCourseId(course.id)
                        }
                      >
                        <EditIcon />
                      </IconButton>
                      <IconButton color="error" onClick={() => handleDelete(course)}>
                        <DeleteIcon />
                      </IconButton>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
          <TablePagination
            component="div"
            count={filteredCourses.length}
            page={page}
            rowsPerPage={rowsPerPage}
            onPageChange={handlePageChange}
            onRowsPerPageChange={handleRowsPerPageChange}
            rowsPerPageOptions={[5, 10, 25]}
            sx={{ backgroundColor: "#1A1C1E", color: "#BDBEBE" }}
          />
          {/* <TablePagination
  component="div"
  count={filteredCourses.length}
  page={page}
  rowsPerPage={rowsPerPage}
  onPageChange={handlePageChange}
  onRowsPerPageChange={handleRowsPerPageChange}
  rowsPerPageOptions={[5, 10, 25]}
  sx={{
    backgroundColor: "#1A1C1E",
    color: "#BDBEBE",
    "& .MuiTablePagination-actions button": {
      color: "pink", // Change arrow icons to pink
    },
  }}
/> */}
         </div>
          
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
              {editCourseId ? "Edit Course" : "Add Course"}
            </DialogTitle>
            <DialogContent sx={{ background: "#242728", color: "#BDBEBE" }}>
              <TextField
                label="Course Name"
                value={editedCourseName}
                onChange={(e) => setEditedCourseName(e.target.value)}
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
              {editCourseId && (
                <>
                  <TextField
                    label="Trainer ID"
                    value={editedTrainerId}
                    onChange={(e) => setEditedTrainerId(e.target.value)}
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
                    label="Trainer Name"
                    value={editedTrainerName}
                    onChange={(e) => setEditedTrainerName(e.target.value)}
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
                </>
              )}
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
                {editCourseId ? "Save" : "Add"}
              </Button>
            </DialogActions>
          </Dialog>

          <Dialog
            open={assignDialogOpen}
            onClose={() => setAssignDialogOpen(false)}
          >
            <DialogTitle
              sx={{
                py: 2,
                background: "#242728",
                color: "#BDBEBE",
                fontFamily: "Poppins, sans-serif",
              }}
            >
              Assign Course
            </DialogTitle>
            <DialogContent sx={{ background: "#242728", color: "#BDBEBE" }}>
              <TextField
                label="Trainer ID"
                value={trainingId}
                onChange={(e) => setTrainingId(e.target.value)}
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
                InputLabelProps={{ sx: { color: "#BDBEBE" } }}
                InputProps={{ sx: { color: "#BDBEBE" } }}
              />

              <TextField
                label="Trainer Name"
                value={trainingName}
                onChange={(e) => setTrainingName(e.target.value)}
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
                InputLabelProps={{ sx: { color: "#BDBEBE" } }}
                InputProps={{ sx: { color: "#BDBEBE" } }}
              />

              <TextField
                select
                label="Course"
                value={selectedCourse}
                onChange={(e) => setSelectedCourse(e.target.value)}
                fullWidth
                className="mb-4 text-gray-300 font-poppins"
                sx={{
                  "& .MuiOutlinedInput-notchedOutline": {
                    borderColor: "#37383A !important",
                  },
                  "& .MuiInputLabel-outlined": {
                    color: "#BDBEBE !important",
                  },
                  "& .MuiSvgIcon-root": {
                    color: "#BDBEBE !important",
                  },
                }}
                InputLabelProps={{ sx: { color: "#BDBEBE" } }}
                SelectProps={{
                  MenuProps: {
                    PaperProps: {
                      sx: {
                        backgroundColor: "#1E1F22",
                        color: "#BDBEBE",
                      },
                    },
                  },
                }}
              >
                {filteredCourses.map((course) => (
                  <MenuItem
                    key={course.id}
                    value={course}
                    className="hover:bg-gray-700 transition-all text-gray-300"
                  >
                    {course.course_name}
                  </MenuItem>
                ))}
              </TextField>
            </DialogContent>
            <DialogActions sx={{ background: "#242728", color: "#BDBEBE" }}>
              <Button
                onClick={() => setAssignDialogOpen(false)}
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
                onClick={handleSaveAssignment}
                variant="contained"
                sx={{
                  mb: 2,
                  background: "#282B2F",
                  color: "#BDBEBE",
                  fontFamily: "Poppins, sans-serif",
                  "&:hover": {
                    background: "#282B2F",
                  },
                }}
              >
                Assign
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
export default CourseDataTable;

