// import { useEffect, useState } from "react";
// import LessonDataTable from "../components/LessonDataTable"; // Update the path as per your file structure
// import { useDispatch } from "react-redux";
// import { fetchAllCourses } from "store/actions/course";
// import {
//   Addquizzes,
//   deletelesson,
//   getModules,
//   getSpecificLessonDetail,
//   getSpecificModuleLessons,
//   updateLesson,
//   Updatequizzes,
// } from "services/api";
// import { setLoading } from "store/reducers/loadingReducer";
// import { ToastContainer, toast } from "react-toastify";
// import "react-toastify/dist/ReactToastify.css";

// const LessonList = () => {
//   const [modules, setModules] = useState([]);
//   const [lessons, setLessons] = useState([]);
//   const [courseIds, setCourseIds] = useState([]);
//   const dispatch = useDispatch();
//   const user_Id = JSON.parse(localStorage.getItem("auth"))?.user?.userId;

//   useEffect(() => {
//     const fetchCourses = async () => {
//       dispatch(setLoading(true));
//       try {
//         const result = await dispatch(fetchAllCourses());
//         const results = result.payload;
//         const ids = results.courses
//           .filter((course) => course.trainer_id === user_Id)
//           .map((course) => course.id);
//         setCourseIds(ids);
//       } catch (err) {
//         toast.error("Something Went Wrong, Please Try Again.", {
//           autoClose: 3000,
//         });
//       }
//       dispatch(setLoading(false));
//     };
//     fetchCourses();
//   }, [user_Id]);

//   const fetchModules = async (courseIds) => {
//     dispatch(setLoading(true));
//     try {
//       const allModules = [];
//       for (const courseId of courseIds) {
//         const response = await getModules(courseId);
//         if (response && response.modules) {
//           allModules.push(...response.modules);
//         } else {
//           toast.error("Modules not found for course ID: " + courseId, {
//             autoClose: 3000,
//           });
//         }
//       }
//       setModules(allModules);
//       setLessons([]); // Clear existing lessons
//     } catch (error) {
//       toast.error("Something Went Wrong, Please Try Again.", {
//         autoClose: 3000,
//       });
//     }
//     dispatch(setLoading(false));
//   };

//   const fetchModuleLessons = async (moduleId) => {
//     dispatch(setLoading(true));
//     try {
//       const moduleLessons = await getSpecificModuleLessons(moduleId);
//       setLessons((prevLessons) => [
//         ...prevLessons,
//         ...(moduleLessons?.lessons || []),
//       ]);
//       if (!moduleLessons) {
//         toast.error("Lessons not found for module ID: " + moduleId, {
//           autoClose: 3000,
//         });
//       }
//     } catch (error) {
//       toast.error("Something Went Wrong, Please Try Again.", {
//         autoClose: 3000,
//       });
//     }
//     dispatch(setLoading(false));
//   };

//   const handleSaveEdit = async (editLessonId, lessonData) => {
//     try {
//       await updateLesson(editLessonId, lessonData);
//       // Refresh the lessons list after saving
//       await fetchModules(courseIds);
//       toast.success("Lesson updated successfully");
//     } catch (error) {
//       console.error('Failed to save the edited lesson:', error);
//       toast.error("Failed to save the edited lesson");
//     }
//   };

//   const handleConfirmDelete = async (editLessonId) => {
//     try {
//       await deletelesson(editLessonId);
//       // Refresh the lessons list after deletion
//       await fetchModules(courseIds);
//       toast.success("Lesson deleted successfully");
//     } catch (error) {
//       toast.error("Failed to delete the lesson");
//     }
//   };

//   useEffect(() => {
//     if (courseIds.length > 0) {
//       fetchModules(courseIds);
//     }
//   }, [courseIds]);

//   useEffect(() => {
//     if (modules.length > 0) {
//       modules.forEach((module) => {
//         fetchModuleLessons(module.id);
//       });
//     }
//   }, [modules]);

//   return (
//     <>
//       <ToastContainer />
//       <div className="mt-24">
//         <LessonDataTable
//           lessons={lessons}
//           onSaveEdit={handleSaveEdit}
//           onDelete={handleConfirmDelete}
//         />
//       </div>
//     </>
//   );
// };

