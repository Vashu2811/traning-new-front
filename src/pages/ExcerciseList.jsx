// ExerciseList.js
import { useState } from "react";
import ExerciseDataTable from "../components/ExerciseDataTable"; // Update the path as per your file structure
import {
  Addquizzes,
  getModules,
  getSpecificLessonDetail,
  getSpecificModuleLessons,
  Updatequizzes,
} from "services/api";
import { useEffect } from "react";
import { useDispatch } from "react-redux";
import { fetchAllCourses } from "store/actions/course";
import { ToastContainer, toast } from "react-toastify";
import { setLoading } from "store/reducers/loadingReducer";
import "react-toastify/dist/ReactToastify.css";

const ExerciseList = () => {
  const [modules, setModules] = useState([]);
  const [lessons, setLessons] = useState([]);
  const [exercises, setExercises] = useState([]);
  const [exercisesData, setExercisesData] = useState([]);

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
          ?.filter((course) => course.trainer_id === user_Id)
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
          toast.error("Exercies not found.", {
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
        toast.error("Exercies not found.", {
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
      setExercises((prevQuizzes) => [
        ...prevQuizzes,
        ...(lessonDetail?.exercises || []),
      ]);
      if(!lessonDetail){
        toast.error("Exercies not found.", {
          autoClose: 3000,
        });
      }
    } catch (error) {
      toast.error("Something Went Wrong, Please Try Again.", {
        autoClose: 3000,
      });
      setExercises("");
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
        setLessonId(lesson.id);
      });
    }
  }, [lessons]);

  const [lessonId, setLessonId] = useState("");
  const [selectedLesson, setSelectedLesson] = useState({
    overview: {},
    resources: [],
    quizzes: [],
    exercises: [],
  });


  const fetchLessonData = async () => {
    dispatch(setLoading(true));
    try {
      const lessonData = await getSpecificLessonDetail(lessonId);
      setExercisesData(lessonData);
      dispatch(setLoading(false));
      if(!lessonData){
        toast.error("Exercies not found.", {
          autoClose: 3000,
        });
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
    }
  };

  return (
    <>
      <ToastContainer />
      <div className="mt-24">
        <ExerciseDataTable
          exercises={exercises}
          onSaveExercise={handleSaveExercise}
        />
      </div>
    </>
  );
};

export default ExerciseList;
