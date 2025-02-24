
import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import AddCircleOutlineIcon from "@mui/icons-material/AddCircleOutline";
import { Box, Button, Dialog, DialogActions, DialogContent, DialogTitle, IconButton, Modal, TextField, Typography } from "@mui/material";
import { AddNewmodule, deleteModule, editModule, getModules } from "services/api";
import { fetchAllCourses } from "store/actions/course";
import { useDispatch } from "react-redux";
import { setLoading } from "store/reducers/loadingReducer";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import DeleteIcon from "@mui/icons-material/Delete";
import EditIcon from "@mui/icons-material/Edit";

const Modules = () => {
  const [showAddModal, setShowAddModal] = useState(false);
  const [modules, setModules] = useState({});
  const [selectedCourseId, setSelectedCourseId] = useState();
  const [courses, setCourses] = useState([]);
  const [selectedModuleId, setSelectedModuleId] = useState(null);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [editedTitle, setEditedTitle] = useState("");

  const [newModule, setNewModule] = useState({
    module_name: "",
    module_description: "",
  });

  const navigate = useNavigate();



  const dispatch = useDispatch();
  const user_Id = JSON.parse(localStorage.getItem("auth"))?.user?.userId;

  useEffect(() => {
    const fetchCourses = async () => {
      try {
        const result = await dispatch(fetchAllCourses());
        const results = result.payload;
        const userCourses = results.courses.filter(course => course.trainer_id === user_Id);
        setCourses(userCourses);
        setSelectedCourseId(userCourses[0]?.id); // Set the first course as selected by default
      } catch (err) {
        toast.error("Something Went Wrong, Please Try Again.", { autoClose: 3000 });
      }
    };
    fetchCourses();
  }, [user_Id]);

  useEffect(() => {
    if (selectedCourseId) {
      fetchModules(selectedCourseId);
    }
  }, [selectedCourseId]);

  const fetchModules = async (courseId) => {
    dispatch(setLoading(true));
    try {
      const response = await getModules(courseId);
      if (response) {
        setModules(prevModules => ({
          ...prevModules,
          [courseId]: response.modules,
        }));
      } else {
        toast.error("No modules found.", { autoClose: 3000 });
      }
    } catch (error) {
      toast.error("Something Went Wrong, Please Try Again.", { autoClose: 3000 });
    }
    dispatch(setLoading(false));
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setNewModule(prevModule => ({
      ...prevModule,
      [name]: value,
    }));
  };

  const addNewModule = async () => {
    const newModulePayload = {
      modules: [
        {
          module_name: newModule.module_name,
          module_description: newModule.module_description,
        },
      ],
    };
    try {
      if(selectedModuleId){
        newModulePayload.modules[0].id = selectedModuleId
        await editModule(selectedCourseId, newModulePayload)
      }else{
        await AddNewmodule(selectedCourseId, newModulePayload);
      }
      setShowAddModal(false);
      setNewModule({
        module_name: "",
        module_description: "",
      });
      await fetchModules(selectedCourseId);
    } catch (error) {
      toast.error("Something Went Wrong, Please Try Again.", { autoClose: 3000 });
    }
  };

  const handleEdit = (module) => {
    setSelectedModuleId(module.id)
    setNewModule({
      module_name: module.module_name,
      module_description: module.module_description,
    });
    setShowAddModal(true);
  };

  const handleConfirmDelete = async () => {
    try {
      const newModulePayload = {
        modules: [
          {
            id: selectedModuleId, is_deleted: true 
          },
        ],
      };
      await deleteModule(selectedCourseId,newModulePayload);
      await fetchModules(selectedCourseId);
      setDeleteDialogOpen(false);
      selectedModuleId(null)
      setEditedTitle('')

    } catch (error) {
      console.error('Failed to delete:', error);
    }
  };

  const handleDelete = (id, title) => {
    setSelectedModuleId(id);
    setEditedTitle(title);
    setDeleteDialogOpen(true);
  };

  const handleCourseChange = (e) => {
    setSelectedCourseId(e.target.value);
  };

  const totalModules = modules[selectedCourseId]?.length || 0;

  return (
    <>
      <ToastContainer />
      

      <Modal
        open={showAddModal}
        onClose={() => setShowAddModal(false)}
        aria-labelledby="add-new-module-modal"
        aria-describedby="form-to-add-new-module"
      >
        <Box className="absolute m-auto inset-0 h-fit lg:w-1/4 md:w-2/4 sm:w-2/4 max-sm:w-4/5 bg-[#242728] text-[#BDBEBE] border-2 border-[#37383A] p-8 rounded-lg">
          <Typography
            variant="h6"
            component="h2"
            sx={{ mb: 2, fontFamily: "Poppins, sans-serif" }}
          >
            {selectedModuleId ? 'Edit' : 'Add New'} Module
          </Typography>
          <TextField
            label="Name"
            variant="outlined"
            name="module_name"
            value={newModule.module_name}
            onChange={handleInputChange}
            fullWidth
            sx={{
              mb: 2,
              "& input": { color: "#BDBEBE !important", fontFamily: "Poppins, sans-serif" },
              "& .MuiOutlinedInput-notchedOutline": { borderColor: "#37383A !important" },
              "& .MuiInputLabel-outlined": { color: "#BDBEBE !important" },
            }}
          />
          <TextField
            label="Description"
            variant="outlined"
            name="module_description"
            multiline
            rows={4}
            value={newModule.module_description}
            onChange={handleInputChange}
            fullWidth
            sx={{
              mb: 2,
              "& textarea": { color: "#BDBEBE !important", fontFamily: "Poppins, sans-serif" },
              "& .MuiOutlinedInput-notchedOutline": { borderColor: "#37383A !important" },
              "& .MuiInputLabel-outlined": { color: "#BDBEBE !important" },
            }}
          />
          <div className="flex justify-end">
            <Button
              onClick={() => setShowAddModal(false)}
              sx={{ mr: 2, color: "#BDBEBE", fontFamily: "Poppins, sans-serif", "&:hover": { background: "#282B2F" } }}
            >
              Cancel
            </Button>
            <Button
              variant="contained"
              onClick={addNewModule}
              sx={{ background: "#282B2F", color: "#BDBEBE", fontFamily: "Poppins, sans-serif", "&:hover": { background: "#282B2F" } }}
            >
              {selectedModuleId ? 'Edit' : 'Add'}
            </Button>
          </div>
        </Box>
      </Modal>
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
              <p>Are you sure you want to delete "{editedTitle}"?</p>
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
      <div className="m-5 bg-[#1A1C1E] rounded-lg mt-28">
        <div className="flex items-center justify-between header-title">
          <h4>Modules</h4>
          <Button
            variant="contained"
            onClick={() => {
              setNewModule({
                module_name: "",
                module_description: "",
              });
              setSelectedModuleId(null)
              setShowAddModal(true)
            }}
            sx={{ background: "#5b52e7", color: "#ffffff", fontFamily: "Poppins, sans-serif", "&:hover": { background: "#5b52e7" } }}
          >
            <AddCircleOutlineIcon sx={{ mr: 1 }} /> Add Module
          </Button>
        </div>

        <div className="0 mx-12">
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
              <option key={course.id} value={course.id} className="text-[#BDBEBE]">
                {course?.course_name}
              </option>
            ))}
          </select>
          </label>
        </div>

        <div className="grid gap-6 p-8 overflow-x-auto 2xl:grid-cols-5 xl:grid-cols-4 lg:grid-cols-3 md:grid-cols-2">
          {modules[selectedCourseId] ? (
            modules[selectedCourseId].map((module) => (
              <div
                key={module.id}
                className="bg-[#242728] border border-[#303234] rounded-md p-4 gap-3 cursor-pointer"
                onClick={()=>{navigate(`/admin/courses/${selectedCourseId}/module/${module.id}`)}}
              >
                  <div className="flex items-center justify-between">
                    <div className="flex-grow">
                    <h5 className="text-[#BDBEBE] font-semibold">{module.module_name}</h5>
                    </div>
                    <div className="flex-none flex flex-col">
                      <IconButton
                              color="primary"
                              aria-label="edit"
                              onClick={(event) =>
                              {  
                                event.stopPropagation();
                                handleEdit(module)}
                              }
                            >
                              <EditIcon sx={{fontSize: 18}}/>
                            </IconButton>
                            <IconButton
                              color="error"
                              aria-label="delete"
                              onClick={(event) =>{
                                event.stopPropagation();
                                handleDelete(module.id, module.module_name)
                              }
                              }
                            >
                              <DeleteIcon sx={{fontSize: 18}}/>
                            </IconButton>
                </div>
                  </div>
                  <p className="text-[#BDBEBE]">{module.module_description}</p>
              </div>
            ))
          ) : (
            <p className="text-[#BDBEBE]">No modules available for this course.</p>
          )}
        </div>
      </div>
    </>
  );
};

export default Modules;
