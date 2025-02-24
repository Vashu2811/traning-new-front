/* eslint-disable no-unused-vars */
/* eslint-disable react/jsx-no-comment-textnodes */
import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { getSpecificModuleLessons } from "services/api";
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import TopNavTrainee from "./TopNavTrainee";
import AccessCourse from "components/AccessCourse";
import Bot from "pages/Bot";
import TraineeLessonGrid from "components/TraineeLessonGrid";
import { useLocation } from 'react-router-dom';

const TrainingModules = () => {
  const [lessons, setLessons] = useState([]);
  const { moduleId, courseId } = useParams();
  const [moduleName, setModuleName] = useState()
  const { selectedCourse, storedUserId } = AccessCourse({ courseId });
  const [moduleDetail, setModuleDetail] = useState(null)
  const [isLoading, setIsLoading] = useState(true);
  const location = useLocation();
  const lessonType = location.state || {};

  useEffect(() => {
    const fetchModuleLessons = async () => {
      try {
        const moduleLessons = await getSpecificModuleLessons(moduleId);
        setModuleName(moduleLessons?.overview?.module_name)
        setLessons(moduleLessons?.lessons);
        setModuleDetail(moduleLessons)
      } catch (error) {
        toast.error("Something Went Wrong, Please Try Again.", {
          autoClose: 3000,
        });
      } finally {
        setIsLoading(false)
      }
    };
    fetchModuleLessons();
  }, [moduleId]);

  return (
    <>
      <ToastContainer />

      <TopNavTrainee
        courseId={courseId}
        selectedCourse={selectedCourse}
        moduleName={moduleName}
        moduleId={moduleId}
        type={lessonType?.type}
      />
      <div className="flex flex-col lg:flex-row gap-5">
  <div className="bg-[#1A1C1E] rounded-lg w-full lg:w-[60%] ">
    <div className="bg-[#1A1C1E] rounded-lg ">
      <div className="flex items-center justify-between header-title">
        <h4>{lessonType?.type === 'shorts' ? 'Shorts' : 'Lessons'}</h4>
      </div>
      <TraineeLessonGrid
        lessons={lessons}
        courseId={courseId}
        moduleId={moduleId}
        isLoading={isLoading}
        lessonType={lessonType}
      />
    </div>
  </div>

  {lessonType?.type !== 'shorts' && (
    <div className=" rounded-lg w-full lg:w-[30%]">
      <Bot 
        type="module" 
        id={null} 
        prompts={moduleDetail?.module_prompt} 
        title={moduleDetail?.lessons?.length > 0 ? moduleDetail?.lessons.map(i => i.title) : []} 
      />
    </div>
  )}
</div>
    </>
  );
};

export default TrainingModules;
