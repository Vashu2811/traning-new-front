import axios from "axios";
const newBaseUrl = 
  "https://hcomb-container-app.victoriousbush-67842c2f.eastus.azurecontainerapps.io/";
  // "http://127.0.0.1:5000/";


const instance = axios.create({
  baseURL: process.env.REACT_APP_BASE_URL,
  headers: {
    "Content-Type": "application/json",
    credentials: "include", // You can add other headers here if  needed
  },
});
const newInstance = axios.create({
  baseURL: newBaseUrl,
  headers: {
    "Content-Type": "application/json",
    credentials: "include",
  },
});
const getToken = () => {
  return localStorage.getItem("token");
};

export const setUserId = (userId) => {
  return localStorage.setItem("userId", userId);
};

export const getUserId = () => {
  return localStorage.getItem("userId");
};



instance.interceptors.request.use(
  (config) => {
    const token = getToken();
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Define functions for different API endpoints

export const login = async (userData) => {
  try {
    const response = await instance.post("/auth/login", userData);
    return response.data;
  } catch (error) {
    throw error.response?.data ?? error.message;
  }
};

export const AddNewmodule = async (courseId, addmodule) => {
  try {
    const response = await newInstance.put(
      `/training_course_details/${courseId}`,
      addmodule
    );
    return response.data;
  } catch (error) {
    throw error.response?.data ?? error.message;
  }
};

export const users = async (data) => {
  try {
    const response = await newInstance.put(
      `/training_users`,
      data
    );
    return response.data;
  } catch (error) {
    throw error.response?.data ?? error.message;
  }
};

export const saveInterviewPrep = async (data) => {
  try {
    const response = await newInstance.put(
      `/interview_preparation`,
      data
    );
    return response.data;
  } catch (error) {
    throw error.response?.data ?? error.message;
  }
};

export const editModule = async (courseId, editModule) => {
  try {
    const response = await newInstance.put(
      `/training_course_details/${courseId}`,
      editModule
    );
    return response.data;
  } catch (error) {
    throw error.response?.data ?? error.message;
  }
};

export const deleteModule = async (courseId, deleteModule) => {
  try {
    const response = await newInstance.put(
      `/training_course_details/${courseId}`,
      deleteModule
    );
    return response.data;
  } catch (error) {
    throw error.response?.data ?? error.message;
  }
};

export const getTraineeProgress = async (type,id) => {
  try {
    const user_id = getUserId();
    const response = await newInstance.get(
      `/training_progress/${type}/${id}/${user_id}`
    );
    return response.data;
  } catch (error) {
    throw error.response?.data ?? error.message;
  }
};

export const getCoursesAndModules = async () => {
  try {
    const response = await newInstance.get(
      `/get_courses_and_modules`
    );
    return response.data;
  } catch (error) {
    throw error.response?.data ?? error.message;
  }
}

export const getModules = async (courseId) => {
  try {
    const response = await newInstance.get(
      `/training_course_details/${courseId}`
    );
    return response.data;
  } catch (error) {
    throw error.response?.data ?? error.message;
  }
};

export const getCustomModules = async (courseId,payload) => {
  try {
    const response = await newInstance.post(
      `/training_custom_course_details/${courseId}`,
      payload
    );
    return response.data;
  } catch (error) {
    throw error.response?.data ?? error.message;
  }
};

export const getCourses = async () => {
  try {
    const response = await newInstance.get(`/training_courses_by_user_id?id=${getUserId()}`);
    return response;
  } catch (error) {
    throw error.response?.data ?? error.message;
  }
};

export const addNewLesson = async (moduleId, newLessonData) => {
  try {
    const response = await newInstance.put(
      `/module_details/${moduleId}`,
      newLessonData,
      {
        headers: {
          "Content-Type": "application/json",
        },
      }
    );
    return response.data;
  } catch (error) {
    throw error.response?.data ?? error.message;
  }
};

export const uploadPDF = async (pdfFile) => {
  try {
    const formData = new FormData();
    formData.append("pdfFile", pdfFile);

    const response = await instance.post("/upload-pdf", formData, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    });

    return response.data;
  } catch (error) {
    throw error.response?.data ?? error.message;
  }
};

export const getSpecificModuleLessons = async (moduleId) => {
  try {
    const user_id = getUserId();
    const response = await newInstance.get(`module_details/${user_id}/${moduleId}`);

    return response.data;
  } catch (error) {
    throw error.response?.data ?? error.message;
  }
};

export const getSpecificLessonDetail = async (lessonId) => {
  try {
    const response = await newInstance.get(`/lesson_details/${lessonId}`);
    return response.data;
  } catch (error) {
    throw error.response?.data ?? error.message;
  }
};

export const Addquizzes = async (lessonId, quizze) => {
  try {
    const response = await newInstance.put(
      `/lesson_details/${lessonId}`,
      quizze
    );
    return response.data;
  } catch (error) {
    throw error.response?.data ?? error.message;
  }
};
export const Updatequizzes = async (lessonId, quizze) => {
  try {
    const response = await newInstance.put(
      `/lesson_details/${lessonId}`,
      quizze
    );
    return response.data;
  } catch (error) {
    throw error.response?.data ?? error.message;
  }
};

export const AddCourses = async (Cources) => {
  try {
    const response = await newInstance.put(`/training_courses/`, Cources);
    return response.data;
  } catch (error) {
    throw error.response?.data ?? error.message;
  }
};
export const UpdateCourses = async (Cources) => {
  try {
    const response = await newInstance.put(`/training_courses/`, Cources);
    return response.data;
  } catch (error) {
    throw error.response?.data ?? error.message;
  }
};
export const deleteLesson = async (lessonId) => {
  try {
    const response = await instance.delete(`/lesson/${lessonId}/delete`);
    return response.data;
  } catch (error) {
    throw error.response?.data ?? error.message;
  }
};
export const getUserRole = async () => {
  try {
    const response = await instance.get("/auth/user/role"); // Replace with your API endpoint to get user role
    return response.data.role; // Assuming the role is retrieved from the response data
  } catch (error) {
    throw error.response?.data ?? error.message;
  }
};
export default instance;


export const uploadExercisePDF = async (pdfFile) => {
  try {
    const formData = new FormData();
    formData.append('file', pdfFile);
    formData.append('folderName', 'exercise'); 

    const response = await fetch('https://coreutilities.hcomb.ai/v1/aws/uploadFile', {
      method: 'POST',
      body: formData
    });

    if (!response.ok) {
      throw new Error('Failed to upload PDF file');
    }

    const data = await response.json(); 
    return data;
  } catch (error) {
    throw error.response?.data ?? error.message;
  }
};



export const AddLesson = async (id, lessonData) => {
  try {
    const response = await newInstance.put(`/lesson_details/${id}`, lessonData);
    return response.data;
  } catch (error) {
    console.error("Error updating lesson:", error);
    throw error;
  }
};

export const updateLesson = async (id, lessonData) => {
  try {
    const response = await newInstance.put(`/lesson_details/${id}`, lessonData);
    return response.data;
  } catch (error) {
    console.error("Error updating lesson:", error);
    throw error;
  }
};

export const deletelesson = async (id,data) => {
  try {
    const response = await newInstance.put(`/lesson_details/${id}`, data);
    return response.data;
  } catch (error) {
    console.error("Error deleting lesson:", error);
    throw error;
  }
};


export const AddNewInterviewQuestion = async (courseId, newQuestion) => {
  try {
    const response = await newInstance.put(
      '/interview_questions',
      {
        overview: {
          training_course_id: courseId,
          interview_question_number: newQuestion.number,
          question: newQuestion.question,
          answer: newQuestion.answer,
        },
      }
    );
    return response.data;
  } catch (error) {
    throw error.response?.data ?? error.message;
  }
};


export const getInterviewQuestion = async () => {
  try{
    const response = await newInstance.get('/get_interview_questions') 
    return response.data
  }
  catch(error){
    throw error.response?.data ?? error.message
  }
}

export const updateInterviewQuestion = async (courseId, newQuestion) => {

  try {
    const payload = {
      overview: {
        id: newQuestion.id, 
        training_course_id: courseId,
        interview_question_number: newQuestion.number,
        question: newQuestion.question,
        answer: newQuestion.answer,
        is_deleted: newQuestion.is_deleted ?? false,
      },
    };

    const response = await newInstance.put(
      `/interview_questions/${newQuestion.id}`, 
      payload
    );
    
    return response.data;
  } catch (error) {
    throw error.response?.data ?? error.message;
  }
};

export const createThread = async () => {                                                                                                                                                                                                                                                                                                                                                                                                                                               
  try{
    const response = await newInstance.post('https://api.hcomb.ai/v1/open-ai/chat/create-thread') 
    return response.data
  }
  catch(error){
    throw error.response?.data ?? error.message
  }
}

export const deleteInterviewQuestion = async (questionId) => {
  try {
    const payload = {
      overview: {
        id: questionId, 
        is_deleted: true,
      },
    };

    const response = await newInstance.put(
      `/interview_questions/${questionId}`, 
      payload
    );
    
    return response.data;
  } catch (error) {
    throw error.response?.data ?? error.message;
  }
};

export const getQuestionFeedBack = async (data) => {
  try {
    const config = {
      method: 'post',
      url: 'https://honeycomb-intelligence-container.victoriousbush-67842c2f.eastus.azurecontainerapps.io/assessmentEvaluation',
      headers: { 
        'Content-Type': 'application/json'
      },
      data : data
    };
    const response = await axios.request(config)
    return response.data;
  } catch (error) {
    return null
  }
};

export const getMentors = async () => {
  try {
    const response = await newInstance.get("/mentors");
    return response;
  } catch (error) {
    throw error.response?.data ?? error.message;
  }
};

export const getConversation = async (threadId) => {
  try {
    const response = await newInstance.get(`/thread_messages?thread_id=${threadId}`);
    return response;
  } catch (error) {
    throw error.response?.data ?? error.message;
  }
};

export const upsertMentor = async (mentors) => {
  try {
    const response = await newInstance.put(`/mentors/`, mentors);
    return response.data;
  } catch (error) {
    throw error.response?.data ?? error.message;
  }
};

export const getMentorData = async () => {
  const response = await newInstance.get(`/get_mentors`, {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
    }
  });
  return response.data;
}

