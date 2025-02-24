/* eslint-disable no-unused-vars */
import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";

import AddCircleOutlineIcon from "@mui/icons-material/AddCircleOutline";
import { Box, Button, Modal, TextField, Typography } from "@mui/material";
import { AddNewmodule, getCourses, getModules } from "services/api";
import { TailSpin } from "react-loader-spinner";
import { useReduxActions, useReduxState } from "hooks/useReduxActions";
import { fetchAllCourses } from "store/actions/course";
import { useDispatch } from "react-redux";
import { setLoading } from "../../store/reducers/loadingReducer";
import "../../styles/Header-title.style.scss";
const Courses = () => {
  // const { courseId } = useParams();
  const [showAddModal, setShowAddModal] = useState(false);
  const [courses, setCourses] = useState([]);
  const [newModule, setNewModule] = useState({
    name: "",
    description: "",
    youtubeLink: "",
  });

  // const dispatch = useReduxActions();
  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(setLoading(true));

    dispatch(fetchAllCourses());
  }, [dispatch]);

  const coursesSelector = useReduxState((state) => state.course);
  useEffect(() => {
    if (!coursesSelector.error && coursesSelector.courses.length > 0) {
      setCourses(coursesSelector.courses);
      dispatch(setLoading(false));
    }
  }, [coursesSelector, courses]);

  const totalModules = courses?.length;
  if (coursesSelector.loading) {
    // dispatch(setLoading(true));
    // return (
    //   <div className="flex justify-center">
    //     <TailSpin
    //       color="#FFFFFF"
    //       height={100}
    //       width={100}
    //       style={{
    //         margin: "10px 10px",
    //       }}
    //     />
    //   </div>
    // );
  }

  return (
    <>
      <nav
        class="flex mx-12 my-4 lg:mt-20 md:mt-20 max-sm:mt-20 sm:mt-20"
        aria-label="Breadcrumb"
      >
        <ol class="md:inline-flex sm:flex sm:flex-col  items-center space-x-1 md:space-x-2 rtl:space-x-reverse">
          <li class="inline-flex items-center">
            <Link
              to="/admin/courses"
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
                to={`/admin/courses`}
                className="inline-flex items-center text-base font-medium text-[#BDBEBE]"
              >
                Courses
              </Link>
            </div>
          </li>
        </ol>
      </nav>
      <div className="m-5 bg-[#1A1C1E] rounded-lg">
        <div className="header-title">
          <h4>All Courses</h4>
        </div>

        <div className="grid gap-6 p-8 overflow-x-auto 2xl:grid-cols-5 xl:grid-cols-4 lg:grid-cols-3 md:grid-cols-2">
          {courses?.length > 0 ? (
            courses?.map((course) => (
              <div
                key={course.id}
                className="bg-[#242728] border border-[#303234] rounded-md p-4 gap-3"
              >
                <Link
                  to={`/admin/courses/${course.id}`}
                  style={{ textDecoration: "none" }}
                >
                  <h2 className="flex align-middle justify-start my-2.5 text-lg font-normal ">
                    {course.course_name}
                  </h2>
                  <p className="">
                    <span className="text-[#5B52E7]">Trainer Name:</span>
                    <span className="opacity-70"> {course.trainer_name}</span>
                  </p>
                </Link>
              </div>
            ))
          ) : (
            <div>No courses available</div>
          )}
        </div>
      </div>
    </>
  );
};

export default Courses;
