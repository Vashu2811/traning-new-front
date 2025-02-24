import { useEffect, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";

import { AddNewmodule, deleteModule, editModule, getModules } from "../services/api";

import AddCircleOutlineIcon from "@mui/icons-material/AddCircleOutline";
import { Box, Button, Chip, Dialog, DialogActions, DialogContent, DialogTitle, IconButton, Modal, TextField, Typography } from "@mui/material";
import { TailSpin } from "react-loader-spinner";
import { useReduxState } from "hooks/useReduxActions";

import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import AccessCourse from "components/AccessCourse";
import TopNav from "components/TopNav";
import PromptsDataTable from "components/PromptsDataTable";
import DeleteIcon from "@mui/icons-material/Delete";
import EditIcon from "@mui/icons-material/Edit";
import _ from 'lodash'
import ModuleGrid from "../components/ModuleGrid";



const Module = () => {
  const { courseId } = useParams();

  const [showAddModal, setShowAddModal] = useState(false);
  const [selectedModule, setSelectedModule] = useState('');
  const [modules, setModules] = useState([]);
  const [coreModules, setCoreModules] = useState([]);
  const [interview, setInterview] = useState([]);
  const [selectedModuleId, setSelectedModuleId] = useState(null);
  const [newModule, setNewModule] = useState({
    module_name: "",
    module_description: "",
    order_number: null,
    // youtubeLink: "",
  });
  const [deleteTitle, setDeleteTitle] = useState("");
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [courseDetails, setCourseDetails] = useState(null);
  const [shortsModules, setShortsModules] = useState([]);
  const navigate = useNavigate();

  const fetchModules = async (courseId) => {
    try {
      const response = await getModules(courseId);
      if (response) {
        const modules = response?.modules
        setCourseDetails(response)
        setModules(_.orderBy(
          modules?.filter((module) => module.type === 'ai'),
          [(module) => module.order_number || Number.MAX_VALUE],
          ['asc']
        ));
        setCoreModules(_.orderBy(
          modules?.filter((module) => module.type === 'core'),
          [(module) => module.order_number || Number.MAX_VALUE],
          ['asc']
        ))
        setInterview(_.orderBy(
          modules?.filter((module) => module.type === 'interview'),
          [(module) => module.order_number || Number.MAX_VALUE],
          ['asc']
        ))
        setShortsModules(_.orderBy(
          modules?.filter((module) => module.type === 'shorts'),
          [(module) => module.order_number || Number.MAX_VALUE],
          ['asc']
        ))
      } else {
        toast.error("Something Went Wrong, Please Try Again.", {
          autoClose: 3000,
        });
      }
    } catch (error) {
      console.log('error------', error)
      toast.error("Something Went Wrong, Please Try Again.", {
        autoClose: 3000,
      });
    }
  };

  const handleSavePrompts = async (updatedPrompt, editPromptsId, newPrompt) => {
    try {
      if (editPromptsId) {
        // If editQuizId is present, update the existing quiz
        const response = await editModule(courseId, {
          training_course_prompt: [updatedPrompt],
        });
        fetchModules(courseId);
      } else {
        // If editQuizId is null, add a new quiz
        const response = await AddNewmodule(courseId, {
          training_course_prompt: [newPrompt],
        });

        fetchModules(courseId);
      }
    } catch (error) {
      toast.error("Something Went Wrong, Please Try Again.", {
        autoClose: 3000,
      });
    }
  };

  useEffect(() => {
    fetchModules(courseId);
  }, [courseId]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    if (name === "youtubeLink") {
      setNewModule((prevModule) => ({
        ...prevModule,
        [name]: value,
      }));
    } else {
      setNewModule((prevModule) => ({
        ...prevModule,
        [name]: value,
      }));
    }
  };

  const addNewModule = async () => {
    // const newModuleWithId = { ...newModule };
    const newModulePayload = {
      modules: [
        {
          module_name: newModule.module_name,
          module_description: newModule.module_description,
          order_number: newModule.order_number,
          type: selectedModule
        },
      ],
    };
    try {
      if (selectedModuleId) {
        newModulePayload.modules[0].id = selectedModuleId
        await editModule(courseId, newModulePayload)
      } else {
        await AddNewmodule(courseId, newModulePayload);
      }
      setShowAddModal(false);
      setNewModule({
        module_name: "",
        module_description: "",
        order_number: null,
        youtubeLink: "",
      });
      await fetchModules(courseId);
    } catch (error) {
      toast.error("Something Went Wrong, Please Try Again.", {
        autoClose: 3000,
      });
    }
  };

  const Addmodule = (value) => {
    setShowAddModal(true);
    setSelectedModule(value)
    setSelectedModuleId(null)
    setNewModule({
      module_name: "",
      module_description: "",
      order_number: null,
    });
    // const id = generateId();
    // setGenerated(id);
  };

  const handleEdit = (module, value) => {
    console.log(value, ';;;;;;;;;', module.id);
    setSelectedModule(value)
    setSelectedModuleId(module.id)
    setNewModule({
      module_name: module.module_name,
      module_description: module.module_description,
      order_number: module.order_number,
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
      await deleteModule(courseId, newModulePayload);
      await fetchModules(courseId);
      setDeleteDialogOpen(false);
      selectedModuleId(null)
      setDeleteTitle('')

    } catch (error) {
      console.error('Failed to delete:', error);
    }
  };

  const handleDelete = (id, title) => {
    setSelectedModuleId(id);
    setDeleteTitle(title);
    setDeleteDialogOpen(true);
  };

  const { selectedCourse, storedUserId } = AccessCourse({ courseId });

  const CourseTrainerID = selectedCourse?.trainer_id;
  return (
    <>
      <ToastContainer />
    
      <TopNav 
        courseId={courseId}
        selectedCourse={selectedCourse}
      />
      
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
            {selectedModuleId ? 'Edit' : 'Add New'} {selectedModule} New Module
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
            label="Order Number"
            variant="outlined"
            name="order_number"
            value={newModule.order_number}
            onChange={handleInputChange}
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
          />
          
          <div className="flex justify-end">
            <Button
              onClick={() => setShowAddModal(false)}
              sx={{
                mr: 2,
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
              variant="contained"
              onClick={addNewModule}
              sx={{
                background: "#282B2F",
                color: "#BDBEBE",
                fontFamily: "Poppins, sans-serif",
                "&:hover": {
                  background: "#282B2F",
                },
              }}
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
          <p>Are you sure you want to delete "{deleteTitle}"?</p>
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


      <ModuleGrid
        title="Core Modules"
        modules={coreModules}
        canEdit={storedUserId === CourseTrainerID}
        onAddModule={() => Addmodule('core')}
        onEditModule={(module) => handleEdit(module, 'core')}
        onDeleteModule={(moduleId, moduleName) => handleDelete(moduleId, moduleName)}
        onModuleClick={(moduleId) => navigate(`/admin/courses/${courseId}/module/${moduleId}`)}
        userId={storedUserId}
        trainerUserId={CourseTrainerID}
      />

      <ModuleGrid
        title="Shorts Modules"
        modules={shortsModules}
        canEdit={storedUserId === CourseTrainerID}
        onAddModule={() => Addmodule('shorts')}
        onEditModule={(module) => handleEdit(module, 'shorts')}
        onDeleteModule={(moduleId, moduleName) => handleDelete(moduleId, moduleName)}
        onModuleClick={(moduleId) => navigate(`/admin/courses/${courseId}/shorts/${moduleId}`)}
        userId={storedUserId}
        trainerUserId={CourseTrainerID}
      />
      
      <div className="m-5 bg-[#1A1C1E] rounded-lg">
        <div className="flex items-center justify-between header-title">
          <h4>AI Enablement</h4>
          {storedUserId === CourseTrainerID ? (
            <div className="">
              <Button
                variant="contained"
                onClick={() => Addmodule('ai')}
                sx={{
                  background: "#5b52e7",
                  color: "#ffffff",
                  fontFamily: "Poppins, sans-serif",
                  "&:hover": {
                    background: "#5b52e7",
                  },
                }}
              >
                <AddCircleOutlineIcon sx={{ mr: 1 }} /> Add
              </Button>
            </div>
          ) : null}
        </div>
        <div className="grid gap-6 p-8 overflow-x-auto 2xl:grid-cols-5 xl:grid-cols-4 lg:grid-cols-3 md:grid-cols-2">
          {modules?.length === 0 ? (
            // Loader component or loading message goes here
            <div>No AI Enablement available</div>
          ) : modules ? (
            modules?.map((module) => (
              <div
                key={module.id}
                className="bg-[#242728] border border-[#303234] rounded-md p-4 gap-3 cursor-pointer relative"
                onClick={() => { navigate(`/admin/courses/${courseId}/module/${module.id}`) }}
              >
                <div className="absolute -top-3 -left-3"><Chip label={module?.order_number} size="small" color="primary" /></div>
                <div className="flex items-start justify-between">
                  <div>
                    <h5 className="text-[#BDBEBE] font-semibold">{`${module.module_name}`}</h5>
                  </div>
                  <div className="flex flex-col">
                    <IconButton
                      color="primary"
                      aria-label="edit"
                      onClick={(event) => {
                        event.stopPropagation();
                        handleEdit(module, 'ai')
                      }
                      }
                    >
                      <EditIcon sx={{ fontSize: 18 }} />
                    </IconButton>
                    <IconButton
                      color="error"
                      aria-label="delete"
                      onClick={(event) => {
                        event.stopPropagation();
                        handleDelete(module.id, module.module_name)
                      }
                      }
                    >
                      <DeleteIcon sx={{ fontSize: 18 }} />
                    </IconButton>
                  </div>
                </div>
                {/* <p className="text-[#BDBEBE]">{module.module_description}</p>
                 */}
   <p className="text-[#BDBEBE]">{module.module_description.length > 50
    ? module.module_description.slice(0, 50) + "..."
    : module.module_description}</p>
              </div>
            ))
          ) : (
            // Render something else if there are no courses
            <div>No AI Enablement available</div>
          )}
        </div>
      </div>

      <div className="m-5 bg-[#1A1C1E] rounded-lg">
        <div className="flex items-center justify-between header-title">
          <h4>Getting Ready for Job</h4>
          {storedUserId === CourseTrainerID ? (
            <div className="">
              <Button
                variant="contained"
                onClick={() => Addmodule('interview')}
                sx={{
                  background: "#5b52e7",
                  color: "#ffffff",
                  fontFamily: "Poppins, sans-serif",
                  "&:hover": {
                    background: "#5b52e7",
                  },
                }}
              >
                <AddCircleOutlineIcon sx={{ mr: 1 }} /> Add
              </Button>
            </div>
          ) : null}
        </div>
        <div className="grid gap-6 p-8 overflow-x-auto 2xl:grid-cols-5 xl:grid-cols-4 lg:grid-cols-3 md:grid-cols-2">
          {interview?.length === 0 ? (
            // Loader component or loading message goes here
            <div>No Data available</div>
          ) : interview ? (
            interview?.map((module) => (
              <div
                key={module.id}
                className="bg-[#242728] border border-[#303234] rounded-md p-4 gap-3 cursor-pointer relative"
                onClick={() => { navigate(`/admin/courses/${courseId}/module/${module.id}`) }}
              >
                <div className="absolute -top-3 -left-3"><Chip label={module?.order_number} size="small" color="primary" /></div>
                <div className="flex items-start justify-between">
                  <div>
                    <h5 className="text-[#BDBEBE] font-semibold">{`${module.module_name}`}</h5>
                  </div>
                  <div className="flex flex-col">
                    <IconButton
                      color="primary"
                      aria-label="edit"
                      onClick={(event) => {
                        event.stopPropagation();
                        handleEdit(module, 'interview')
                      }
                      }
                    >
                      <EditIcon sx={{ fontSize: 18 }} />
                    </IconButton>
                    <IconButton
                      color="error"
                      aria-label="delete"
                      onClick={(event) => {
                        event.stopPropagation();
                        handleDelete(module.id, module.module_name)
                      }
                      }
                    >
                      <DeleteIcon sx={{ fontSize: 18 }} />
                    </IconButton>
                  </div>
                </div>
                {/* <p className="text-[#BDBEBE]">{module.module_description}</p> */}
                <p className="text-[#BDBEBE]">{module.module_description.length > 50
    ? module.module_description.slice(0, 50) + "..."
    : module.module_description}</p>
              </div>
            ))
          ) : (
            // Render something else if there are no courses
            <div>No Data available</div>
          )}
        </div>
      </div>
      <PromptsDataTable
        prompts={courseDetails?.training_course_prompt}
        onSavePrompt={handleSavePrompts}
        courseId={courseId}
      />
    </>
  );
};

export default Module;
