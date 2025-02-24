import { useReduxState } from "hooks/useReduxActions";
import React from "react";

const AccessCourse = ({ courseId }) => {
  const coursesSelector = useReduxState((state) => state.course.courses);

  const selectedCourse = React.useMemo(() => {
    return coursesSelector.find((course) => course.id === parseInt(courseId));
  }, [coursesSelector, courseId]);

  const storedUserId = React.useMemo(() => {
    return JSON.parse(localStorage.getItem("auth"))?.user.userId;
  }, []);

  return { selectedCourse, storedUserId };
};

export default AccessCourse;
