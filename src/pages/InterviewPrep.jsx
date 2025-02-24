
import { useEffect, useState } from "react";
import AddCircleOutlineIcon from "@mui/icons-material/AddCircleOutline";
import { Box, Button, Modal, TextField, Typography } from "@mui/material";
import { AddNewInterviewQuestion, getModules, deleteInterviewQuestion, updateInterviewQuestion } from "services/api";
import { fetchAllCourses } from "store/actions/course";
import { useDispatch } from "react-redux";
import { setLoading } from "store/reducers/loadingReducer";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const InterviewPrep = () => {
  const [showAddModal, setShowAddModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [modules, setModules] = useState({});
  const [interviewQuestions, setInterviewQuestions] = useState({});
  const [selectedCourseId, setSelectedCourseId] = useState();
  const [courses, setCourses] = useState([]);
  const [newInterview, setNewInterview] = useState({
    number: "",
    question: "",
    answer: "",
  });
  const [editQuestionData, setEditQuestionData] = useState({
    id: "",
    number: "",
    question: "",
    answer: "",
  });

  const dispatch = useDispatch();
  const user_Id = JSON.parse(localStorage.getItem("auth"))?.user?.userId;

  useEffect(() => {
    const fetchCourses = async () => {
      try {
        const result = await dispatch(fetchAllCourses());
        const results = result.payload;
        const userCourses = results.courses.filter(course => course.trainer_id === user_Id);
        setCourses(userCourses);
        setSelectedCourseId(userCourses[0]?.id);
      } catch (err) {
        toast.error("Something Went Wrong, Please Try Again.", { autoClose: 3000 });
      }
    };
    fetchCourses();
  }, [user_Id]);

  useEffect(() => {
    if (selectedCourseId) {
      fetchModules(selectedCourseId);
    }
  }, [selectedCourseId]);

  const fetchModules = async (courseId) => {
    dispatch(setLoading(true));
    try {
      const response = await getModules(courseId);
      if (response) {
        const sortedQuestions = response.interview_questions.sort((a, b) => a.interview_question_number - b.interview_question_number);
      
        setModules(prevModules => ({
          ...prevModules,
          [courseId]: response.modules,
        }));
        setInterviewQuestions(prevQuestions => ({
          ...prevQuestions,
          [courseId]: sortedQuestions,
        }));
      } else {
        toast.error("No modules found.", { autoClose: 3000 });
      }
    } catch (error) {
      toast.error("Something Went Wrong, Please Try Again.", { autoClose: 3000 });
    }
    dispatch(setLoading(false));
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setNewInterview(prevInterview => ({
      ...prevInterview,
      [name]: value,
    }));
  };

  const handleEditInputChange = (e) => {
    const { name, value } = e.target;
    setEditQuestionData(prev => ({
      ...prev,
      [name]: value,
    }));
  };

  const addNewInterview = async () => {
    const newInterviewPayload = {
      number: newInterview.number,
      question: newInterview.question,
      answer: newInterview.answer,
    };
    try {
      await AddNewInterviewQuestion(selectedCourseId, newInterviewPayload);
      setShowAddModal(false);
      setNewInterview({
        number: "",
        question: "",
        answer: "",
      });
      await fetchModules(selectedCourseId);
    } catch (error) {
      toast.error("Something Went Wrong, Please Try Again.", { autoClose: 3000 });
    }
  };

  const saveEditedQuestion = async () => {
    try {
      await updateInterviewQuestion(selectedCourseId, editQuestionData);
      setShowEditModal(false);
      await fetchModules(selectedCourseId);
    } catch (error) {
      toast.error("Error updating question, please try again.", { autoClose: 3000 });
    }
  };

  const handleCourseChange = (e) => {
    setSelectedCourseId(e.target.value);
  };

  const interviewQuestionsForCourse = interviewQuestions[selectedCourseId] || [];

  const handleDeleteQuestion = async (questionId) => {
    if (window.confirm("Are you sure you want to delete this question?")) {
      try {
        await deleteInterviewQuestion(questionId);
        toast.success("Interview question deleted successfully.", { autoClose: 3000 });
        await fetchModules(selectedCourseId);
      } catch (error) {
        toast.error("Error deleting question, please try again.", { autoClose: 3000 });
      }
    }
  };

  const openEditModal = (question) => {
    setEditQuestionData(question);
    setShowEditModal(true);
  };

  return (
    <>
      <ToastContainer />

      {/* Add Interview Question Modal */}
      <Modal
        open={showAddModal}
        onClose={() => setShowAddModal(false)}
        aria-labelledby="add-new-interview-question-modal"
        aria-describedby="form-to-add-new-interview-question"
      >
        <Box className="absolute m-auto inset-0 h-fit lg:w-1/4 md:w-2/4 sm:w-2/4 max-sm:w-4/5 bg-[#242728] text-[#BDBEBE] border-2 border-[#37383A] p-8 rounded-lg">
          <Typography variant="h6" component="h2" sx={{ mb: 2, fontFamily: "Poppins, sans-serif" }}>
            Add New Interview Question
          </Typography>
          <TextField
            label="Question Number"
            variant="outlined"
            name="number"
            required
            value={newInterview.number}
            onChange={handleInputChange}
            fullWidth
            sx={{
              mb: 2,
              "& input": { color: "#BDBEBE !important", fontFamily: "Poppins, sans-serif" },
              "& .MuiOutlinedInput-notchedOutline": { borderColor: "#37383A !important" },
              "& .MuiInputLabel-outlined": { color: "#BDBEBE !important" },
            }}
          />
          <TextField
            label="Question"
            variant="outlined"
            name="question"
            multiline
            required
            rows={2}
            value={newInterview.question}
            onChange={handleInputChange}
            fullWidth
            sx={{
              mb: 2,
              "& textarea": { color: "#BDBEBE !important", fontFamily: "Poppins, sans-serif" },
              "& .MuiOutlinedInput-notchedOutline": { borderColor: "#37383A !important" },
              "& .MuiInputLabel-outlined": { color: "#BDBEBE !important" },
            }}
          />
          <TextField
            label="Answer"
            variant="outlined"
            name="answer"
            multiline
            required
            rows={2}
            value={newInterview.answer}
            onChange={handleInputChange}
            fullWidth
            sx={{
              mb: 2,
              "& textarea": { color: "#BDBEBE !important", fontFamily: "Poppins, sans-serif" },
              "& .MuiOutlinedInput-notchedOutline": { borderColor: "#37383A !important" },
              "& .MuiInputLabel-outlined": { color: "#BDBEBE !important" },
            }}
          />
          <div className="flex justify-end">
            <Button
              onClick={() => setShowAddModal(false)}
              sx={{ mr: 2, color: "#BDBEBE", fontFamily: "Poppins, sans-serif", "&:hover": { background: "#282B2F" } }}
            >
              Cancel
            </Button>
            <Button
              variant="contained"
              onClick={addNewInterview}
              sx={{ background: "#282B2F", color: "#BDBEBE", fontFamily: "Poppins, sans-serif", "&:hover": { background: "#282B2F" } }}
            >
              Add
            </Button>
          </div>
        </Box>
      </Modal>

      {/* Edit Interview Question Modal */}
      <Modal
  open={showEditModal}
  onClose={() => setShowEditModal(false)}
  aria-labelledby="edit-interview-question-modal"
  aria-describedby="form-to-edit-interview-question"
>
  <Box className="absolute m-auto inset-0 h-fit lg:w-1/4 md:w-2/4 sm:w-2/4 max-sm:w-4/5 bg-[#242728] text-[#BDBEBE] border-2 border-[#37383A] p-8 rounded-lg">
    <Typography variant="h6" component="h2" sx={{ mb: 2, fontFamily: "Poppins, sans-serif" }}>
      Edit Interview Question
    </Typography>
    <TextField
      label="Question"
      variant="outlined"
      name="question"
      multiline
      rows={2}
      value={editQuestionData.question}
      onChange={handleEditInputChange}
      fullWidth
      sx={{
        mb: 2,
        "& textarea": { color: "#BDBEBE !important", fontFamily: "Poppins, sans-serif" },
        "& .MuiOutlinedInput-notchedOutline": { borderColor: "#37383A !important" },
        "& .MuiInputLabel-outlined": { color: "#BDBEBE !important" },
      }}
    />
    <TextField
      label="Answer"
      variant="outlined"
      name="answer"
      multiline
      rows={2}
      value={editQuestionData.answer}
      onChange={handleEditInputChange}
      fullWidth
      sx={{
        mb: 2,
        "& textarea": { color: "#BDBEBE !important", fontFamily: "Poppins, sans-serif" },
        "& .MuiOutlinedInput-notchedOutline": { borderColor: "#37383A !important" },
        "& .MuiInputLabel-outlined": { color: "#BDBEBE !important" },
      }}
    />
    <div className="flex justify-end">
      <Button
        onClick={() => setShowEditModal(false)}
        sx={{ mr: 2, color: "#BDBEBE", fontFamily: "Poppins, sans-serif", "&:hover": { background: "#282B2F" } }}
      >
        Cancel
      </Button>
      <Button
        variant="contained"
        onClick={saveEditedQuestion}
        sx={{ background: "#282B2F", color: "#BDBEBE", fontFamily: "Poppins, sans-serif", "&:hover": { background: "#282B2F" } }}
      >
        Save
      </Button>
    </div>
  </Box>
</Modal>

      <div className="m-5 bg-[#1A1C1E] rounded-lg mt-28">
        <div className="flex items-center justify-between header-title">
          <h4>Interview Prep</h4>
          <Button
            variant="contained"
            onClick={() => setShowAddModal(true)}
            sx={{ background: "#5b52e7", color: "#ffffff", fontFamily: "Poppins, sans-serif", "&:hover": { background: "#5b52e7" } }}
          >
            <AddCircleOutlineIcon sx={{ mr: 1 }} /> Add Interview
          </Button>
        </div>

        <div className="mx-12">
          <label htmlFor="course-select" className="block mb-2 text-sm font-medium text-[#BDBEBE]">
            Select Course:
            <select
              id="course-select"
              value={selectedCourseId}
              onChange={handleCourseChange}
              className="m-2 mt-4 px-2 py-1 rounded"
              style={{
                backgroundColor: "#37383A",
                color: "#BDBEBE",
                borderColor: "#BDBEBE",
                fontFamily: "Poppins, sans-serif",
              }}
            >
              {courses.map(course => (
                <option key={course.id} value={course.id} className="text-[#BDBEBE]">
                  {course?.course_name}
                </option>
              ))}
            </select>
          </label>
        </div>

        <div className="m-4">
          <h6 className="text-[#BDBEBE] font-semibold">Interview Questions:</h6>
          {interviewQuestionsForCourse.length > 0 ? (
            <ul>
              {interviewQuestionsForCourse.map((question) => (
                <li key={question.id} className="text-[#BDBEBE] mt-2">
                  <p><strong>Q:</strong> {question.question}</p>
                  <p><strong>A:</strong> {question.answer}</p>
                  <div className="flex ">
                    <Button onClick={() => openEditModal(question)} sx={{ color: "#5b52e7", "&:hover": { background: "#282B2F" } }}>
                      Edit
                    </Button>
                    <Button onClick={() => handleDeleteQuestion(question.id)} sx={{ color: "#e74c3c", "&:hover": { background: "#282B2F" } }}>
                      Delete
                    </Button>
                  </div>
                  <hr className="mt-3 opacity-10"/>
                </li>
              ))}
            </ul>
          ) : (
            <p className=" pb-4">No interview questions available for this course.</p>
          )}
        </div>
      </div>
    </>
  );
};

export default InterviewPrep;
