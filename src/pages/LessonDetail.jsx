/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable react-hooks/rules-of-hooks */
import { Tab, Tabs } from "@mui/material";
import React,{ useEffect, useState } from "react";
import { Link, useLocation, useParams } from "react-router-dom";
import ExerciseDataTable from "../components/ExerciseDataTable";
import QuizzeDataTable from "../components/QuizzeDataTable";
import ResourcesDataTable from "../components/ResourcesDataTable";
import product1 from "../data/product1.jpg";
import {
  AddLesson,
  Addquizzes,
  Updatequizzes,
  getSpecificLessonDetail,
  getSpecificModuleLessons,
  updateLesson,
} from "../services/api";
import { useRef } from "react";
import BotChat from "services/BotChat";
import { TailSpin } from "react-loader-spinner";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import PromptsDataTable from "components/PromptsDataTable";
import Bot from "./Bot";
import AccessCourse from "components/AccessCourse";
import TopNav from "components/TopNav";

const LessonDetail = () => {
  const { moduleId, lessonId, courseId } = useParams();
  const { selectedCourse } = AccessCourse({ courseId });

  const [selectedTab, setSelectedTab] = useState("resources"); // State for selected tab
  const [currentModule, setCurrentModule] = useState(moduleId);
  const [moduleName, setModuleName] = useState();
  const [lessonName, setLessonName] = useState();

  const [selectedLesson, setSelectedLesson] = useState({
    overview: {},
    resources: [],
    quizzes: [],
    exercises: [],
    lesson_prompt: [],
  });

  const videoUrl = selectedLesson.overview.url;
  const videoId = videoUrl?.split("/").pop().split("?")[0];

  const [loading, setLoading] = useState(false);
  // const [bot, setBot] = useState(false); // State for selected tab
  
  const location = useLocation()
  const {type} = location.state || {};

  useEffect(() => {
    const fetchModuleLessons = async () => {
      try {
        const moduleLessons = await getSpecificModuleLessons(moduleId);
        setModuleName(moduleLessons?.overview?.module_name);
        setCurrentModule(moduleId);
      } catch (error) {
        toast.error("Something Went Wrong, Please Try Again.", {
          autoClose: 3000,
        });
      }
    };

    fetchModuleLessons();
  }, [moduleId]);

  // Find the lesson with the given moduleId and lessonId
  // Fetch lesson data when component mounts or when moduleId or lessonId changes
  const fetchLessonData = async () => {
    setLoading(true);
    try {
      const lessonData = await getSpecificLessonDetail(lessonId);
      setLessonName(lessonData?.overview?.title);
      setSelectedLesson(lessonData);
      setLoading(false);
    } catch (error) {
      toast.error("Something Went Wrong, Please Try Again.", {
        autoClose: 3000,
      });
    }
  };
  const handleTabChange = (event, newValue) => {
    setSelectedTab(newValue);
  };

  const handleSaveQuiz = async (updatedQuiz, editQuizId, newQuiz) => {
    try {
      if (editQuizId) {
        // If editQuizId is present, update the existing quiz
        const response = await Updatequizzes(lessonId, {
          quizzes: [updatedQuiz],
        });
        fetchLessonData();
      } else {
        // If editQuizId is null, add a new quiz
        const response = await Addquizzes(lessonId, { quizzes: [newQuiz] });
        fetchLessonData();
      }
    } catch (error) {
      toast.error("Something Went Wrong, Please Try Again.", {
        autoClose: 3000,
      });
    }
  };
  const handleSaveExercise = async (
    updatedExercise,
    editExerciseId,
    newExercise
  ) => {
    try {
      if (editExerciseId) {
        // If editQuizId is present, update the existing quiz
        const response = await Updatequizzes(lessonId, {
          exercises: [updatedExercise],
        });
        fetchLessonData();
      } else {
        // If editQuizId is null, add a new quiz
        const response = await Addquizzes(lessonId, {
          exercises: [newExercise],
        });
        fetchLessonData();
      }
    } catch (error) {
      // Handle error appropriately
    }
  };

  const handleSaveResources = async (
    updatedResource,
    editResourceId,
    newResource
  ) => {
    try {
      if (editResourceId) {
        // If editQuizId is present, update the existing quiz
        const response = await Updatequizzes(lessonId, {
          resources: [updatedResource],
        });
        fetchLessonData();
      } else {
        // If editQuizId is null, add a new quiz
        const response = await Addquizzes(lessonId, {
          resources: [newResource],
        });

        fetchLessonData();
      }
    } catch (error) {
      toast.error("Something Went Wrong, Please Try Again.", {
        autoClose: 3000,
      });

      // Handle error appropriately
    }
  };

  const handleSavePrompts = async (updatedPrompt, editPromptsId, newPrompt) => {
    try {
      if (editPromptsId) {
        // If editQuizId is present, update the existing quiz
        const response = await updateLesson(lessonId, {
          lesson_prompt: [updatedPrompt],
        });
        fetchLessonData();
      } else {
        // If editQuizId is null, add a new quiz
        const response = await AddLesson(lessonId, {
          lesson_prompt: [newPrompt],
        });

        fetchLessonData();
      }
    } catch (error) {
      toast.error("Something Went Wrong, Please Try Again.", {
        autoClose: 3000,
      });
    }
  };

  useEffect(() => {
    fetchLessonData();
  }, [moduleId, lessonId]);
  return (
    <>
      <ToastContainer />

      <TopNav
        courseId={courseId}
        selectedCourse={selectedCourse}
        moduleName={moduleName}
        moduleId={moduleId}
        lessonId={lessonId}
        lessonName={lessonName}
        type={type}
      />
      
    <div className="flex flex-col md:flex-row w-full p-4">
      <div className="m-2 bg-[#1A1C1E] rounded-lg w-full md:w-3/5 p-4">
        <div className="header-title">
          <h4 className="text-[#BDBEBE] font-semibold text-xl my-4">
            Module: {moduleName}
          </h4>
        </div>
        
        {selectedLesson.overview?.url && (
          <div className="relative w-full pb-[56.25%] h-0">
            {selectedLesson.overview.url.includes("youtube.com") || selectedLesson.overview.url.includes("youtu.be") ? (
              <iframe
                title="YouTube Video"
                className="absolute top-0 left-0 w-full h-full rounded-lg"
                src={`https://www.youtube.com/embed/${
                  selectedLesson.overview.url.split("v=")[1]?.split("&")[0] ||
                  selectedLesson.overview.url.split("/").pop()
                }`}
                frameBorder="0"
                allow="accelerometer; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
              ></iframe>
            ) : (
              <iframe
                title="Video"
                className="absolute top-0 left-0 w-full h-full rounded-lg"
                src={selectedLesson.overview.url}
                frameBorder="0"
                allow="autoplay; fullscreen"
                allowFullScreen
              ></iframe>
            )}
          </div>
        )}

        <div className="w-full my-4">
          <h2 className="text-2xl font-bold ">{selectedLesson?.overview?.title}</h2>
          <p className="mb-5 text-lg font-normal opacity-50">
            {selectedLesson?.overview?.lesson_description}
          </p>
        </div>
        {type !== "shorts" && (
        <div className="m-2 bg-[#1A1C1E] rounded-lg w-full  p-4">
          <Tabs
            value={selectedTab}
            onChange={handleTabChange}
            TabIndicatorProps={{ style: { backgroundColor: "#5b52e7" } }}
          >
            <Tab
              label="Resources"
              value="resources"
              sx={{
                fontFamily: "Poppins, sans-serif",
                fontSize: "16px",
                color: selectedTab === "quizzes" ? "#8C8D8E" : "#8C8D8E",
                "&.Mui-selected": { color: "#FFF" },
              }}
            />
            <Tab
              label="Prompts"
              value="prompts"
              sx={{
                fontFamily: "Poppins, sans-serif",
                fontSize: "16px",
                color: selectedTab === "prompts" ? "#8C8D8E" : "#8C8D8E",
                "&.Mui-selected": { color: "#FFF" },
              }}
            />
          </Tabs>
          {selectedTab === "resources" && (
            <ResourcesDataTable
              resources={selectedLesson.resources}
              onSaveResource={handleSaveResources}
              courseId={courseId}
            />
          )}
          {selectedTab === "prompts" && (
            <PromptsDataTable
              prompts={selectedLesson.lesson_prompt}
              onSavePrompt={handleSavePrompts}
              courseId={courseId}
            />
          )}
        </div>
      )}
      </div>
      
      
      
      {selectedLesson.overview && selectedLesson.overview.length !== 0 && type !== "shorts" && (
        <div className="m-2 rounded-lg w-full md:w-1/3 ">
          <Bot
            type={"lesson"}
            id={selectedLesson?.overview?.lesson_number}
            prompts={selectedLesson?.lesson_prompt}
            title={selectedLesson?.overview?.title}
          />
        </div>
      )}
    </div>


    </>
  );
};

export default React.memo(LessonDetail);
