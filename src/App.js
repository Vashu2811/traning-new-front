/* eslint-disable react-hooks/exhaustive-deps */
import { useEffect, useState } from "react";
import { Route, Routes, useLocation } from "react-router-dom";

import "./App.css";
// import { Footer, Sidebar, ThemeSettings } from "./components";

import { ThemeSettings } from "components";
import { AuthProvider as AppProvider } from "contexts/authProvider";
import { AuthProvider,  RedirectToLogin } from "@propelauth/react";
import ConsultantLayout from "layouts/consultant/layout";
import Auth from "pages/Auth";
import Interviewprep from "pages/user/Interviewprep";
import Lessons from "pages/user/Cources";
import Training from "pages/user/Training";
import UserLessonDetail from "pages/user/UserLessonDetail";
import { useStateContext } from "./contexts/ContextProvider";
import PageLayout from "./layouts/page/layout";
import Consultant from "./pages/Consultant";
import ExcerciseList from "./pages/ExcerciseList";
import InterviewDetail from "./pages/InterviewDetail";
import InterviewPrep from "./pages/InterviewPrep";
import Lesson from "./pages/Lesson";
import LessonDetail from "./pages/LessonDetail";
import LessonList from "./pages/LessonList";
import Module from "./pages/Module";
import NewLesson from "./pages/NewLesson";
import PreviewInterview from "./pages/PreviewInterview";
import QuizzeList from "./pages/QuizzeList";
import Resources from "./pages/Resources";
import Excercise from "./pages/user/Excercise";
import Quizze from "./pages/user/Quizze";
import Resource from "./pages/user/Resource";
import Courses from "./pages/courses/Courses";
import Modules from "pages/modules/Modules";
import Adminvbee from "layouts/adminvbee/layout";
import ManageCourses from "pages/AdminVbee/ManageCourses";
import ManageMentors from "pages/AdminVbee/Mentor";
import Cources from "pages/user/Cources";
import TrainingModules from "pages/user/TrainingModules";
import { useDispatch } from "react-redux";
import Unauthorized from "pages/Unauthorized";
import Loading from "../src/components/Loading";
import Copilot from "pages/user/Copilot";
import HandsOnSupport from "pages/user/HandsOnSupport";
import Mentorvbee from "layouts/mentorvbee/layout";
import Home from "pages/MentorVbee/Home";
import Profile from "pages/MentorVbee/Profile";
import Files from "pages/MentorVbee/Files";
import Videos from "pages/MentorVbee/Videos";
import MentorList from "pages/user/MentorList";
import ChatScreen from "pages/user/chat/ChatScreen";
import Shorts from "pages/Shorts";

