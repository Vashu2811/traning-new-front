/* eslint-disable no-unused-vars */
/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable react-hooks/rules-of-hooks */
import { Tab, Tabs } from "@mui/material";
import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";

import { useRef } from "react";
import { TailSpin } from "react-loader-spinner";
import {
  Addquizzes,
  Updatequizzes,
  getSpecificLessonDetail,
} from "services/api";
import QuizzeDataTable from "components/QuizzeDataTable";
import ExerciseDataTable from "components/ExerciseDataTable";
import ResourcesDataTable from "components/ResourcesDataTable";
import BotChat from "services/BotChat";

import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';



const TrainingLessonDetail = () => {
  const { moduleId, lessonId, courseId } = useParams();
  const [selectedTab, setSelectedTab] = useState("quizzes"); // State for selected tab
  const [currentModule, setCurrentModule] = useState(moduleId);
  const [selectedLesson, setSelectedLesson] = useState({
    overview: {},
    resources: [],
    quizzes: [],
    exercises: [],
  });
  const [loading, setLoading] = useState(false);
  // const [bot, setBot] = useState(false); // State for selected tab

  useEffect(() => {
    // Update the currentModule state when moduleId changes
    setCurrentModule(moduleId);
  }, [moduleId]);
  // Find the lesson with the given moduleId and lessonId
  // Fetch lesson data when component mounts or when moduleId or lessonId changes
  const fetchLessonData = async () => {
    setLoading(true);
    try {
      const lessonData = await getSpecificLessonDetail(lessonId);
      
      setSelectedLesson(lessonData);
      setLoading(false);
    } catch (error) {
      toast.error("Something Went Wrong, Please Try Again.", {
        autoClose: 3000,
      });
      
      
    }
  };

  // if (!selectedLesson) {
  //   return <div>Lesson not found</div>;
  // }
  const handleTabChange = (event, newValue) => {
    setSelectedTab(newValue);
  };
  

  // useEffect(() => {
  //   const dynamicRouteRegex = /^\/admin\/module\/\d+\/lesson\/\d+$/i;
  //   if (dynamicRouteRegex.test(window.location.pathname)) {
  //     setBot(true);
  //   }
  // }, []);
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
      
      
      // Handle error appropriately
    }
  };
  const handleSaveExercize = async (
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
      toast.error("Something Went Wrong, Please Try Again.", {
        autoClose: 3000,
      });
      
      
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
  useEffect(() => {
    fetchLessonData();
  }, [moduleId, lessonId]);
  
  return (
    <>
    <ToastContainer/>
      {/* {bot && <BotChat />} */}
      <nav
        class="flex mx-12 my-4 lg:mt-20 md:mt-20 max-sm:mt-20 sm:mt-20"
        aria-label="Breadcrumb"
      >
        <ol class="inline-flex items-center space-x-1 md:space-x-2 rtl:space-x-reverse">
          <li class="inline-flex items-center">
            <Link
              to="/training"
              class="inline-flex items-center text-base font-medium text-[#BDBEBE]"
            >
              <svg
                class="w-3 h-3 me-2.5"
                aria-hidden="true"
                xmlns="http://www.w3.org/2000/svg"
                fill="currentColor"
                viewBox="0 0 20 20"
              >
                <path d="m19.707 9.293-2-2-7-7a1 1 0 0 0-1.414 0l-7 7-2 2a1 1 0 0 0 1.414 1.414L2 10.414V18a2 2 0 0 0 2 2h3a1 1 0 0 0 1-1v-4a1 1 0 0 1 1-1h2a1 1 0 0 1 1 1v4a1 1 0 0 0 1 1h3a2 2 0 0 0 2-2v-7.586l.293.293a1 1 0 0 0 1.414-1.414Z" />
              </svg>
              Home
            </Link>
          </li>
          <li>
            <div class="flex items-center">
              <svg
                class="rtl:rotate-180 w-3 h-3 text-[#BDBEBE]"
                aria-hidden="true"
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 6 10"
              >
                <path
                  stroke="currentColor"
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  stroke-width="2"
                  d="m1 9 4-4-4-4"
                />
              </svg>
              <svg
                class="rtl:rotate-180 w-3 h-3 text-[#BDBEBE] me-2.5"
                aria-hidden="true"
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 6 10"
              >
                <path
                  stroke="currentColor"
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  stroke-width="2"
                  d="m1 9 4-4-4-4"
                />
              </svg>
              <Link
                to={`/training`}
                className="inline-flex items-center text-base font-medium text-[#BDBEBE]"
              >
                Courses
              </Link>
            </div>
          </li>
          <li>
            <div class="flex items-center">
              <svg
                class="rtl:rotate-180 w-3 h-3 text-[#BDBEBE]"
                aria-hidden="true"
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 6 10"
              >
                <path
                  stroke="currentColor"
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  stroke-width="2"
                  d="m1 9 4-4-4-4"
                />
              </svg>
              <svg
                class="rtl:rotate-180 w-3 h-3 text-[#BDBEBE] me-2.5"
                aria-hidden="true"
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 6 10"
              >
                <path
                  stroke="currentColor"
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  stroke-width="2"
                  d="m1 9 4-4-4-4"
                />
              </svg>
              <Link
                to={`/training/courses/${courseId}`}
                className="inline-flex items-center text-base font-medium text-[#BDBEBE]"
              >
                Course {courseId}
              </Link>
            </div>
          </li>
          <li>
            <div class="flex items-center">
              <svg
                class="rtl:rotate-180 w-3 h-3 text-[#BDBEBE]"
                aria-hidden="true"
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 6 10"
              >
                <path
                  stroke="currentColor"
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  stroke-width="2"
                  d="m1 9 4-4-4-4"
                />
              </svg>
              <svg
                class="rtl:rotate-180 w-3 h-3 text-[#BDBEBE] me-2.5"
                aria-hidden="true"
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 6 10"
              >
                <path
                  stroke="currentColor"
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  stroke-width="2"
                  d="m1 9 4-4-4-4"
                />
              </svg>
              <Link
                to={`/training/courses/${courseId}/module/${moduleId}`}
                className="inline-flex items-center text-base font-medium text-[#BDBEBE]"
              >
                Module {moduleId}
              </Link>
            </div>
          </li>
          {lessonId && (
            <li>
              <div className="flex items-center">
                <svg
                  class="rtl:rotate-180 w-3 h-3 text-[#BDBEBE]"
                  aria-hidden="true"
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 6 10"
                >
                  <path
                    stroke="currentColor"
                    stroke-linecap="round"
                    stroke-linejoin="round"
                    stroke-width="2"
                    d="m1 9 4-4-4-4"
                  />
                </svg>
                <svg
                  class="rtl:rotate-180 w-3 h-3 text-[#BDBEBE] me-2.5"
                  aria-hidden="true"
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 6 10"
                >
                  <path
                    stroke="currentColor"
                    stroke-linecap="round"
                    stroke-linejoin="round"
                    stroke-width="2"
                    d="m1 9 4-4-4-4"
                  />
                </svg>
                <Link
                  to={`/training/courses/${courseId}/module/${moduleId}/lesson/${lessonId}`}
                  className="inline-flex items-center text-base font-medium text-[#BDBEBE]"
                >
                  Lesson {lessonId}
                </Link>
              </div>
            </li>
          )}
        </ol>
      </nav>

      <div className="mx-12 w-[60%]">
        <h2 className="text-[#BDBEBE] font-semibold text-xl my-4">
          Module ID: {moduleId} - Lesson ID: {lessonId}
        </h2>
        {/* {loading ? (
          <div className="mx-12 mt-4 text-center">
            <TailSpin
              color="#FFFFFF"
              height={20}
              width={20}
              style={{ margin: "10px 10px" }}
            />{" "}
          </div>
        ) : selectedLesson ? ( */}
        <>
          <div className="flex flex-col items-center">
            {/* <img
            src={selectedLesson.link}
            alt={selectedLesson.name}
            className="w-full max-w-[500px] mb-3"
          /> */}

            {selectedLesson.overview.url && (
              <div className="mb-20">
                <iframe
                  title="YouTube Video"
                  width="560" // Adjust the width here (e.g., 560px)
                  height="315"
                  src={`https://www.youtube.com/embed/${selectedLesson.overview.url}`}
                  frameBorder="0"
                  allow="accelerometer; autoplay; encrypted-media; gyroscope; picture-in-picture"
                  allowFullScreen
                ></iframe>
              </div>
            )}

            <h2 className="text-2xl font-bold mb-2">
              {selectedLesson?.overview?.title}
            </h2>
            <p className="text-lg font-normal mb-5">
              {selectedLesson?.overview?.lesson_description}
            </p>
          </div>
        </>
        {/* ) : (
          // Render something else if there are no courses
          <div>No Lesson available</div>
        )} */}
      </div>

      <div className="mx-12 w-[60%]">
        <Tabs value={selectedTab} onChange={handleTabChange} className="mb-8">
          <Tab
            label="Quizzes"
            value="quizzes"
            sx={{
              fontFamily: "Poppins, sans-serif",
              fontSize: "16px",
              color: selectedTab === "quizzes" ? "#8C8D8E" : "#8C8D8E",
              "&.Mui-selected": {
                color: "#FFF",
              },
            }}
          />
          <Tab
            label="Exercises"
            value="exercises"
            sx={{
              fontFamily: "Poppins, sans-serif",
              fontSize: "16px",
              color: selectedTab === "quizzes" ? "#8C8D8E" : "#8C8D8E",
              "&.Mui-selected": {
                color: "#FFF",
              },
            }}
          />
          <Tab
            label="Resources"
            value="resources"
            sx={{
              fontFamily: "Poppins, sans-serif",
              fontSize: "16px",
              color: selectedTab === "quizzes" ? "#8C8D8E" : "#8C8D8E",
              "&.Mui-selected": {
                color: "#FFF",
              },
            }}
          />
        </Tabs>
        {/* Display the DataTable with data for the selected tab */}
        {selectedTab === "quizzes" && (
          <QuizzeDataTable
            quizzes={selectedLesson.quizzes}
            onSaveQuiz={handleSaveQuiz}
          />
        )}
        {selectedTab === "exercises" && (
          <ExerciseDataTable
            exercises={selectedLesson.exercises}
            onSaveExercise={handleSaveExercize}
          />
        )}
        {selectedTab === "resources" && (
          <ResourcesDataTable
            resources={selectedLesson.resources}
            onSaveResource={handleSaveResources}
          />
        )}
      </div>
      <BotChat />
    </>
  );
};

export default TrainingLessonDetail;
