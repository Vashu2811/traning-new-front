import { useEffect, useState } from "react";
import AddCircleOutlineIcon from "@mui/icons-material/AddCircleOutline";
import { Link, useNavigate, useParams } from "react-router-dom";
import { addNewLesson, deleteLesson, getSpecificModuleLessons } from "../services/api";
import { TailSpin } from "react-loader-spinner";
import AccessCourse from "components/AccessCourse";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { getModules } from "@syncfusion/ej2/spreadsheet";
import TopNav from "components/TopNav";
import PromptsDataTable from "components/PromptsDataTable";
import DeleteIcon from "@mui/icons-material/Delete";
import EditIcon from "@mui/icons-material/Edit";
import { Dialog, DialogActions, DialogContent, DialogTitle, IconButton, Button } from "@mui/material";
import ContentCard from "../components/ContentCard";

const Lesson = () => {
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
          type: 'lesson',
          name: 'Lesson'
        }
      });
  };

  const handleEditLesson = (lesson) => {
    navigate(`/admin/courses/${courseId}/module/${moduleId}/new-lesson`,
      {
        state: {
          ...lesson,
          type: 'lesson',
          name: 'Lesson',
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
      />
      <ContentCard
        lessons={lessons}
        canEdit={storedUserId === CourseTrainerID}
        onAddLesson={handleAddLesson}
        onEditLesson={handleEditLesson}
        onDeleteLesson={(lessonId) => {
          setDeleteId(lessonId);
          handleConfirmDelete();
        }}
        onLessonClick={(lessonId) =>
          navigate(`/admin/courses/${courseId}/module/${moduleId}/lesson/${lessonId}`)
        }
        isLoading={lessons?.length === 0}
        courseId={courseId}
        moduleId={moduleId}
      />
      {/* <div className="m-5 bg-[#1A1C1E] rounded-lg">
        <div className="flex items-center justify-between header-title">
          <h4>Lessons</h4>
          {storedUserId === CourseTrainerID && (
            <button
              onClick={handleAddLesson}
              className="border rounded py-1.5 px-4 border-[#5b52e7] font-medium text-sm text-[#fff] bg-[#5b52e7] uppercase"
            >
              <AddCircleOutlineIcon sx={{ mr: 1 }} />
              Add New Lesson 
            </button> 
          )}
        </div>

        <div className="grid gap-6 p-8 overflow-x-auto 2xl:grid-cols-5 xl:grid-cols-4 lg:grid-cols-3 md:grid-cols-2">
          {lessons?.length === 0 ? (
            // <div className="mx-12 mt-4 text-center">
            <TailSpin
              color="#FFFFFF"
              height={20}
              width={20}
              style={{ margin: "10px 10px" }}
            />
          ) : // </div>
            lessons ? (
              lessons
                .sort((a, b) => a.lesson_number - b.lesson_number)
                .map((lesson) => (
                  <div
                    key={lesson.id}
                    className="bg-[#242728] border border-[#303234] overflow-hidden rounded-md gap-3"
                  >
                    <div
                      onClick={() => navigate(`/admin/courses/${courseId}/module/${moduleId}/lesson/${lesson.id}`)} 
                      style={{ textDecoration: "none" }}
                    >
                    {lesson.url ? (
                      lesson.url.includes("youtube.com") ||
                        lesson.url.includes("youtu.be") ? (
                        <div className="">
                          <iframe
                            title="YouTube Video"
                            width="100%"
                            height="170"
                            src={`https://www.youtube.com/embed/${lesson.url.split("v=")[1]?.split("&")[0] ||
                              lesson.url.split("/").pop()
                              }`}
                            frameBorder="0"
                            allow="accelerometer; autoplay; encrypted-media; gyroscope; picture-in-picture"
                            allowFullScreen
                          ></iframe>
                        </div>
                      ) : (
                        <div className="">
                          <iframe
                            title="Video"
                            width="100%"
                            height="170"
                            src={lesson.url}
                            frameBorder="0"
                            allow="fullscreen"
                            allowFullScreen
                          ></iframe>
                        </div>
                      )
                    ) : (
                      <div
                        className="loading-spinner"
                        style={{
                          width: "100%",
                          height: "170px",
                          backgroundColor: "#000000",
                          animation: "loading 2s infinite linear",
                        }}
                      >
                        <TailSpin color="#c5c6c7" height={40} width={40} />
                      </div>
                    )}     <div className="flex items-start justify-between">
                      <div>
                        <h5 className="flex align-middle justify-start my-1 text-lg font-normal px-2">{lesson.title}</h5>
                      </div>
                      <div className="flex flex-col">
                        <IconButton
                          color="primary"
                          aria-label="edit"
                          onClick={(event) => {
                            event.stopPropagation();
                            handleEditLesson(lesson)
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
                            setLessonTitle(lesson.title)
                            setDeleteId(lesson.id)
                            setDeleteDialogOpen(true)
                          }
                          }
                        >
                          <DeleteIcon sx={{ fontSize: 18 }} />
                        </IconButton>
                      </div>
                    </div>
                    <p className="px-4 opacity-50 my-2.5">
                      {lesson.lesson_description}
                    </p>
                    </div>
                  </div>
                ))
            ) : (
              // Render something else if there are no courses
              <div>No Lessons available</div>
            )}
        </div>
      </div> */}
      <PromptsDataTable
        prompts={moduleDetails?.module_prompt}
        onSavePrompt={handleSavePrompts}
        courseId={courseId}
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
          Confirm Deletion
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

export default Lesson;
