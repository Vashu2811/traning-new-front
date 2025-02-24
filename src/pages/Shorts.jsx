import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { addNewLesson, getSpecificModuleLessons } from "../services/api";
import AccessCourse from "components/AccessCourse";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { getModules } from "@syncfusion/ej2/spreadsheet";
import TopNav from "components/TopNav";
import PromptsDataTable from "components/PromptsDataTable";
import { Dialog, DialogActions, DialogContent, DialogTitle, Button } from "@mui/material";
import ContentCard from "../components/ContentCard";

const Shorts = () => {
  const [lessons, setLessons] = useState([]);
  const { moduleId, courseId } = useParams();
  const navigate = useNavigate();
  const [currentModule, setCurrentModule] = useState(moduleId);
  const [moduleName, setModuleName] = useState()
  const [moduleDetails, setModuleDetails] = useState(null)
  const [modules, setModules] = useState([]);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [lessonTitle, setLessonTitle] = useState('')
  const [deleteId, setDeleteId] = useState(null)

  const fetchModules = async (courseId) => {
    try {
      const response = await getModules(courseId);
      if (response) {
        setModules(response?.modules);
      } else {
        toast.error("Something Went Wrong, Please Try Again.", {
          autoClose: 3000,
        });
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

  const fetchModuleLessons = async (moduleId) => {
    try {
      const moduleLessons = await getSpecificModuleLessons(moduleId);
      setModuleDetails(moduleLessons)
      setModuleName(moduleLessons?.overview?.module_name)
      setLessons(moduleLessons?.lessons);
    } catch (error) {
      toast.error("Something Went Wrong, Please Try Again.", {
        autoClose: 3000,
      });
    }
  };

  useEffect(() => {
    fetchModuleLessons(moduleId);
  }, [moduleId]);

  useEffect(() => {
    setCurrentModule(moduleId);
  }, [moduleId]);

  const handleAddLesson = () => {
    navigate(`/admin/courses/${courseId}/module/${moduleId}/new-lesson`,
      {
        state: {
          type: 'shorts',
          name: 'Shorts'
        }
      });
  };

  const handleEditLesson = (lesson) => {
    navigate(`/admin/courses/${courseId}/module/${moduleId}/new-lesson`,
      {
        state: {
          ...lesson,
          type: 'shorts',
          name: 'Shorts',
          isEdit: true
        }
      });
  };

  const handleSavePrompts = async (updatedPrompt, editPromptsId, newPrompt) => {
    try {
      if (editPromptsId) {
        // If editQuizId is present, update the existing quiz
        const response = await addNewLesson(moduleId, {
          module_prompt: [updatedPrompt],
        });
        fetchModuleLessons(moduleId);
      } else {
        // If editQuizId is null, add a new quiz
        const response = await addNewLesson(moduleId, {
          module_prompt: [newPrompt],
        });
        fetchModuleLessons(moduleId);
      }
    } catch (error) {
      toast.error("Something Went Wrong, Please Try Again.", {
        autoClose: 3000,
      });
    }
  };

  const handleConfirmDelete = async () => {
    try {
      setDeleteDialogOpen(false);
      const payload = {
        lessons: [
          {
            id: deleteId,
            is_deleted: true
          },
        ],
      };
      await addNewLesson(moduleId, payload);
      fetchModuleLessons(moduleId);
      // Refresh or update lessons here
    } catch (error) {
      console.error('Failed to delete the lesson:', error);
    }
  };

  const { selectedCourse, storedUserId } = AccessCourse({ courseId });
  const CourseTrainerID = selectedCourse?.trainer_id;

  return (
    <>
      <ToastContainer />
      <TopNav
        courseId={courseId}
        selectedCourse={selectedCourse}
        moduleName={moduleName}
        moduleId={moduleId}
        type={'shorts'}
      />
      <ContentCard
        title={'Shorts'}
        lessons={lessons}
        canEdit={storedUserId === CourseTrainerID}
        onAddLesson={handleAddLesson}
        onEditLesson={handleEditLesson}
        onDeleteLesson={(lessonId) => {
          setDeleteId(lessonId);
          handleConfirmDelete();
        }}
        onLessonClick={(lessonId) =>
          navigate(`/admin/courses/${courseId}/module/${moduleId}/lesson/${lessonId}`,{state: {type: 'shorts'}})
        }
        isLoading={lessons?.length === 0}
        courseId={courseId}
        moduleId={moduleId}
      />
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
          Confirm Deletionaaaaaaaaaa
        </DialogTitle>
        <DialogContent
          sx={{
            background: "#242728",
            color: "#BDBEBE",
            fontFamily: "Poppins, sans-serif",
          }}
        >
          <p>Are you sure you want to delete "{lessonTitle}"?</p>
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
    </>
  );
};

export default Shorts;
