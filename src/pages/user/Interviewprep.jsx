/* global webkitSpeechRecognition */
import { CircularProgress } from "@mui/material";
import axios from "axios";
import { useEffect, useRef, useState } from "react";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { getCourses, getInterviewQuestion, getQuestionFeedBack, getUserId, saveInterviewPrep } from "services/api";

const Interviewprep = () => {
  const [courses, setCourses] = useState([]);
  const [selectedCourseId, setSelectedCourseId] = useState("");
  const [interviewQuestionsForCourse, setInterviewQuestionsForCourse] =
    useState([]);
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [recording, setRecording] = useState(false);
  const [transcript, setTranscript] = useState("");
  const [lastProcessedIndex, setLastProcessedIndex] = useState(0);
  const [interviewStarted, setInterviewStarted] = useState(false);
  const [screenBlob, setScreenBlob] = useState(null);
  const videoRef = useRef(null);
  const screenMediaRecorderRef = useRef(null);
  const screenChunksRef = useRef([]);
  const screenStreamRef = useRef(null);
  const cameraStreamRef = useRef(null);
  const [qaData, setQaData] = useState([])
  const [feedBackResponse, setFeedBackResponse] = useState([])
  const [isLoading, setIsLoading] = useState(false)

  const recognitionRef = useRef(null); // Reference to SpeechRecognition instance

  const fetchCourses = async () => {
    try {
      const response = await getCourses();
      if (response) {
        setCourses(response?.data.courses);
        setSelectedCourseId(response?.data.courses[0]?.id || ""); // Set initial course
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
  };

  const fetchInterviewQuestions = async (courseId) => {
    try {
      const response = await getInterviewQuestion();
      if (response) {
        const filteredQuestions = response?.interview_questions.filter(
          (question) => question.training_course_id === parseInt(courseId)
        );
        setInterviewQuestionsForCourse(filteredQuestions);
      } else {
        toast.error("Failed to fetch interview questions.", {
          autoClose: 3000,
        });
      }
    } catch (error) {
      toast.error("Something Went Wrong, Please Try Again.", {
        autoClose: 3000,
      });
    }
  };

  useEffect(() => {
    fetchCourses();
  }, []);

  useEffect(() => {
    if (selectedCourseId) {
      fetchInterviewQuestions(selectedCourseId);
      setCurrentQuestion(0);
    }
  }, [selectedCourseId]);

  useEffect(() => {
    if ("webkitSpeechRecognition" in window) {
      recognitionRef.current = new webkitSpeechRecognition();
      recognitionRef.current.lang = "en-US";
      recognitionRef.current.interimResults = true;
      recognitionRef.current.continuous = true;

      recognitionRef.current.onresult = (event) => {
        let finalTranscript = "";
      
        for (let i = event.resultIndex; i < event.results.length; i++) {
          const transcriptPart = event.results[i][0].transcript;
      
          if (event.results[i].isFinal) {
            finalTranscript += transcriptPart;
          }
        }
      
        setTranscript((prevTranscript) => prevTranscript + finalTranscript);
      };
      

      recognitionRef.current.onerror = (event) => {
        toast.error("Speech recognition error: " + event.error, {
          autoClose: 3000,
        });
      };
    } else {
      toast.error("Speech recognition not supported in this browser.", {
        autoClose: 3000,
      });
    }
  }, [transcript]);

  const startCameraRecording = async () => {
    try {
      // const screenStream = await navigator.mediaDevices.getDisplayMedia({
      //   video: { cursor: "always" },
      // });
      const cameraStream = await navigator.mediaDevices.getUserMedia({
        video: true,
        audio: true,
      });

      videoRef.current.srcObject = cameraStream;
      videoRef.current.play();

      const combinedStream = new MediaStream();
      // screenStream
      //   .getTracks()
      //   .forEach((track) => combinedStream.addTrack(track));
      cameraStream
        .getTracks()
        .forEach((track) => combinedStream.addTrack(track));

      // screenStreamRef.current = screenStream;
      cameraStreamRef.current = cameraStream;

      // screenMediaRecorderRef.current = new MediaRecorder(combinedStream);
      // screenMediaRecorderRef.current.ondataavailable =
      //   handleScreenDataAvailable;
      // screenMediaRecorderRef.current.onstop = () => {
      //   console.log("Recording stopped");
      // };

      // screenMediaRecorderRef.current.start();

      // setRecording(true);
      // recognitionRef.current.start(); 
    } catch (error) {
      toast.error("Something Went Wrong, Please Try Again.", {
        autoClose: 3000,
      });
      window.location.reload()
    }
  };

  const startScreenRecording = async () => {
    try {
      toast.info(
        "Please select the specific window or tab you want to record.",
        { autoClose: 5000 }
      );

      const screenStream = await navigator.mediaDevices.getDisplayMedia({
        video: { cursor: "always" },
      });
      // const cameraStream = await navigator.mediaDevices.getUserMedia({
      //   video: true,
      //   audio: true,
      // });

      // videoRef.current.srcObject = cameraStream;
      videoRef.current.play();

      const combinedStream = new MediaStream();
      screenStream
        .getTracks()
        .forEach((track) => combinedStream.addTrack(track));
      // cameraStream
      //   .getTracks()
      //   .forEach((track) => combinedStream.addTrack(track));

      screenStreamRef.current = screenStream;
      // cameraStreamRef.current = cameraStream;

      screenMediaRecorderRef.current = new MediaRecorder(combinedStream);
      screenMediaRecorderRef.current.ondataavailable =
        handleScreenDataAvailable;
      screenMediaRecorderRef.current.onstop = () => {
      };

      screenMediaRecorderRef.current.start();

      setRecording(true);
      recognitionRef.current.start(); 
    } catch (error) {
      toast.error("Something Went Wrong, Please Try Again.", {
        autoClose: 3000,
      });
      window.location.reload()
    }
  };

  const stopRecording = () => {
    return new Promise((resolve) => {
      if (screenMediaRecorderRef.current) {
        screenMediaRecorderRef.current.onstop = () => {
          resolve();
        };
        screenMediaRecorderRef.current.stop();
        setRecording(false);
      } else {
        resolve();
      }

      if (recognitionRef.current) {
        recognitionRef.current.stop(); 
      }
    });
  };

  const stopStreams = () => {
    if (screenStreamRef.current) {
      screenStreamRef.current.getTracks().forEach((track) => track.stop());
    }
  };

  const stopCamera = () =>{
    if (cameraStreamRef.current) {
      cameraStreamRef.current.getTracks().forEach((track) => track.stop());
    }
  }

  const stopInterView = () =>{
    setTranscript("")
    setQaData([]);
    setFeedBackResponse([]);
    setInterviewStarted(false);
    setRecording(false);
    stopRecording()
    stopStreams();
    stopCamera();
  }

  const handleScreenDataAvailable = (event) => {
    if (event.data.size > 0) {
      screenChunksRef.current.push(event.data);
    }
  };

  const handleQuestion = (isPreview) => {
    setQaData((preState) => [{'question':interviewQuestionsForCourse[currentQuestion]?.question, answer: transcript}])
    setTranscript("")
    // if (currentQuestion < interviewQuestionsForCourse?.length - 1) {
      setCurrentQuestion(isPreview ? currentQuestion - 1 : currentQuestion + 1);
      // if (!recording) {
      //   startRecording(); 
      // }
    // }
  };

  const handleCourseChange = (e) => {
    setSelectedCourseId(e.target.value);
  };

  const handleStartInterview = () => {
    setTranscript("")
    setQaData([])
    setInterviewStarted(true);
    startCameraRecording();
  };

  const handleInterviewUpload = async (file) => {
    const formData = new FormData();
    formData.append("file", file);
    formData.append("folderName", "trainee-interview-prep");
  
    const fileUploadPromise = axios.post(
      "https://coreutilities.hcomb.ai/v1/aws/uploadFile",
      formData,
      {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      }
    );
  
    return toast.promise(
      fileUploadPromise,
      {
        pending: "Uploading Video, Please wait...",
        success: "Video uploaded successfully!",
        error: "Failed to upload Video. Please try again.",
      },
      {
        autoClose: 3000,
      }
    ).then(response => {
      return response.data.data;
    }).catch(() => {
      return null;
    });
  };

  const getFeedBack = async(question) =>{
    setIsLoading(true)
    const currentCourse = courses.filter((course)=> course.id === selectedCourseId)
    const payload = [
      {
          Topic: currentCourse[0]?.course_name,
          Questions: [question]
      }
  ]
  
    const feedBack = await getQuestionFeedBack(payload)
    setFeedBackResponse(feedBack);
    setIsLoading(false)
  }


  const handleSubmitInterview = async () => {
    setQaData((preState) => [{'question':interviewQuestionsForCourse[currentQuestion]?.question, answer: transcript}])
    await stopRecording();
    stopStreams();
    await getFeedBack({Low: interviewQuestionsForCourse[currentQuestion]?.question, Answer: transcript});
    setTranscript("")
    // setCurrentQuestion(0)
    // setInterviewStarted(false);


    // if (screenChunksRef.current.length === 0) {
    //   toast.error(
    //     "No recording data available. Please ensure recording was started properly.",
    //     { autoClose: 3000 }
    //   );
    //   return;
    // }
    
    const screenBlob = new Blob(screenChunksRef.current, {
      type: "video/webm",
    });
    const fileName = `interview_prep_recording_${Date.now()}.webm`;
    const screenFile = new File([screenBlob], fileName, { type: "video/webm" });

    const fileUrl = await handleInterviewUpload(screenFile)
    if(fileUrl){
      const overView = {
        overview:{
          video_url: fileUrl,
          user_id: getUserId(),
          course_id: selectedCourseId,
          question_answer: qaData,
          file_name:fileName
        }
      }
      saveInterviewPrep(overView)
    }

    const screenDownloadUrl = URL.createObjectURL(screenBlob);
    const aScreen = document.createElement("a");
    aScreen.href = screenDownloadUrl;
    aScreen.download = "screen_recording.webm";
    document.body.appendChild(aScreen);
    // aScreen.click();
    document.body.removeChild(aScreen);

    URL.revokeObjectURL(screenDownloadUrl);
    screenChunksRef.current = [];
  
    toast.success("Interview successfully downloaded in your system!", { autoClose: 3000 });

  };

  return (
    <>
      <ToastContainer />
    
        {/* <div className="mx-4 lg:mx-12 lg:mt-28 md:mt-20 sm:mt-20">
    <div className="flex flex-wrap w-full gap-6 mb-4">
      <div className="w-full xl:w-[62%]">
        <div className="bg-[#1A1C1E] rounded-lg border border-[#37383A]">
          <div className="flex items-center justify-between p-5">
            <label className="text-[#BDBEBE]">
              Select Course: {"  "}
              <select
                value={selectedCourseId}
                onChange={handleCourseChange}
                disabled={interviewStarted}
                className="px-2 py-1 rounded"
                style={{
                  backgroundColor: "#37383A",
                  color: "#BDBEBE",
                  borderColor: "#BDBEBE",
                  fontFamily: "Poppins, sans-serif",
                }}
              >
                {courses.map((course) => (
                  <option key={course.id} value={course.id}>
                    {course.course_name}
                  </option>
                ))}
              </select>
            </label>
            <span className="text-xl text-[#BDBEBE]">
              {interviewQuestionsForCourse?.length > 0
                ? `${currentQuestion + 1}/${
                    interviewQuestionsForCourse?.length
                  }`
                : "0/0"}
            </span>
          </div>

          <div className="p-5">
            {!interviewStarted ? (
              <>
                {interviewQuestionsForCourse?.length > 0 ? (
                  <button
                    onClick={handleStartInterview}
                    className="w-full rounded-[4px] cursor-pointer bg-[#5b52e7] p-3 text-white"
                  >
                    Start Interview
                  </button>
                ) : (
                  <p className="text-[#BDBEBE]">
                    No questions available for this course.
                  </p>
                )}
              </>
            ) : (
              <>
                <h4 className="text-xl font-bold text-white">
                  {currentQuestion + 1}.{" "}
                  {interviewQuestionsForCourse[currentQuestion]?.question}
                </h4>
                <div className="relative w-full pt-[56%] my-4">
                  <video
                    ref={videoRef}
                    className="absolute top-0 left-0 w-full h-full rounded-xl"
                    muted
                    autoPlay
                  ></video>
                </div>
                <div className="flex gap-3 justify-between">
                  {!recording ? (
                    <button
                      className="rounded-[4px] cursor-pointer bg-[#5b52e7] p-3 text-white"
                      onClick={startScreenRecording}
                    >
                      Start answering
                    </button>
                  ) : (
                    <button
                      className="w-full rounded-[4px] cursor-pointer bg-green-700 p-3 text-white"
                      onClick={handleSubmitInterview}
                    >
                      Submit answer
                    </button>
                  )}
                  {!recording ? (
                    <div className="flex gap-3">
                      {currentQuestion > 0 ? (
                        <button
                          className="rounded-[4px] cursor-pointer bg-[#5b52e7] p-3 text-white"
                          onClick={() => handleQuestion(true)}
                        >
                          Previous
                        </button>
                      ) : (
                        <></>
                      )}
                      {currentQuestion !==
                      interviewQuestionsForCourse?.length - 1 ? (
                        <button
                          className="rounded-[4px] cursor-pointer bg-[#5b52e7] p-3 text-white"
                          onClick={() => handleQuestion(false)}
                        >
                          Next
                        </button>
                      ) : (
                        <></>
                      )}
                    </div>
                  ) : (
                    <></>
                  )}
                </div>
                {!recording && (
                  <button
                    onClick={stopInterView}
                    className="w-full rounded-[4px] cursor-pointer bg-red-600 p-3 text-white mt-5"
                  >
                    Stop Interview
                  </button>
                )}
              </>
            )}
          </div>
        </div>
      </div>

      <div className="w-full xl:w-[35%]">
        {feedBackResponse.length === 0 ? (
          <div className="bg-[#1A1C1E] rounded-lg border border-[#37383A] p-5 flex flex-col gap-5 justify-center items-center h-50">
            <div className="text-white">
              Your Answer Feedback Appear here when you submit the answer
            </div>
            {isLoading && <div><CircularProgress /></div>}
          </div>
        ) : (
          <div className="bg-[#1A1C1E] rounded-lg border border-[#37383A] p-5">
            <h4 className="text-xl font-bold text-white">Feedback</h4>
            <div className="text-sm text-white flex items-center gap-5 my-5">
              Assessment Score :{" "}
              <span className="text-3xl font-bold text-white">
                {feedBackResponse[0]?.assessment_score}
              </span>
            </div>
            <div className="text-sm text-white flex flex-col my-5">
              <div className="text-lg text-white">Question:</div>
              <div className="ml-5">- {feedBackResponse[0]?.questions[0]?.question_name}</div>
            </div>
            <div className="text-sm text-white flex flex-col my-5">
              <div className="text-lg text-white">Assessment:</div>
              <div className="ml-5">- {feedBackResponse[0]?.questions[0]?.question_assessment_summary}</div>
            </div>
            <div className="text-sm text-white flex flex-col my-5">
              <div className="text-lg text-white">Your Answer:</div>
              <div className="ml-5">- {feedBackResponse[0]?.questions[0]?.user_transcript}</div>
            </div>
          </div>
        )}
      </div>
    </div>
  </div> */}
   <div className="px-4 lg:px-12 lg:mt-28 md:mt-20 sm:mt-20">
      <div className="flex flex-wrap gap-6 mb-4">
        <div className="w-full xl:w-[62%]">
          <div className="bg-[#1A1C1E] rounded-lg border border-[#37383A] p-5">
            <div className="flex flex-wrap items-center justify-between mb-4">
              <label className="text-[#BDBEBE] text-sm md:text-base">
                Select Course:
                <select
                  value={selectedCourseId}
                  onChange={handleCourseChange}
                  disabled={interviewStarted}
                  className="ml-2 px-3 py-2 rounded bg-[#37383A] text-[#BDBEBE] border border-[#BDBEBE] font-poppins w-[50%]"
                >
                  {courses.map((course) => (
                    <option key={course.id} value={course.id}>
                      {course.course_name}
                    </option>
                  ))}
                </select>
              </label>
              <span className="text-lg md:text-xl text-[#BDBEBE]">
                {interviewQuestionsForCourse?.length > 0
                  ? `${currentQuestion + 1}/${interviewQuestionsForCourse?.length}`
                  : "0/0"}
              </span>
            </div>

            <div>
              {!interviewStarted ? (
                interviewQuestionsForCourse?.length > 0 ? (
                  <button
                    onClick={handleStartInterview}
                    className="w-full rounded-md bg-[#5b52e7] p-3 text-white"
                  >
                    Start Interview
                  </button>
                ) : (
                  <p className="text-[#BDBEBE] text-center">No questions available.</p>
                )
              ) : (
                <div>
                  <h4 className="text-lg md:text-xl font-bold text-white">
                    {currentQuestion + 1}. {interviewQuestionsForCourse[currentQuestion]?.question}
                  </h4>
                  <div className="relative w-full pt-[56%] my-4">
                    <video
                      ref={videoRef}
                      className="absolute top-0 left-0 w-full h-full rounded-lg"
                      muted
                      autoPlay
                    ></video>
                  </div>
                  <div className="flex flex-wrap gap-3 justify-between">
                    {!recording ? (
                      <button
                        className="rounded-md bg-[#5b52e7] p-3 text-white w-full sm:w-auto"
                        onClick={startScreenRecording}
                      >
                        Start Answering
                      </button>
                    ) : (
                      <button
                        className="w-full rounded-md bg-green-700 p-3 text-white"
                        onClick={handleSubmitInterview}
                      >
                        Submit Answer
                      </button>
                    )}
                    {!recording && (
                      <div className="flex gap-3">
                        {currentQuestion > 0 && (
                          <button
                            className="rounded-md bg-[#5b52e7] p-3 text-white"
                            onClick={() => handleQuestion(true)}
                          >
                            Previous
                          </button>
                        )}
                        {currentQuestion !== interviewQuestionsForCourse?.length - 1 && (
                          <button
                            className="rounded-md bg-[#5b52e7] p-3 text-white"
                            onClick={() => handleQuestion(false)}
                          >
                            Next
                          </button>
                        )}
                      </div>
                    )}
                  </div>
                  {!recording && (
                    <button
                      onClick={stopInterView}
                      className="w-full rounded-md bg-red-600 p-3 text-white mt-5"
                    >
                      Stop Interview
                    </button>
                  )}
                </div>
              )}
            </div>
          </div>
        </div>

        <div className="w-full xl:w-[35%]">
          <div className="bg-[#1A1C1E] rounded-lg border border-[#37383A] p-5 h-auto min-h-[200px]">
            {feedBackResponse.length === 0 ? (
              <div className="flex flex-col items-center justify-center gap-4 text-white">
                <p>Your Answer Feedback Will Appear Here.</p>
                {isLoading && <CircularProgress />}
              </div>
            ) : (
              <div>
                <h4 className="text-xl font-bold text-white">Feedback</h4>
                <p className="text-sm text-white my-3 flex items-center gap-2">
                  Assessment Score: <span className="text-3xl font-bold">{feedBackResponse[0]?.assessment_score}</span>
                </p>
                <p className="text-sm text-white my-3">
                  <strong>Question:</strong> {feedBackResponse[0]?.questions[0]?.question_name}
                </p>
                <p className="text-sm text-white my-3">
                  <strong>Assessment:</strong> {feedBackResponse[0]?.questions[0]?.question_assessment_summary}
                </p>
                <p className="text-sm text-white my-3">
                  <strong>Your Answer:</strong> {feedBackResponse[0]?.questions[0]?.user_transcript}
                </p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
    </>
  );
};

export default Interviewprep;