const App = () => {
  const { setCurrentColor, setCurrentMode, currentMode, themeSettings } =
    useStateContext();

  const [courseId, setCoursesIds] = useState();
  const dispatch = useDispatch();

  const location = useLocation();
  useEffect(() => {
    const currentThemeColor = localStorage.getItem("colorMode");
    const currentThemeMode = localStorage.getItem("themeMode");
    if (currentThemeColor && currentThemeMode) {
      setCurrentColor(currentThemeColor);
      setCurrentMode(currentThemeMode);
    }
  }, []);

  function removeScriptBySrc(src) {
    const scripts = document.querySelectorAll('script[src="' + src + '"]');
    scripts.forEach((script) => script.parentNode.removeChild(script));
  }
  function removeElementById(id) {
    const element = document.getElementById(id);
    if (element) {
      element.parentNode.style.display = "none";
    }
  }
  const dynamicRouteRegex = /^\/admin\/module\/\d+\/lesson\/\d+$/i;

  document.addEventListener("DOMContentLoaded", function () {
    if (!dynamicRouteRegex.test(window.location.pathname)) {
      setTimeout(function () {
        removeScriptBySrc("https://cdn.botpress.cloud/webchat/v1/inject.js");
        removeElementById("bp-web-widget-container");
      }, 1000);
    }
  });


  return (
    <div className={currentMode === "Dark" ? "dark" : ""}>
      <div className="relative block dark:bg-main-dark-bg">
        <div className="fixed right-4 bottom-4" style={{ zIndex: "1000" }}>
        
        </div>
        <div className="flex justify-center">
          {themeSettings && <ThemeSettings />}

          {/* <AuthProvider> */}
          <AppProvider>
            <AuthProvider authUrl={process.env.REACT_APP_AUTH_URL} displayIfLoggedOut={
              <RedirectToLogin postLoginRedirectUrl="https://training.hcomb.ai/" />
              // <RedirectToLogin postLoginRedirectUrl="http://localhost:3000/" />
            }>
              <Loading />
              <Routes>
                <Route path="/" element={<ConsultantLayout />}>
                <Route index element={<Consultant />} />
                  <Route element={<Auth allowedRoles={["traineebee"]} />}>
                    <Route path="/training" element={<Training />} />
                    <Route
                      path="/training/courses/:courseId"
                      element={<Cources />}
                    />
                    <Route
                      path="/training/courses/:courseId/module/:moduleId"
                      element={<TrainingModules />}
                    />
                    <Route
                      path="/training/courses/:courseId/module/:moduleId/lesson/:lessonId"
                      element={<UserLessonDetail />}
                    />
                    <Route
                      path="/training/interviewprep"
                      element={<Interviewprep />}
                    />
                    <Route
                      path="/training/pollinator"
                      element={<Copilot />}
                    />
                    <Route
                      path="/training/mentor"
                      element={<MentorList />}
                    />
                    <Route
                      path="/training/chat"
                      element={<ChatScreen />}
                    />
                    <Route
                      path="/training/hands-on-support"
                      element={<HandsOnSupport />}
                    />

                    <Route
                      path="/training/module/:moduleId"
                      element={<Lessons />}
                    />
                    <Route
                      path="/training/module/:moduleId/lesson/:lessonId"
                      element={<UserLessonDetail />}
                    />
                    <Route
                      path="/training/module/:moduleId/lesson/:lessonId/excercises"
                      element={<Excercise />}
                    />
                    <Route
                      path="/training/module/:moduleId/lesson/:lessonId/quizzes"
                      element={<Quizze />}
                    />
                    <Route
                      path="/training/module/:moduleId/lesson/:lessonId/resources"
                      element={<Resource />}
                    />
                  </Route>
                </Route>

                {/* Admin Routes */}
                <Route element={<Auth allowedRoles={["trainerbeee", "trainer-bee"]} />}>
                  <Route path="/admin" element={<PageLayout />}>
                    <Route path="/admin/courses" element={<Courses />} />
                    <Route
                      path="/admin/courses/:courseId"
                      element={<Module />}
                    />
                    <Route
                      path="/admin/courses/:courseId/module/:moduleId"
                      element={<Lesson />}
                    />
                    <Route
                      path="/admin/courses/:courseId/shorts/:moduleId"
                      element={<Shorts />}
                    />
                    <Route
                      path="/admin/courses/:courseId/module/:moduleId/lesson/:lessonId"
                      element={<LessonDetail />}
                    />
                    <Route path="/admin/modules" element={<Modules />} />
                    <Route
                      path="/admin/courses/:courseId/module/:moduleId/new-lesson"
                      element={<NewLesson />}
                    />
                    <Route path="/admin/Lessons" element={<LessonList />} />
                    <Route path="/admin/Quizzes" element={<QuizzeList />} />
                    <Route
                      path="/admin/Exercises"
                      element={<ExcerciseList />}
                    />
                    <Route path="/admin/Resources" element={<Resources />} />
                    <Route
                      path="/admin/Interview-Prep"
                      element={<InterviewPrep />}
                    />
                    <Route
                      path="/admin/interview/:interviewid"
                      element={<InterviewDetail />}
                    />
                    <Route
                      path="/admin/interview/:interviewid/preview"
                      element={<PreviewInterview />}
                    />
                  </Route>
                </Route>

                {/* UnAuthorized Page */}
                <Route path="/unauthorized" element={<Unauthorized />} />

                {/* Not Found Page */}
                <Route path="*" element={<>Not Found Page</>} />

                <Route element={<Auth allowedRoles={["adminvbee"]} />}>
                  <Route path="/adminvbee" element={<Adminvbee />}>
                    <Route
                      path="/adminvbee/ManageCourses"
                      element={<ManageCourses />}
                    ></Route>
                    <Route
                      path="/adminvbee/ManageMentors"
                      element={<ManageMentors />}
                    ></Route>
                  </Route>
                </Route>
                <Route element={<Auth allowedRoles={["mentor"]} />}>
                  <Route path="/mentor" element={<Mentorvbee />}>
                    <Route
                      path="/mentor/instruction"
                      element={<Home />}
                    ></Route>
                    <Route
                      path="/mentor/profile"
                      element={<Profile />}
                    ></Route>
                    <Route
                      path="/mentor/files"
                      element={<Files />}
                    ></Route>
                    <Route
                      path="/mentor/videos"
                      element={<Videos />}
                    ></Route>
                  </Route>
                </Route>
              </Routes>
            </AuthProvider>
          </AppProvider>
        </div>
      </div>
    </div>
  );
};

export default App;
