import React, { useEffect, useState } from "react";
import CourseDataTable from "./CourseDataTable";
import { AddCourses, UpdateCourses, getCourses } from "services/api";
import {setLoading} from "../../store/reducers/loadingReducer";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { useDispatch, useSelector } from "react-redux";

const ManageCourses = () => {
  const [courses, setCourses] = useState([]);
  const dispatch = useDispatch();
  const fetchCourses = async () => {
    dispatch(setLoading(true));
    try {
      const response = await getCourses();
      if (response) {
        setCourses(response.data.courses);
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
    dispatch(setLoading(false));
  };

  useEffect(() => {
    fetchCourses();
  }, []);
  const handleSaveCourse = async (updatedCourse, editCourseId, newCourse) => {
    try {
      // Ensure the courses are in the correct format
      const formattedUpdatedCourse = editCourseId
        ? { courses: [updatedCourse] }
        : updatedCourse;
      const formattedNewCourse = !editCourseId
        ? { courses: [newCourse] }
        : newCourse;

      if (editCourseId) {
        // If editCourseId is present, update the existing course
        const response = await UpdateCourses(formattedUpdatedCourse);
        fetchCourses(); // Assuming fetchCourses fetches the updated course data
      } else {
        // If editCourseId is null, add a new course
        const response = await AddCourses(formattedNewCourse);
        fetchCourses(); // Assuming fetchCourses fetches the updated course data
      }
    } catch (error) {
      toast.error("Something Went Wrong, Please Try Again.", {
        autoClose: 3000,
      });

      // Handle error appropriately
    }
  };
  const handleSaveAssignment = async (assignmentData) => {
    try {
      // Make the API call to save the assignment
      const response = await UpdateCourses({ courses: [assignmentData] });

      // Fetch updated course data after saving the assignment
      fetchCourses();
    } catch (error) {
      toast.error("Something Went Wrong, Please Try Again.", {
        autoClose: 3000,
      });
    }
  };

  return (
    <>
      <ToastContainer />
      <nav
        class="flex mx-12 my-4 lg:mt-20 md:mt-20 max-sm:mt-20 sm:mt-20"
        aria-label="Breadcrumb"
      >
        {/* Mange Courses */}
      </nav>

      <CourseDataTable
        courses={courses}
        onSaveCourse={handleSaveCourse}
        onSaveAssignment={handleSaveAssignment}
      />
    </>
  );
};

export default ManageCourses;
