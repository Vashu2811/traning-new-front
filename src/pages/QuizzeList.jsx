import { useState, useEffect } from "react";
import QuizzeDataTable from "../components/QuizzeDataTable";
import {
  Addquizzes,
  getModules,
  getSpecificLessonDetail,
  getSpecificModuleLessons,
  Updatequizzes,
} from "services/api";
import { useDispatch } from "react-redux";
import { fetchAllCourses } from "store/actions/course";

import { setLoading } from "store/reducers/loadingReducer";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const QuizList = () => {
  const [modules, setModules] = useState([]);
  const [lessons, setLessons] = useState([]);
  const [quizzes, setQuizzes] = useState([]);
  const [courseId, setCoursesIds] = useState();

  const dispatch = useDispatch();

  const user_Id = JSON.parse(localStorage.getItem("auth"))?.user?.userId;

  useEffect(() => {
    const fetchCourses = async () => {
      dispatch(setLoading(true));
      try {
        const result = await dispatch(fetchAllCourses());
        const results = result.payload;

        const ids = results.courses
          .filter((course) => course.trainer_id === user_Id)
          .map((course) => course.id);
        setCoursesIds(ids);
      } catch (err) {
        toast.error("Something Went Wrong, Please Try Again.", {
          autoClose: 3000,
        });
      }
      dispatch(setLoading(false));
    };
    fetchCourses();
  }, [user_Id]);
  
  const fetchModules = async (courseId) => {
    dispatch(setLoading(true));
    if (courseId)
      try {
        const response = await getModules(courseId);
        if (response && response.modules) {
          setModules(response.modules);
        } else {
          toast.error("Quiz not found.", {
            autoClose: 3000,
          });
        }
      } catch (error) {
        toast.error("Something Went Wrong, Please Try Again.", {
          autoClose: 3000,
        });
      }
    dispatch(setLoading(false));
  };

  const fetchModuleLessons = async (moduleId) => {
    dispatch(setLoading(true));
    try {
      const moduleLessons = await getSpecificModuleLessons(moduleId);
      setLessons((prevLessons) => [
        // ...prevLessons,
        ...(moduleLessons?.lessons || []),
      ]);
      if(!moduleLessons){
        toast.error("Quiz not found.", {
          autoClose: 3000,
        });
      }
    } catch (error) {
      toast.error("Something Went Wrong, Please Try Again.", {
        autoClose: 3000,
      });
    }
    dispatch(setLoading(false));
  };

  const fetchQuizzesForLessons = async (lessonId) => {
    dispatch(setLoading(true));
    try {
      const lessonDetail = await getSpecificLessonDetail(lessonId);
      setQuizzes((prevQuizzes) => [
        ...prevQuizzes,
        ...(lessonDetail?.quizzes || []),
      ]);
      if(!lessonDetail){
        toast.error("Quiz not found.", {
          autoClose: 3000,
        });
      }
    } catch (error) {
      toast.error("Something Went Wrong, Please Try Again.", {
        autoClose: 3000,
      });
    }
    dispatch(setLoading(false));
  };

  useEffect(() => {
    fetchModules(courseId);
  }, [courseId]);

  useEffect(() => {
    if (modules.length > 0) {
      modules.forEach((module) => {
        fetchModuleLessons(module.id);
      });
    }
  }, [modules]);

  useEffect(() => {
    if (lessons.length > 0) {
      lessons.forEach((lesson) => {
        fetchQuizzesForLessons(lesson.id);
        setLessonId(lesson.id)
      });
    }
  }, [lessons]);
  const [lessonId, setLessonId] = useState("");
  // const [loading, setLoading] = useState(false);
  const [selectedLessonData, setSelectedLessonData] = useState([]);

  const fetchLessonData = async () => {
    dispatch(setLoading(true));
    try {
      const lessonData = await getSpecificLessonDetail(lessonId);
      setSelectedLessonData(lessonData);
      dispatch(setLoading(false));
      if(!lessonData){
        toast.error("Quiz not found.", {
          autoClose: 3000,
        });
      }
    } catch (error) {
      toast.error("Something Went Wrong, Please Try Again.", {
        autoClose: 3000,
      });
    }
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
        const response = await Addquizzes(lessonId, { quizzes: [newQuiz] });
        fetchLessonData();
      }
    } catch (error) {
      toast.error("Something Went Wrong, Please Try Again.", {
        autoClose: 3000,
      });
    }
  };

  return (
    <>
      <ToastContainer />
      <div className="mt-24">
        <QuizzeDataTable quizzes={quizzes} onSaveQuiz={handleSaveQuiz} />
      </div>
    </>
  );
};

export default QuizList;