// export default LessonList;










import { useEffect, useState } from "react";
import LessonDataTable from "../components/LessonDataTable"; // Update the path as per your file structure
import { useDispatch } from "react-redux";
import { fetchAllCourses } from "store/actions/course";
import {
  Addquizzes,
  deletelesson,
  getModules,
  getSpecificModuleLessons,
  updateLesson,
  Updatequizzes,
} from "services/api";
import { setLoading } from "store/reducers/loadingReducer";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const LessonList = () => {
  const [courses, setCourses] = useState([]);
  const [selectedCourseId, setSelectedCourseId] = useState("");
  const [modules, setModules] = useState([]);
  const [lessons, setLessons] = useState([]);
  const dispatch = useDispatch();
  const user_Id = JSON.parse(localStorage.getItem("auth"))?.user?.userId;

  useEffect(() => {
    const fetchCourses = async () => {
      dispatch(setLoading(true));
      try {
        const result = await dispatch(fetchAllCourses());
        const results = result.payload;
        const userCourses = results.courses.filter(course => course.trainer_id === user_Id);
        setCourses(userCourses);
        if (userCourses.length > 0) {
          setSelectedCourseId(userCourses[0].id); // Set the first course as selected by default
        }
      } catch (err) {
        toast.error("Something Went Wrong, Please Try Again.", { autoClose: 3000 });
      }
      dispatch(setLoading(false));
    };
    fetchCourses();
  }, [user_Id]);

  useEffect(() => {
    if (selectedCourseId) {
      fetchModules(selectedCourseId);
    }
  }, [selectedCourseId]);

  useEffect(() => {
    if (modules.length > 0) {
      modules.forEach((module) => {
        fetchModuleLessons(module.id);
      });
    }
  }, [modules]);

  const fetchModules = async (courseId) => {
    dispatch(setLoading(true));
    try {
      const response = await getModules(courseId);
      if (response && response.modules) {
        setModules(response.modules);
        setLessons([]); // Clear existing lessons
      } else {
        toast.error("Modules not found for this course ", { autoClose: 3000 });
      }
    } catch (error) {
      toast.error("Something Went Wrong, Please Try Again.", { autoClose: 3000 });
    }
    dispatch(setLoading(false));
  };

  const fetchModuleLessons = async (moduleId) => {
    dispatch(setLoading(true));
    try {
      const moduleLessons = await getSpecificModuleLessons(moduleId);
      setLessons(prevLessons => [...prevLessons, ...(moduleLessons?.lessons || [])]);
      if (!moduleLessons) {
        toast.error("Lessons not found for this module. ", { autoClose: 3000 });
      }
    } catch (error) {
      toast.error("Something Went Wrong, Please Try Again.", { autoClose: 3000 });
    }
    dispatch(setLoading(false));
  };

  const handleSaveEdit = async (editLessonId, lessonData) => {
    try {
      await updateLesson(editLessonId, lessonData);
      // Refresh the lessons list after saving
      if (selectedCourseId) {
        fetchModules(selectedCourseId);
      }
      toast.success("Lesson updated successfully");
    } catch (error) {
      console.error('Failed to save the edited lesson:', error);
      toast.error("Failed to save the edited lesson");
    }
  };

  const handleConfirmDelete = async (editLessonId) => {
    try {
      await deletelesson(editLessonId);
      // Refresh the lessons list after deletion
      if (selectedCourseId) {
        fetchModules(selectedCourseId);
      }
      toast.success("Lesson deleted successfully");
    } catch (error) {
      toast.error("Failed to delete the lesson");
    }
  };

  const handleCourseChange = (e) => {
    setSelectedCourseId(e.target.value);
  };

  return (
    <>
      <ToastContainer />
      <div className="mt-24">
        
        <LessonDataTable
        courses={courses}
        selectedCourseId={selectedCourseId}
        handleCourseChange={handleCourseChange}
          lessons={lessons}
          onSaveEdit={handleSaveEdit}
          onDelete={handleConfirmDelete}
        />
      </div>
    </>
  );
};

export default LessonList;
