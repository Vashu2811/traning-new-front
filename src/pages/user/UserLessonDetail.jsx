/* eslint-disable no-unused-vars */
import { useEffect, useState } from "react";
import { Link, useLocation, useNavigate, useParams } from "react-router-dom";
import {
  getSpecificLessonDetail,
  getSpecificModuleLessons,
  getTraineeProgress,
} from "../../services/api";
import Excercise from "./Excercise";
import Quizze from "./Quizze";
import Resource from "./Resource";
import BotChat from "services/BotChat";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import Bot from "pages/Bot";
import TopNavTrainee from "./TopNavTrainee";
import AccessCourse from "components/AccessCourse";
import YouTubePlayer from "components/YouTubePlayerV2";

const UserLessonDetail = () => {
  const [showVideoInfo, setShowVideoInfo] = useState(true);
  const [showQuizzes, setShowQuizzes] = useState(false);
  const [showExercises, setShowExercises] = useState(false);
  const [showResources, setShowResources] = useState(false);
  const { moduleId, lessonId, courseId } = useParams();
  const [currentModule, setCurrentModule] = useState(moduleId);
  const [selectedLesson, setSelectedLesson] = useState("");
  const navigate = useNavigate();
  const { selectedCourse } = AccessCourse({ courseId });
  const [moduleName, setModuleName] = useState();
  const [lessonName, setLessonName] = useState();
  const [lessonProgress, setLessonProgress] = useState(0);

  const videoUrl = selectedLesson?.overview?.url;

  const videoId = videoUrl?.split("/").pop().split("?")[0];

  const location = useLocation();
  const { type } = location.state || {};

  useEffect(() => {
    setCurrentModule(moduleId);
  }, [moduleId]);

  // useEffect(() => {

  //     fetchModuleLessons();
  // }, [moduleId]);
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

  const fetchLessonData = async () => {
    // setLoading(true);
    try {
      const lessonData = await getSpecificLessonDetail(lessonId);

      setLessonName(lessonData?.overview?.title);
      setSelectedLesson(lessonData);
      // setLoading(false);
    } catch (error) {
      toast.error("Something Went Wrong, Please Try Again.", {
        autoClose: 3000,
      });
    }
  };

  const fetchLessonProgress = async () => {
    // setLoading(true);
    try {
      const lessonProgress = await getTraineeProgress("lesson", lessonId);
      setLessonProgress(
        lessonProgress && lessonProgress.length
          ? lessonProgress[0].total_progress
          : 0
      );
      // setLoading(false);
    } catch (error) {
      toast.error("Something Went Wrong, Please Try Again.", {
        autoClose: 3000,
      });
    }
  };
  useEffect(() => {
    fetchLessonProgress();
    fetchLessonData();
    fetchModuleLessons();
  }, [moduleId, lessonId]);

  if (!selectedLesson) {
    return <div>Lesson not found</div>;
  }

  const handlequizze = () => {
    setShowVideoInfo(false);
    setShowQuizzes(true);
    setShowExercises(false);
    setShowResources(false);
  };

  const handlexercises = () => {
    setShowVideoInfo(false);
    setShowQuizzes(false);
    setShowExercises(true);
    setShowResources(false);
  };

  const handlresources = () => {
    setShowVideoInfo(false);
    setShowQuizzes(false);
    setShowExercises(false);
    setShowResources(true);
  };

  const handlBackToVideo = () => {
    setShowVideoInfo(true);
    setShowQuizzes(false);
    setShowExercises(false);
    setShowResources(false);
  };
  return (
    <>
      <ToastContainer />
      <TopNavTrainee
        courseId={courseId}
        selectedCourse={selectedCourse}
        moduleName={moduleName}
        moduleId={moduleId}
        lessonId={lessonId}
        lessonName={lessonName}
        type={type}
      />
      <div className="flex flex-col lg:flex-row gap-5">
        <div className="bg-[#1A1C1E] rounded-lg w-full lg:w-[60%]">
          <div className="header-title">
            <h4 className="text-[#BDBEBE] font-semibold text-xl my-4">
              Module: {moduleName}
            </h4>
          </div>

          <div className="flex flex-col items-center gap-3">
            {showVideoInfo && selectedLesson?.overview?.url && (
              <div
                className="relative w-full"
                style={{ paddingBottom: "56.25%", height: 0 }}
              >
                {selectedLesson.overview.url.includes("youtube.com") ||
                selectedLesson.overview.url.includes("youtu.be") ? (
                  <YouTubePlayer
                    currentPercentage={lessonProgress}
                    videoUrl={selectedLesson.overview.url}
                    styles={{
                      position: "absolute",
                      top: 0,
                      left: 0,
                      width: "100%",
                      height: "100%",
                      borderRadius: "8px",
                    }}
                  />
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

            <div className="w-full text-center lg:text-left">
              <h2 className="text-2xl font-bold text-white">
                {selectedLesson?.overview?.title}
              </h2>
              <p className="font-normal text-white opacity-50 text-lg">
                {selectedLesson?.overview?.lesson_description}
              </p>
            </div>
          </div>

          {showResources && (
            <div>
              <Resource resources={selectedLesson.resources} />
            </div>
          )}

          {type !== "shorts" && (
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 p-6 pt-0 lg:w-9/12">
              <button
                onClick={handlresources}
                disabled={showResources}
                className={`${
                  showResources
                    ? "bg-[#5b52e7] text-white"
                    : "bg-[#282B2F] hover:bg-[#5b52e7] hover:text-white text-[#BDBEBE]"
                } rounded-[4px] p-3 border border-[#37383A] uppercase text-sm font-normal`}
              >
                Resources
              </button>
            </div>
          )}

          {!showVideoInfo && (
            <div>
              <p
                onClick={handlBackToVideo}
                className="text-[#BDBEBE] ml-5 cursor-pointer hover:underline"
              >
                Back to video
              </p>
            </div>
          )}
        </div>

        {type !== "shorts" && (
          <div className=" rounded-lg w-full lg:w-[30%] ">
            <Bot
              type="lesson"
              id={lessonId}
              prompts={selectedLesson?.lesson_prompt}
              title={[selectedLesson?.overview?.title]}
            />
          </div>
        )}
      </div>
    </>
  );
};

export default UserLessonDetail;