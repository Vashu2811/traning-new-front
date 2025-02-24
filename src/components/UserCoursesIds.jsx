import { useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import { toast } from "react-toastify";
import { fetchAllCourses } from "store/actions/course";

const UserCoursesIds = () => {
  const [userCoursesIds, setUserCoursesIds] = useState();
  const user_Id = JSON.parse(localStorage.getItem("auth"))?.user.userId;

  const dispatch = useDispatch();

  useEffect(() => {
    const fetchCourses = async () => {
      try {
        const result = await dispatch(fetchAllCourses());
        const results = result.payload;

        const ids = results.courses
          .filter((course) => course.trainer_id === user_Id)
          .map((course) => course.id);
        setUserCoursesIds(ids);
      } catch (err) {
        toast.error("Something Went Wrong, Please Try Again.", {
          autoClose: 3000,
        });
      }
    };

    fetchCourses();
  }, [dispatch, user_Id]);

  return userCoursesIds;
};

export default UserCoursesIds;
