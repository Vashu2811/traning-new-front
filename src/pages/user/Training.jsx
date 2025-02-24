import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import AddCircleOutlineIcon from "@mui/icons-material/AddCircleOutline";
import { useDispatch } from "react-redux";

import { AddCourses, AddNewmodule, getCourses, getCoursesAndModules, getModules, getTraineeProgress, getUserId } from "../../services/api";
import { TailSpin } from "react-loader-spinner";
import { Box, Button, createTheme, Dialog, DialogActions, DialogContent, DialogTitle, IconButton, Modal, TextField, ThemeProvider, Typography } from "@mui/material";
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import _ from 'lodash';
import TopNav from "components/TopNav";
import TopNavTrainee from "./TopNavTrainee";
import { fetchAllCourses } from "store/actions/course";
import { useReduxState } from "hooks/useReduxActions";
import CourceBot from "pages/CourceBot";
import CenteredProgress from "components/CenteredProgress";
import Autocomplete from '@mui/material/Autocomplete';
import DeleteIcon from "@mui/icons-material/Delete";
// import EditIcon from "@mui/icons-material/Edit";

const theme = createTheme({
  components: {
    MuiAutocomplete: {
      styleOverrides: {
        groupLabel: {
          backgroundColor: "#1e2023", // Background color for the group label
          color: "#BDBEBE", // Text color for the group label
          fontWeight: "bold", // Optional: Bold text
          padding: "4px 8px", // Optional: Padding for better spacing
        },
        // groupUl: {
        //   backgroundColor: "#f5f5f5", // Optional: Background color for grouped items
        // },
        inputRoot: {
          "& .MuiInputBase-input": {
            color: "#BDBEBE", // Input text color
          },
        },
        paper: {
          backgroundColor: "#282B2F", // Background color of the dropdown
          color: "##BDBEBE", // Text color of the options
        },
        option: {
          "&.Mui-focused": {
            backgroundColor: "282B2F", // Background of focused option
            color: "##BDBEBE", // Text color of focused option
          },
        },
      },
    },
  },
});

