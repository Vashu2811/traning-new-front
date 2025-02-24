
import axios from "axios";
import { useState } from "react";

import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const ExercisesContainer = ({ exercises }) => {
  const filteredExercises = exercises?.filter(
    (exercise) => !exercise.is_deleted
  );

  const [currentExercise, setCurrentExercise] = useState(0);
  const [completedExercises, setCompletedExercises] = useState([]);

 

  const handleExerciseCompletion = () => {
    const updatedCompletedExercises = [...completedExercises, currentExercise];
    setCompletedExercises(updatedCompletedExercises);

    if (currentExercise < filteredExercises.length - 1) {
      setCurrentExercise(currentExercise + 1);
    }
  };

  const handlePrevExercise = () => {
    if (currentExercise > 0) {
      setCurrentExercise(currentExercise - 1);
    }
  };

  const handleNextExercise = () => {
    if (currentExercise < filteredExercises.length - 1) {
      setCurrentExercise(currentExercise + 1);
    }
  };

  const isExerciseCompleted = completedExercises.includes(currentExercise);

  const fetchFileUrl = async (fileName, folderName) => {
    try {
      const response = await axios.get(
        `https://coreutilities.hcomb.ai/v1/aws/getFile?fileName=${fileName}&folderName=${folderName}`
      );
      return response.data.data;
    } catch (error) {
      toast.error("Something Went Wrong, Please Try Again.", {
        autoClose: 3000,
      });
      return null;
    }
  };

  const openFile = async (fileName, folderName) => {
    const url = await fetchFileUrl(fileName, folderName);
    if (url) {
      window.open(url, "_blank");
    }
  };

  const getFileName = (url) => {
    const urlObj = new URL(url);
    const pathname = urlObj.pathname;
    return pathname.substring(pathname.lastIndexOf("/") + 1);
  };

  return (
    <>
      <ToastContainer />

      {filteredExercises ? (
        <>
          <div className="m-5 bg-[#1A1C1E] rounded-lg border border-[#37383A]">
            <div className="flex items-center justify-between header-title">
              <h4>Exercise</h4>
              <h6 className="text-xl text-[#BDBEBE] font-[OpenSans]">
                <span className="text-2xl font-bold">
                  {currentExercise + 1}
                </span>{" "}
                / {filteredExercises?.length}
              </h6>
            </div>

            <div className="flex flex-col gap-5 p-8">
              <div className="">
                <p className="text-base font-bold mb-3 text-[#BDBEBE]">Name:</p>
                <p className="border border-[#37383A] py-2 px-5 rounded-lg text-[#BDBEBE]">
                  {filteredExercises[currentExercise]?.exercise_name}
                </p>
              </div>
              <div className="">
                <p className="text-base font-bold mb-3 text-[#BDBEBE]">
                  Scenario:
                </p>
                <p className="border border-[#37383A] py-2 px-5 rounded-lg text-[#BDBEBE]">
                  {filteredExercises[currentExercise]?.scenario}
                </p>
              </div>
              <div className="flex items-center gap-3">
                {filteredExercises[currentExercise]?.file ? (
                  <>
                    <p className="text-[#BDBEBE]">Exercise Material</p>
                    <button
                      onClick={(e) => {
                        e.preventDefault();
                        openFile(
                          getFileName(filteredExercises[currentExercise]?.file),
                          "exercises"
                        );
                      }}
                      className="border border-[#37383A] py-2 px-5 rounded-lg text-[#BDBEBE] cursor-pointer"
                    >
                      Open PDF
                    </button>
                  </>
                ) : (
                  "Exercise Material Not Available"
                )}
              </div>
              <div className="flex gap-4 mt-5">
                {filteredExercises.length > 1 && currentExercise > 0 && (
                  <button
                    className="bg-[#282B2F] hover:bg-[#BDBEBE] hover:text-[#282B2F] hover:border-[#282B2F] border border-[#37383A] text-[#BDBEBE] text-sm  font-bold px-6 py-3 rounded-[4px]"
                    onClick={handlePrevExercise}
                  >
                    Previous
                  </button>
                )}
                {filteredExercises.length > 1 &&
                  currentExercise < filteredExercises.length - 1 && (
                    <button
                      className="bg-[#282B2F] hover:bg-[#BDBEBE] hover:text-[#282B2F] hover:border-[#282B2F] border border-[#37383A] text-[#BDBEBE] text-sm  font-bold px-6 py-3 rounded-[4px]"
                      onClick={handleNextExercise}
                    >
                      Next
                    </button>
                  )}
                {!isExerciseCompleted && (
                  <button
                    className="bg-[#282B2F] hover:bg-[#5b52e7] hover:text-[#fff] text-[#BDBEBE] text-sm font-bold px-6 py-3 rounded-[4px] border border-[#282B2F]"
                    onClick={handleExerciseCompletion}
                  >
                    Mark as Complete
                  </button>
                )}
              </div>
              <div className="flex items-center w-full">
                {isExerciseCompleted && (
                  <p className="text-green-600">
                    Successfully completed exercise
                  </p>
                )}
              </div>
            </div>
          </div>
        </>
      ) : (
        <div className="m-5 p-5 text-white bg-[#1A1C1E] rounded-lg border border-[#37383A]">
          Exercises Not Found
        </div>
      )}
    </>
  );
};

export default ExercisesContainer;
