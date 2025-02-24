import {
  Button,
  Grid,
  InputLabel,
  MenuItem,
  Select,
  TextField,
  Typography,
} from "@mui/material";
import { useEffect, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import { addNewLesson, getSpecificModuleLessons } from "../services/api";
import { ToastContainer, toast } from "react-toastify";
import axios from "axios";
import TopNav from "components/TopNav";
import AccessCourse from "components/AccessCourse";
import { useLocation } from "react-router-dom";

const NewLesson = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const lesson = location.state;
  console.log("-----------location", location.state);
  const { courseId, moduleId } = useParams();
  const [uploadedVideoUrl, setUploadedVideoUrl] = useState("");
  const [uploadedPDFUrl, setUploadedPDFUrl] = useState("");
  const [moduleName, setModuleName] = useState();

  const [formData, setFormData] = useState({
    id: lesson?.id || null,
    title: lesson?.title || "",
    url: lesson?.url || "",
    lesson_number: lesson?.lesson_number || "",
    lessonDuration: "",
    lesson_description: lesson?.lesson_description || "",
    pdfFile: null,
    videoFile: null,
  });

  const [videoFileName, setVideoFileName] = useState("");

  useEffect(() => {
    const fetchModuleLessons = async () => {
      try {
        const moduleLessons = await getSpecificModuleLessons(moduleId);
        setModuleName(moduleLessons?.overview?.module_name);
      } catch (error) {
        toast.error("Something Went Wrong, Please Try Again.", {
          autoClose: 3000,
        });
      }
    };

    fetchModuleLessons();
  }, [moduleId]);

  useEffect(() => {
    if (formData.url) {
      setUploadedVideoUrl(formData.url);
    }
  }, [formData.url]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handlePdfUpload = async (file) => {
    const formData = new FormData();
    formData.append("file", file);
    formData.append("folderName", "Lesson-PDF");

    try {
      const response = await axios.post(
        "https://coreutilities.hcomb.ai/v1/aws/uploadFile",
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        }
      );
      return response.data.data; // Return the uploaded PDF URL
    } catch (error) {
      throw error;
    }
  };

  const handleVideoUpload = async (file) => {
    const formData = new FormData();
    formData.append("file", file);
    formData.append("folderName", "Lesson-Videos");

    try {
      const response = await axios.post(
        "https://coreutilities.hcomb.ai/v1/aws/uploadFile",
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        }
      );
      return response.data.data; // Return the uploaded video URL
    } catch (error) {
      throw error;
    }
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    setFormData({ ...formData, pdfFile: file });

    // Define the promise for PDF upload
    const pdfUploadPromise = handlePdfUpload(file).then((pdfUrl) => {
      setUploadedPDFUrl(pdfUrl);
      return pdfUrl;
    });

    // Show toast notifications using toast.promise
    toast.promise(
      pdfUploadPromise,
      {
        pending: "Uploading PDF, Please wait...",
        success: "PDF uploaded successfully!",
        error: "Failed to upload PDF. Please try again.",
      },
      {
        autoClose: 3000,
      }
    );
  };

  const handleVideoChange = (e) => {
    const file = e.target.files[0];
    setFormData({ ...formData, videoFile: file });
    setVideoFileName(file.name);

    // Define the promise for video upload
    const videoUploadPromise = handleVideoUpload(file).then((videoUrl) => {
      setUploadedVideoUrl(videoUrl);
      return videoUrl;
    });

    // Show toast notifications using toast.promise
    toast.promise(
      videoUploadPromise,
      {
        pending: "Uploading Video, Please wait...",
        success: "Video uploaded successfully!",
        error: "Failed to upload video. Please try again.",
      },
      {
        autoClose: 3000,
      }
    );
  };

  const validateVideoUrl = (url) => {
    const shortsUrlPattern =
      /^(https?:\/\/)?(www\.)?youtube\.com\/shorts\/[a-zA-Z0-9_-]+$/;
    const videoUrlPattern =
      /^(https?:\/\/)?(www\.)?(youtube\.com\/(watch\?v=|embed\/|v\/)|youtu\.be\/)[a-zA-Z0-9_-]+([&?].*)?$/;

    if (lesson?.type === "shorts") {
      return url;
    } else {
      return videoUrlPattern.test(url);
    }
  };

  const validateForm = () => {
    const { title, url, videoFile, pdfFile } = formData;

    if (!title) {
      toast.error("Title is required.");
      return false;
    }

    if (url && !validateVideoUrl(url)) {
      toast.error("Invalid video URL format.");
      return false;
    }
    return true;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validateForm()) return;

    const {
      title,
      url,
      lesson_number,
      lessonDuration,
      lesson_description,
      pdfFile,
    } = formData;

    const lessonData = new FormData();

    lessonData.append("moduleId", moduleId);
    lessonData.append("title", title);
    lessonData.append("url", url);
    if (lesson_number) {
      lessonData.append("lesson_number", lesson_number);
    }
    lessonData.append("lessonDuration", lessonDuration);
    lessonData.append("lesson_description", lesson_description);
    if (pdfFile) {
      lessonData.append("pdfFile", uploadedPDFUrl);
    }

    try {
      const newLessonPayload = {
        lessons: [
          {
            title: formData.title,
            url: uploadedVideoUrl,
            lesson_description: formData.lesson_description,
            file: uploadedPDFUrl,
          },
        ],
      };
      if (formData.lesson_number) {
        newLessonPayload.lessons[0].lesson_number = formData.lesson_number;
      }
      if (formData.id) {
        newLessonPayload.lessons[0].id = formData.id;
      }
      const response = await addNewLesson(moduleId, newLessonPayload, {
        headers: {
          "Content-Type": "application/json",
        },
      });

      if (response?.message.includes("Successfully upserted")) {
        navigate(
          `/admin/courses/${courseId}/${
            lesson?.type !== "shorts" ? "module" : "shorts"
          }/${moduleId}`
        );
      }
    } catch (error) {
      toast.error("Something Went Wrong, Please Try Again.", {
        autoClose: 3000,
      });
    }
  };

  const durationOptions = [
    "30 minutes",
    "1 hour",
    "1.5 hours",
    "2 hours",
    "More than 2 hours",
  ];

  const { selectedCourse, storedUserId } = AccessCourse({ courseId });

  return (
    <>
      <ToastContainer />
      <TopNav
        data={lesson}
        courseId={courseId}
        selectedCourse={selectedCourse}
        moduleName={moduleName}
        addNewLesson={true}
        moduleId={moduleId}
      />

      <form onSubmit={handleSubmit} className="mx-12 mt-4">
        <Typography
          variant="h5"
          gutterBottom
          sx={{
            fontWeight: "600",
            marginBottom: "15px",
            color: "#BDBEBE",
            fontFamily: "Poppins, sans-serif",
          }}
        >
          {lesson?.isEdit ? "Edit" : "Add New"} {lesson?.name}
        </Typography>
        <Grid container spacing={3}>
          <Grid item xs={12} md={6}>
            <InputLabel
              htmlFor="title"
              className="!text-[#BDBEBE] mb-2"
              sx={{ fontFamily: "Poppins, sans-serif" }}
            >
              {lesson?.name} Name
            </InputLabel>
            <TextField
              fullWidth
              id="title"
              name="title"
              value={formData?.title}
              onChange={handleInputChange}
              sx={{
                borderRadius: "4px",
                "& input": {
                  color: "#BDBEBE !important",
                  fontFamily: "Poppins, sans-serif",
                },
                "& .MuiOutlinedInput-notchedOutline": {
                  borderColor: "#37383A !important",
                },
              }}
            />
          </Grid>
          <Grid item xs={12} md={6}>
            <InputLabel
              htmlFor="url"
              className="!text-[#BDBEBE] mb-2"
              sx={{ fontFamily: "Poppins, sans-serif" }}
            >
              Video URL
            </InputLabel>
            <TextField
              fullWidth
              id="url"
              name="url"
              value={formData?.url}
              onChange={handleInputChange}
              sx={{
                borderRadius: "4px",
                "& input": {
                  color: "#BDBEBE !important",
                  fontFamily: "Poppins, sans-serif",
                },
                "& .MuiOutlinedInput-notchedOutline": {
                  borderColor: "#37383A !important",
                },
              }}
            />
          </Grid>
          <Grid item xs={12} md={6}>
            <InputLabel
              htmlFor="lesson_number"
              className="!text-[#BDBEBE] mb-2"
              sx={{ fontFamily: "Poppins, sans-serif" }}
            >
              {lesson?.name} Number
            </InputLabel>
            <TextField
              fullWidth
              id="lesson_number"
              name="lesson_number"
              value={formData?.lesson_number}
              onChange={handleInputChange}
              sx={{
                borderRadius: "4px",
                "& input": {
                  color: "#BDBEBE !important",
                  fontFamily: "Poppins, sans-serif",
                },
                "& .MuiOutlinedInput-notchedOutline": {
                  borderColor: "#37383A !important",
                },
              }}
            />
          </Grid>
          {lesson?.type !== "shorts" && (
            <>
              <Grid item xs={12} md={6}>
                <InputLabel
                  htmlFor="lessonDuration"
                  className="!text-[#BDBEBE] mb-2"
                  sx={{ fontFamily: "Poppins, sans-serif" }}
                >
                  Lesson Duration
                </InputLabel>
                <Select
                  fullWidth
                  id="lessonDuration"
                  name="lessonDuration"
                  value={formData?.lessonDuration}
                  onChange={handleInputChange}
                  displayEmpty
                  sx={{
                    border: "1px solid #37383A",
                    borderRadius: "4px",
                    "& .MuiSelect-select": {
                      color: "#BDBEBE !important",
                      fontFamily: "Poppins, sans-serif",
                    },
                    "& .MuiSelect-icon": {
                      color: "#BDBEBE !important",
                    },
                    "& .MuiOutlinedInput-notchedOutline": {
                      borderColor: "#37383A !important",
                    },
                  }}
                >
                  {durationOptions.map((option, index) => (
                    <MenuItem key={index} value={option}>
                      {option}
                    </MenuItem>
                  ))}
                </Select>
              </Grid>
              <Grid item xs={12} md={6}>
                <InputLabel
                  htmlFor="videoFile"
                  className="!text-[#BDBEBE] mb-2"
                  sx={{ fontFamily: "Poppins, sans-serif" }}
                >
                  Upload Video
                </InputLabel>

                <label
                  htmlFor="videoFile"
                  className="block cursor-pointer bg-[#333] border rounded-lg p-3 text-white flex items-center justify-center"
                >
                  <input
                    type="file"
                    id="videoFile"
                    name="videoFile"
                    accept="video/*"
                    onChange={handleVideoChange}
                    className="hidden"
                  />
                  <Typography
                    variant="body2"
                    sx={{ fontFamily: "Poppins, sans-serif" }}
                  >
                    {videoFileName ? videoFileName : "Choose Video"}
                  </Typography>
                </label>
              </Grid>
              <Grid item xs={12} md={6}>
                <InputLabel
                  htmlFor="pdfFile"
                  className="!text-[#BDBEBE] mb-2"
                  sx={{ fontFamily: "Poppins, sans-serif" }}
                >
                  Upload PDF
                </InputLabel>

                <label
                  htmlFor="pdfFile"
                  className="block cursor-pointer bg-[#333] border rounded-lg p-3 text-white flex items-center justify-center"
                >
                  <input
                    type="file"
                    id="pdfFile"
                    name="pdfFile"
                    accept=".pdf"
                    onChange={handleFileChange}
                    className="hidden"
                  />
                  <Typography
                    variant="body2"
                    sx={{ fontFamily: "Poppins, sans-serif" }}
                  >
                    {formData.pdfFile ? formData.pdfFile.name : "Choose PDF"}
                  </Typography>
                </label>
              </Grid>
            </>
          )}
          <Grid item xs={12}>
            <InputLabel
              htmlFor="lesson_description"
              className="!text-[#BDBEBE] mb-2"
              sx={{ fontFamily: "Poppins, sans-serif" }}
            >
              Description
            </InputLabel>
            <TextField
              fullWidth
              multiline
              rows={4}
              id="lesson_description"
              name="lesson_description"
              value={formData?.lesson_description}
              onChange={handleInputChange}
              sx={{
                borderRadius: "4px",
                "& textarea": {
                  // Apply styles to the textarea
                  color: "#BDBEBE !important",
                  fontFamily: "Poppins, sans-serif",
                },
                "& .MuiOutlinedInput-notchedOutline": {
                  borderColor: "#37383A !important",
                },
              }}
            />
          </Grid>

          <Grid item xs={12}>
            <Button
              type="submit"
              variant="contained"
              sx={{
                background: "#5B52E7",
                color: "#FFF",
                fontFamily: "Poppins, sans-serif",
                "&:hover": {
                  background: "#5B52E7",
                },
              }}
            >
              {formData?.id ? "Edit" : "Submit"}
            </Button>
            &nbsp;
            <Button
              type="submit"
              variant="contained"
              sx={{
                background: "#5B52E7",
                color: "#FFF",
                fontFamily: "Poppins, sans-serif",
                "&:hover": {
                  background: "#5B52E7",
                },
              }}
              onClick={() => {
                navigate(
                  `/admin/courses/${courseId}/${
                    lesson?.type !== "shorts" ? "module" : "shorts"
                  }/${moduleId}`
                );
              }}
            >
              Cancel
            </Button>
          </Grid>
        </Grid>
      </form>
    </>
  );
};

export default NewLesson;
