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
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

import { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";
import AccessCourse from "./AccessCourse";
import axios from "axios";

const ResourcesDataTable = ({ resources, onSaveResource, courseId }) => {
  const [editDialogOpen, setEditDialogOpen] = useState(false);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [editResourceId, setEditResourceId] = useState(null);
  const [editedResourceName, setEditedResourceName] = useState("");
  const [uploadedPDF, setUploadedPDF] = useState(null); // New state for handling uploaded PDF
  const [editedResourceLink, setEditedResourceLink] = useState("");
  const [loading, setLoading] = useState(true);
  const [isDelete, setIsDelete] = useState(false);

  const { selectedCourse, storedUserId } = AccessCourse({ courseId });
  const CourseTrainerID = selectedCourse?.trainer_id;
  const generateResourceId = () => {
    return Date.now().toString();
  };

  const handleEdit = (id, title, resource_text, uploadedPDF, isDelete) => {
    setEditResourceId(id);
    setEditedResourceName(title);
    setEditedResourceLink(resource_text);
    setUploadedPDF(uploadedPDF);
    setIsDelete(isDelete);
    setEditDialogOpen(true);
  };

  const handleFileUpload = async (file) => {
    
    const formData = new FormData();
    formData.append("file", file);
    formData.append("folderName", "resources");
  
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
      const updatedResource = {
        id: editResourceId,
        title: editedResourceName,
        resource_text: editedResourceLink,
        file: uploadedPDF,
        is_deleted: isDelete,
      };

      // Check if required fields are filled
      if (!editedResourceName || !editedResourceLink) {
        setEditDialogOpen(true);
        return;
      }

      if (editResourceId) {
        // If editResourceId is present, update the existing resource
        onSaveResource(updatedResource, editResourceId, null);
      } else {
        // If editResourceId is null, add a new resource
        const newResource = {
          title: editedResourceName,
          resource_text: editedResourceLink,
          file: uploadedPDF,
          is_deleted: "false",
        };

        onSaveResource(null, null, newResource);
      }

      // Clear the input fields and close the dialog
      setEditedResourceName("");
      setEditedResourceLink("");
      setUploadedPDF(null);
      setIsDelete(false);

      setEditDialogOpen(false);
    } catch (error) {
      toast.error("Something Went Wrong, Please Try Again.", {
        autoClose: 3000,
      });
    }
  };

  const handleAddResource = () => {
    setEditResourceId(null);
    setEditedResourceName("");
    setUploadedPDF(null);
    setEditedResourceLink("");
    setIsDelete(false);

    setEditDialogOpen(true);
  };

  const handleDelete = (id, name) => {
    setEditResourceId(id);
    setEditedResourceName(name);
    setDeleteDialogOpen(true);
  };

  const handleConfirmDelete = async () => {
    try {
      const editedResource = {
        id: editResourceId,
        resource_text: editedResourceLink,
        title: editedResourceName,
        file: uploadedPDF,
        is_deleted: true,
      };
      await onSaveResource(editedResource, editResourceId, null);
      setDeleteDialogOpen(false);
    } catch (error) {
      toast.error("Something Went Wrong, Please Try Again.", {
        autoClose: 3000,
      });
    }
  };

  const specificResource =
    resources && resources.length > 0
      ? resources.find((resource) => resource.id === editResourceId)
      : null;
  const location = useLocation();

  const hideAddButton = location.pathname === "/Resources";
  useEffect(() => {
    // Check if resources are initially provided
    if (resources && resources.length > 0) {
      setLoading(false); // If resources are already available, loading is complete
    }
  }, [resources]);

  useEffect(() => {
    // If resources are fetched asynchronously, set loading to true until they arrive
    if (!resources) {
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

  return (
    <>
      <ToastContainer />
      <div className="m-5 bg-[#1A1C1E] rounded-lg">
        <div className="flex items-center justify-between header-title ">
          <h4 className="text-[#BDBEBE] font-semibold text-xl">Resources</h4>

          {!hideAddButton && storedUserId === CourseTrainerID ? (
            <Button
              variant="outlined"
              onClick={() => {
                handleAddResource();
              }}
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
              Add Resource
            </Button>
          ) : null}
        </div>
        <div className="resource-section">
          {/* {loading ? (
             <div className="p-5 loader-container" >
             <TailSpin color="#FFFFFF" height={20} width={20} />
           </div>
          ) : (
            <> */}
          {resources ? (
            <>
              {resources.length > 0 && (
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
                        <TableCell
                          sx={{
                            fontSize: "16px",
                            color: "#BDBEBE",
                            fontFamily: "Poppins, sans-serif",
                          }}
                        >
                          Resource Text
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
                        {!hideAddButton && storedUserId === CourseTrainerID && (
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
                      {resources
                        ?.filter((resources) => !resources.is_deleted)
                        .map((resource) => (
                          <TableRow
                            key={resource.id}
                            sx={{ border: "2px solid #37383A" }}
                          >
                            <TableCell
                              sx={{
                                color: "#BDBEBE",
                                fontFamily: "Poppins, sans-serif",
                                fontSize: "16px",
                              }}
                            >
                              {resource?.id}
                            </TableCell>
                            <TableCell
                              sx={{
                                color: "#BDBEBE",
                                fontFamily: "Poppins, sans-serif",
                                fontSize: "16px",
                              }}
                            >
                              {resource?.title}
                            </TableCell>
                            <TableCell
                              sx={{
                                color: "#BDBEBE",
                                fontFamily: "Poppins, sans-serif",
                                fontSize: "16px",
                              }}
                            >
                              {resource?.resource_text}
                            </TableCell>
                            <TableCell
                              sx={{
                                color: "#BDBEBE",
                                fontFamily: "Poppins, sans-serif",
                                fontSize: "16px",
                              }}
                            >
                              {resource?.file ? (
                                <button
                                  onClick={(e) => {
                                    e.preventDefault();
                                    openFile(
                                      getFileName(resource.file),
                                      "resources"
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
                        {!hideAddButton && storedUserId === CourseTrainerID && (

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
                                    resource.id,
                                    resource.title,
                                    resource.resource_text,
                                    resource.file
                                  )
                                }
                              >
                                <EditIcon />
                              </IconButton>
                              <IconButton
                                color="error"
                                aria-label="delete"
                                onClick={() =>
                                  handleDelete(resource.id, resource.name)
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
            <p className="p-10">Resources not Found !!!</p>
          )}

          {/* </>
          )} */}

          {/* Dialog for Edit/Add Resource */}
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
              {editResourceId ? "Edit Resource" : "Add Resource"}
            </DialogTitle>
            <DialogContent sx={{ background: "#242728", color: "#BDBEBE" }}>
              {/* <TextField
              label="ID"
              value={specificResource ? specificResource.id : editResourceId}
              disabled
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
                "& input.Mui-disabled": {
                  WebkitTextFillColor: "#8F9BB3 !important",
                },
              }}
            /> */}
              <TextField
                label="Title"
                value={editedResourceName}
                onChange={(e) => setEditedResourceName(e.target.value)}
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
                label="Resource Text"
                value={editedResourceLink}
                onChange={(e) => setEditedResourceLink(e.target.value)}
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
              {/* Input field for uploading PDF */}
              <div>
                <input
                  id="upload-pdf"
                  type="file"
                  accept=".pdf"
                  onChange={(e) => handleFileUpload(e.target.files[0])}
                />
              </div>
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
                {editResourceId ? "Save" : "Add"}
              </Button>
            </DialogActions>
          </Dialog>

          {/* Dialog for Confirm Deletion */}
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
              <p>Are you sure you want to delete "{editedResourceName}"?</p>
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

export default ResourcesDataTable;