const Training = () => {
  // const { courseId } = useParams();
  const [showAddModal, setShowAddModal] = useState(false);
  const [courses, setCourses] = useState([]);
  const [allCoursesAndModules, setAllCoursesAndModules] = useState([]);
  const [customCourse, setCustomCourse] = useState({
    name: '',
    courses:[]
  })

  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [deleteData, setDeleteData]=useState({title: '', id: ''})


    // const dispatch = useReduxActions();
    const dispatch = useDispatch();
  
    useEffect(() => {
  
      dispatch(fetchAllCourses());
    }, [dispatch]);

    useEffect(()=>{
      (async()=>{
        const response = await getCoursesAndModules()
        if(response?.list_of_courses_modules){
          setAllCoursesAndModules(response?.list_of_courses_modules)
        }
      })()
    },[])
  
    const coursesSelector = useReduxState((state) => state.course);
    useEffect(() => {
      setCourseData()
    }, [coursesSelector]);

  
  const setCourseData = async () => {
    let { courses,loading} = coursesSelector
    if (courses && courses.length > 0) {
      console.log('coursesSelector',coursesSelector);
      
      courses = await Promise.all(
        _.map(courses, async (course) => {
            const res = await getTraineeProgress('course', course.id);
            return {
                ...course,
                progress: res && res?.length ? res[0].total_progress : 0
            };
        })
      );
      // coursesSelector.courses.filter(async (corse) => {
      //   const res = await getTraineeProgress('course',corse.id)
      //   corse.progress =  res && res.length ?  res[0].total_progress : 0;
      // }); 
      console.log('courses',courses);
       
      setCourses(courses);
    }
  }  

  const fetchCourses = async () => {
    try {
      const response = await getCourses();
      if (response) {
        setCourses(response?.data.courses);
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

  // useEffect(() => {
  //   fetchCourses();
  // }, []);

  const handleInputChange = (name, value) => {
      setCustomCourse((prevModule) => ({
        ...prevModule,
        [name]: value,
      }));

  };

  const addCustomCourse = async () => {
    try {
      const courses = {courses: [{
        course_name: customCourse.name,
        is_custom: true,
        created_by: getUserId(),//user id,
        modules: customCourse.courses.map(c=> c.module_id)
      }]}
      setShowAddModal(false)
      await AddCourses(courses)
      dispatch(fetchAllCourses());
      toast.success("Custom Course Created..",{autoClose: 3000})

    } catch (error) {
      toast.error("Something Went Wrong, Please Try Again.", {
        autoClose: 3000,
      });
    }
  };
  const Addmodule = () => {
    setCustomCourse({
      name: '',
      courses:[]
    })
    setShowAddModal(true);
    // const id = generateId();
    // setGenerated(id);
  };

  const handleConfirmDelete = async () =>{
    const courses = {courses: [{
      id: deleteData?.id,
      is_deleted: true,
    }]}
    setDeleteDialogOpen(false)
    await AddCourses(courses)
    dispatch(fetchAllCourses());
    toast.success("Custom Course Deleted..",{autoClose: 3000})
  }
  
  const totalModules = courses?.length;
  return (
    <>
  <ToastContainer/>
      
      <TopNavTrainee />


      
      <div className="bg-[#1A1C1E] rounded-lg">
      <div className="header-title flex justify-between items-center">
          <h4>All Courses</h4>
          <div className="">
          <Button
            variant="contained"
            onClick={() => Addmodule()}
            sx={{
              background: "#5B53E7",
              color: "#FFFFFF",
              fontFamily: "Poppins, sans-serif",
              "&:hover": {
                background: "#5B53E7",
              },
            }}
          >
           <AddCircleOutlineIcon sx={{ mr: 1 }} /> Create
          </Button>
        </div>
        </div>
      <Modal
        open={showAddModal}
        onClose={() => setShowAddModal(false)}
        aria-labelledby="add-new-course-modal"
        aria-describedby="form-to-add-new-course"
      >
        <div className="sm:flex sm:justify-end flex justify-items-center ">
        <Box className="absolute m-auto inset-0 h-fit lg:w-2/4 md:w-2/4 sm:w-2/4 max-sm:w-[90%] bg-[#242728] text-[#BDBEBE] border-2 border-[#37383A] p-2 rounded-lg">
          <Typography
            variant="h6"
            component="h2"
            sx={{ mb: 2, fontFamily: "Poppins, sans-serif" }}
          >
            Create Custom course
          </Typography>

          <TextField
            label="Name"
            variant="outlined"
            name="name"
            value={customCourse.name}
            onChange={(e)=> handleInputChange('name', e.target.value)}
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
           <ThemeProvider theme={theme}>
            <Autocomplete

        multiple
        options={allCoursesAndModules}
        groupBy={(option) => option.course_name}
        getOptionLabel={(option) => option.module_name}
        // defaultValue={[top100Films[1]]}
        onChange={(e, value)=> handleInputChange('courses', value)}
        renderInput={(params) => (
          <TextField
            {...params}
            variant="standard"
            label="Select Modules"
            placeholder="Modules"
            sx={{
              "& .MuiInputLabel-root": { color: "#BDBEBE" }, // Label color
              "& .MuiInputBase-input": { color: "#BDBEBE" }, // Input text color
              "& .MuiInputLabel-outlined": {
                color: "#BDBEBE !important",
              },
            }}
          />
        )}
      //   slotProps={{style:{backgroundColor:'#282B2F', color: '#BDBEBE'}}}
      //   componentsProps={{style:{backgroundColor:'#282B2F', color: '#BDBEBE'}}}
        ListboxProps={{style:{backgroundColor:'#282B2F', color: '#BDBEBE'}}}
          ChipProps={{
        style: {
          backgroundColor: "#5b52e7", // Custom chip background color
          color: "#BDBEBE", // Custom chip text color
        },
      
      }}
      />
      </ThemeProvider>
          <div className="flex justify-end mt-5">
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
              onClick={addCustomCourse}
              sx={{ background: "#5b52e7 !important", color: "#ffffff !important", fontFamily: "Poppins, sans-serif", "&:hover": { background: "#5b52e7" } }}
              disabled={!(customCourse.name !== '' && customCourse.courses.length > 0)}
            >
              Add
            </Button>
          </div>
        </Box>
        </div>
      </Modal>      
      <div className="grid gap-6 p-4 overflow-x-auto 2xl:grid-cols-5 xl:grid-cols-4 lg:grid-cols-3 md:grid-cols-2">
        {courses?.length === 0 ? (
          // Loader component or loading message goes here
          <div className="flex justify-center">
            <TailSpin
              color="#FFFFFF"
              height={20}
              width={20}
              // style={{
              //   margin: "10px 10px",
              // }}
            />
          </div> // Render courses if not loading
        ) : courses ? (
          courses?.map((course) => (
            <div
              key={course.id}
              className="bg-[#242728] border border-[#303234] rounded-md p-4 gap-3 relative"
            >
              <Link
                to={`/training/courses/${course.id}`}
                style={{ textDecoration: "none" ,color: "#ffffff", wordBreak:"break-word"}}
              >
                {course.youtubeLink && (
                  <div className="mb-6">
                    <iframe
                      title="YouTube Video"
                      width="100%"
                      height="315"
                      src={`https://www.youtube.com/embed/${course.youtubeLink}`}
                      frameBorder="0"
                      allow="accelerometer; autoplay; encrypted-media; gyroscope; picture-in-picture"
                      allowFullScreen
                    ></iframe>
                  </div>
                )}
                <div className="flex justify-end items-center flex-row-reverse ">
                <h2 className="flex align-middle justify-start my-2.5 text-lg font-normal">
                  {course.course_name}
                </h2>
                 <CenteredProgress percentage={course.progress}/>
                </div>
                <p className="flex align-middle justify-start my-2.5 mx-2 text-base font-normal">
                  {course.module_description}
                </p>
              </Link>
              <label className="absolute top-0 right-0">
                {/* <input type="checkbox" /> */}
                {/* Edit icon */}
                {course?.is_custom && (
                      <div className="flex">
                        {/* <IconButton
                          color="primary"
                          aria-label="edit"
                          // onClick={(e) => handleEdit(e, lesson)}
                        >
                          <EditIcon sx={{ fontSize: 18 }} />
                        </IconButton> */}
                        <IconButton
                          color="error"
                          aria-label="delete"
                          onClick={(e) => {
                            setDeleteData({title: course?.course_name,id: course?.id})
                            setDeleteDialogOpen(true)
                          }}
                        >
                          <DeleteIcon sx={{ fontSize: 18 }} />
                        </IconButton>
                      </div>
                    )}
              </label>
            </div>
          ))
        ) : (
          // Render something else if there are no courses
          <div>No courses available</div>
        )}
      </div>
      </div>
      <CourceBot />
      <Dialog
        open={deleteDialogOpen}
        onClose={() => setDeleteDialogOpen(false)}
      >
        <DialogTitle
          sx={{
            background: "#242728",
            color: "#BDBEBE",
            fontFamily: "Poppins, sans-serif",
          }}
        >
          Confirm Deletion
        </DialogTitle>
        <DialogContent
          sx={{
            background: "#242728",
            color: "#BDBEBE",
            fontFamily: "Poppins, sans-serif",
          }}
        >
          <p>Are you sure you want to delete "{deleteData?.title}"?</p>
        </DialogContent>
        <DialogActions
          sx={{
            background: "#242728",
            color: "#BDBEBE",
            fontFamily: "Poppins, sans-serif",
          }}
        >
          <Button
            onClick={() => setDeleteDialogOpen(false)}
            sx={{
              mr: 2,
              mb: 2,
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
            onClick={handleConfirmDelete}
            variant="contained"
            color="error"
            sx={{ mr: 2, mb: 2, fontFamily: "Poppins, sans-serif" }}
          >
            Delete
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
};

export default Training;

