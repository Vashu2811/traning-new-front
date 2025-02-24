// export default Cources;
/* eslint-disable react/jsx-no-comment-textnodes */
import { useEffect, useState } from "react";
import { FaEdit } from "react-icons/fa";
import AddCircleOutlineIcon from "@mui/icons-material/AddCircleOutline";

import { Link, useNavigate, useParams } from "react-router-dom";
import {
  AddNewmodule,
  getModules,
  getSpecificModuleLessons,
  getTraineeProgress,
} from "../../services/api";
import { TailSpin } from "react-loader-spinner";
import { Box, Button, Modal, TextField, Typography } from "@mui/material";

import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import TopNavTrainee from "./TopNavTrainee";
import AccessCourse from "components/AccessCourse";
import ProgressBar from "components/ProgressBar";
import Bot from "pages/Bot";
import _ from "lodash";
import CenteredProgress from "components/CenteredProgress";
import ModuleGrid from "components/ModuleGrid";
import PdfViewer from "components/PdfViewer";

const Cources = () => {
  const { courseId } = useParams();
  const { selectedCourse, storedUserId } = AccessCourse({ courseId });
  const [showAddModal, setShowAddModal] = useState(false);
  const [modules, setModules] = useState([]);
  const [coreModules, setCoreModules] = useState([]);
  const [shortsModules, setShortsModules] = useState([]);
  const [interview, setInterview] = useState([]);

  const [newModule, setNewModule] = useState({
    module_name: "",
    module_description: "",
    // youtubeLink: "",
  });
  const [courseDetails, setCourseDetails] = useState(null);
  // const [generated, setGenerated] = useState("");
  // const generateId = () => {
  //   return uuidv4();
  // };
  const navigate = useNavigate();
  const fetchModules = async (courseId) => {
    try {
      const response = await getModules(courseId);
      if (response) {
        setCourseDetails(response);
        let modules = response?.modules;
        if (modules && modules.length) {
          modules = await Promise.all(
            _.map(modules, async (module) => {
              const res = await getTraineeProgress("module", module.id);
              return {
                ...module,
                progress: res && res?.length ? res[0].total_progress : 0,
              };
            })
          );
          setModules(
            _.orderBy(
              modules?.filter((module) => module.type === "ai"),
              [(module) => module.order_number || Number.MAX_VALUE],
              ["asc"]
            )
          );
          setCoreModules(
            _.orderBy(
              modules?.filter((module) => module.type === "core"),
              [(module) => module.order_number || Number.MAX_VALUE],
              ["asc"]
            )
          );
          setShortsModules(
            _.orderBy(
              modules?.filter((module) => module.type === "shorts"),
              [(module) => module.order_number || Number.MAX_VALUE],
              ["asc"]
            )
          );
          setInterview(
            _.orderBy(
              modules?.filter((module) => module.type === "interview"),
              [(module) => module.order_number || Number.MAX_VALUE],
              ["asc"]
            )
          );
        }
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

  useEffect(() => {
    fetchModules(courseId);
  }, [courseId]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    if (name === "youtubeLink") {
      setNewModule((prevModule) => ({
        ...prevModule,
        [name]: value,
      }));
    } else {
      setNewModule((prevModule) => ({
        ...prevModule,
        [name]: value,
      }));
    }
  };

  const addNewModule = async () => {
    // const newModuleWithId = { ...newModule };
    const newModulePayload = {
      modules: [
        {
          module_name: newModule.module_name,
          module_description: newModule.module_description,
        },
      ],
    };
    try {
      const response = await AddNewmodule(courseId, newModulePayload);

      setShowAddModal(false);
      setNewModule({
        module_name: "",
        module_description: "",
        youtubeLink: "",
      });
      await fetchModules(courseId);
    } catch (error) {
      toast.error("Something Went Wrong, Please Try Again.", {
        autoClose: 3000,
      });
    }
  };

  const Addmodule = () => {
    setShowAddModal(true);
  };

  const totalModules = modules?.length;
  return (
    <>
      <ToastContainer />

      <TopNavTrainee courseId={courseId} selectedCourse={selectedCourse} />
      <Modal
        open={showAddModal}
        onClose={() => setShowAddModal(false)}
        aria-labelledby="add-new-module-modal"
        aria-describedby="form-to-add-new-module"
      >
        <Box className="absolute m-auto inset-0 h-fit lg:w-1/4 md:w-2/4 sm:w-2/4 max-sm:w-4/5 bg-[#242728] text-[#BDBEBE] border-2 border-[#37383A] p-8 rounded-lg">
          <Typography
            variant="h6"
            component="h2"
            sx={{ mb: 2, fontFamily: "Poppins, sans-serif" }}
          >
            Add New Module
          </Typography>

          <TextField
            label="Name"
            variant="outlined"
            name="module_name"
            value={newModule.module_name}
            onChange={handleInputChange}
            fullWidth
            sx={{
              mb: 2,
              "& input": {
                color: "#BDBEBE !important",
                fontFamily: "Poppins, sans-serif",
              },
              "& .MuiOutlinedInput-notchedOutline": {
                borderColor: "#37383A !important",
              },
              "& .MuiInputLabel-outlined": {
                color: "#BDBEBE !important",
              },
            }}
          />
          <TextField
            label="Description"
            variant="outlined"
            name="module_description"
            multiline
            rows={4}
            value={newModule.module_description}
            onChange={handleInputChange}
            fullWidth
            sx={{
              mb: 2,
              "& textarea": {
                color: "#BDBEBE !important",
                fontFamily: "Poppins, sans-serif",
              },
              "& .MuiOutlinedInput-notchedOutline": {
                borderColor: "#37383A !important",
              },
              "& .MuiInputLabel-outlined": {
                color: "#BDBEBE !important",
              },
            }}
          />

          <div className="flex justify-end">
            <Button
              onClick={() => setShowAddModal(false)}
              sx={{
                mr: 2,
                color: "#BDBEBE",
                fontFamily: "Poppins, sans-serif",
                "&:hover": {
                  background: "#282B2F",
                },
              }}
            >
              Cancel
            </Button>
            <Button
              variant="contained"
              onClick={addNewModule}
              sx={{
                background: "#282B2F",
                color: "#BDBEBE",
                fontFamily: "Poppins, sans-serif",
                "&:hover": {
                  background: "#282B2F",
                },
              }}
            >
              Add
            </Button>
          </div>
        </Box>
      </Modal>

      <div className="flex flex-col lg:flex-row gap-5">
        <div className="bg-[#1A1C1E] rounded-lg lg:w-3/5 w-full ">
          {!courseDetails?.overview?.is_custom && (
            <div className="bg-[#1A1C1E] rounded-lg p-1">
              <div className="header-title">
                <h4>Road Map</h4>
              </div>
              {courseDetails?.overview?.road_map ? (
                <PdfViewer filename={courseDetails?.overview?.road_map} />
              ) : (
                <p className="text-[#bdbebe] p-4">Coming soon...</p>
              )}
            </div>
          )}
          {/* Core Modules */}
          <div className="bg-[#1A1C1E] rounded-lg p-1 mt-5">
            <div className="header-title">
              <h4>Core Modules</h4>
            </div>
            <div className="grid gap-6 p-4 overflow-x-auto grid-cols-1 sm:grid-cols-2 lg:grid-cols-3">
              {coreModules?.length === 0 ? (
                <TailSpin color="#FFFFFF" height={20} width={20} />
              ) : (
                coreModules?.map((module) => (
                  <div
                    key={module.id}
                    className="bg-[#242728] border border-[#303234] rounded-md p-4"
                  >
                    <Link
                      to={`/training/courses/${courseDetails.id}/module/${module.id}`}
                      className="text-white"
                    >
                      {module.youtubeLink && (
                        <iframe
                          title="YouTube Video"
                          width="100%"
                          height="200"
                          src={`https://www.youtube.com/embed/${module.youtubeLink}`}
                          frameBorder="0"
                          allowFullScreen
                        ></iframe>
                      )}
                      <div className="flex justify-between items-center mt-2">
                        <h2 className="text-lg font-normal">
                          {module.module_name}
                        </h2>
                        <CenteredProgress percentage={module.progress} />
                      </div>
                      <p className="text-base text-[#bdbebe]">
                        {module.module_description}
                      </p>
                    </Link>
                  </div>
                ))
              )}
            </div>
          </div>
          {!courseDetails?.overview?.is_custom && (
            <ModuleGrid
              title="Shorts Modules"
              modules={shortsModules}
              isTrainer={false}
              onModuleClick={(moduleId) =>
                navigate(
                  `/training/courses/${courseDetails.id}/module/${moduleId}`,
                  {
                    state: { type: "shorts", name: "Shorts" },
                  }
                )
              }
            />
          )}
          {/* AI Enablement */}
          {!courseDetails?.overview?.is_custom && (
            <div className="bg-[#1A1C1E] rounded-lg p-1 mt-5">
              <div className="header-title">
                <h4>AI Enablement</h4>
              </div>
              <div className="grid gap-6 p-4 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3">
                {modules?.length === 0 ? (
                  <p className="text-[#BDBEBE]">No AI Enablement available</p>
                ) : (
                  modules?.map((module) => (
                    <div
                      key={module.id}
                      className="bg-[#242728] border border-[#303234] rounded-md p-4"
                    >
                      <Link
                        to={`/training/courses/${courseDetails.id}/module/${module.id}`}
                        className="text-white"
                      >
                        {module.youtubeLink && (
                          <iframe
                            title="YouTube Video"
                            width="100%"
                            height="200"
                            src={`https://www.youtube.com/embed/${module.youtubeLink}`}
                            frameBorder="0"
                            allowFullScreen
                          ></iframe>
                        )}
                        <h3 className="text-base font-normal mt-2">
                          {module.module_name}
                        </h3>
                        <p className="text-base text-[#bdbebe]">
                          {module.module_description}
                        </p>
                      </Link>
                    </div>
                  ))
                )}
              </div>
            </div>
          )}
        </div>
        {/* Right Section */}
        {!courseDetails?.overview?.is_custom && (
          <div className=" rounded-lg lg:w-1/3 w-full p-1">
            <Bot
              id={null}
              type={"course"}
              prompts={courseDetails?.training_course_prompt}
              title={
                courseDetails?.modules?.length > 0
                  ? courseDetails?.modules.map((i) => i.module_name)
                  : []
              }
            />
          </div>
        )}
      </div>
    </>
  );
};

export default Cources;
