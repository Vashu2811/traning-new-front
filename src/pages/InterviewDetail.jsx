import AddCircleOutlineIcon from "@mui/icons-material/AddCircleOutline";
import DeleteIcon from "@mui/icons-material/Delete";
import EditIcon from "@mui/icons-material/Edit";
import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  IconButton,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  TextField,
} from "@mui/material";
import { useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import product1 from "../data/product1.jpg";

const DummyInterview = [
  {
    id: 1,
    name: "Interview ",
    description: "Interview Description ",
    image: product1,
  },
];
const InterviewDetail = () => {
  const navigate = useNavigate();
  const { interviewid } = useParams();
  const [editDialogOpen, setEditDialogOpen] = useState(false);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [editInterviewid, setEditInterviewId] = useState(null);
  const [editedInterviewQuestion, setEditedInterviewQuestion] = useState("");
  const [editedInterviewAnswer, setEditedInterviewAnswer] = useState("");
  const selectedInterview = DummyInterview[0];

  if (!selectedInterview) {
    return <div>Lesson not found</div>;
  }
  const generateResourceId = () => {
    return Date.now().toString();
  };

  const handleEdit = (id, name, link) => {
    setEditInterviewId(id);
    setEditedInterviewQuestion(name);
    setEditedInterviewAnswer(link);
    setEditDialogOpen(true);
  };

  const handleSaveEdit = () => {
   
    setEditDialogOpen(false);
  };

  const handlePreviewClick = () => {
    // Navigate to the PreviewInterview route with the interviewId parameter
    navigate(`/interview/${interviewid}/preview`);
  };
  const handleAddResource = () => {
    setEditInterviewId(generateResourceId());
    setEditedInterviewQuestion("");
    setEditedInterviewAnswer("");
    setEditDialogOpen(true);
  };

  const handleDelete = (id, name) => {
    setEditInterviewId(id);
    setEditedInterviewQuestion(name);
    setDeleteDialogOpen(true);
  };

  const handleConfirmDelete = () => {
   
    setDeleteDialogOpen(false);
  };
  const Interviews = [
    {
      id: 1,
      Question: "Question 1",
      Answer: "answer1",
      // Add more properties as needed
    },
    {
      id: 2,
      Question: "Question 2",
      Answer: "answer1",
      // Add more properties as needed
    },
    // Add more Interview objects as required
  ];

  const specificInterview =
    Interviews && Interviews.length > 0
      ? Interviews.find((Interview) => Interview.id === editInterviewid)
      : null;
  return (
    <>
      <nav
        class="flex mx-12 my-4 lg:mt-20 md:mt-20 max-sm:mt-20 sm:mt-20"
        aria-label="Breadcrumb"
      >
        <ol class="inline-flex items-center space-x-1 md:space-x-2 rtl:space-x-reverse">
          <li class="inline-flex items-center">
            <Link
              to="/Interview-Prep/"
              class="inline-flex items-center text-base font-medium text-[#BDBEBE]"
            >
              <svg
                class="w-3 h-3 me-2.5"
                aria-hidden="true"
                xmlns="http://www.w3.org/2000/svg"
                fill="currentColor"
                viewBox="0 0 20 20"
              >
                <path d="m19.707 9.293-2-2-7-7a1 1 0 0 0-1.414 0l-7 7-2 2a1 1 0 0 0 1.414 1.414L2 10.414V18a2 2 0 0 0 2 2h3a1 1 0 0 0 1-1v-4a1 1 0 0 1 1-1h2a1 1 0 0 1 1 1v4a1 1 0 0 0 1 1h3a2 2 0 0 0 2-2v-7.586l.293.293a1 1 0 0 0 1.414-1.414Z" />
              </svg>
              Home
            </Link>
          </li>
          <li aria-current="page">
            <div class="flex items-center">
              <svg
                class="rtl:rotate-180 w-3 h-3 text-[#BDBEBE]"
                aria-hidden="true"
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 6 10"
              >
                <path
                  stroke="currentColor"
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  stroke-width="2"
                  d="m1 9 4-4-4-4"
                />
              </svg>
              <svg
                class="rtl:rotate-180 w-3 h-3 text-[#BDBEBE] me-2.5"
                aria-hidden="true"
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 6 10"
              >
                <path
                  stroke="currentColor"
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  stroke-width="2"
                  d="m1 9 4-4-4-4"
                />
              </svg>
              <span class="ms-1 text-base font-medium text-[#BDBEBE">
                Interview {interviewid}
              </span>
            </div>
          </li>
        </ol>
      </nav>

      <div className="mx-12">
        <h2 className="text-[#BDBEBE] font-semibold text-xl my-4">
          Interview ID: {interviewid}
        </h2>
        <div className="flex flex-col items-center">
          <img
            src={selectedInterview.image}
            alt={selectedInterview.name}
            className="w-full max-w-[500px] mb-3"
          />
          <h2 className="text-2xl font-bold mb-2">{selectedInterview.name}</h2>
          <p className="text-lg font-normal mb-5">
            {selectedInterview.description}
          </p>
        </div>
      </div>
      <div className="mx-12">
        {/* Add Interview Button */}
        <Button
          variant="outlined"
          onClick={() => {
            handleAddResource();
          }}
          sx={{
            marginBottom: "32px",
            marginRight: "10px",
            background: "#5B53E7",
            borderColor: "#5B53E7",
            color: "#FFF",
            "&:hover": {
              background: "#5B53E7",
              borderColor: "#5B53E7",
            },
          }}
        >
          <AddCircleOutlineIcon sx={{ mr: 1 }} />
          Add Question
        </Button>
        {/* Preview Button */}
        <Button
          variant="outlined"
          onClick={handlePreviewClick}
          sx={{
            marginBottom: "32px",
            background: "#5B53E7",
            borderColor: "#5B53E7",
            color: "#FFF",
            "&:hover": {
              background: "#5B53E7",
              borderColor: "#5B53E7",
            },
          }}
        >
          <AddCircleOutlineIcon sx={{ mr: 1 }} />
          Preview
        </Button>

        {/* Interview Table */}
        <TableContainer component={Paper}>
          <Table>
            <TableHead className="border-2 border-black bg-gray-200">
              <TableRow>
                <TableCell sx={{ fontSize: "16px" }}>ID</TableCell>
                <TableCell sx={{ fontSize: "16px" }}>Question</TableCell>
                <TableCell sx={{ fontSize: "16px" }}>Answer</TableCell>
                <TableCell sx={{ fontSize: "16px" }}>Actions</TableCell>
              </TableRow>
            </TableHead>
            <TableBody className="border-2 border-gray-500">
              {Interviews.map((Interview) => (
                <TableRow key={Interview.id}>
                  <TableCell>{Interview.id}</TableCell>
                  <TableCell>{Interview.Question}</TableCell>
                  <TableCell>{Interview.Answer}</TableCell>
                  <TableCell>
                    <IconButton
                      color="primary"
                      aria-label="edit"
                      onClick={() =>
                        handleEdit(
                          Interview.id,
                          Interview.Question,
                          Interview.Answer
                        )
                      }
                    >
                      <EditIcon />
                    </IconButton>
                    <IconButton
                      color="error"
                      aria-label="delete"
                      onClick={() =>
                        handleDelete(Interview.id, Interview.Question)
                      }
                    >
                      <DeleteIcon />
                    </IconButton>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>

        {/* Dialog for Edit/Add Interview */}
        <Dialog open={editDialogOpen} onClose={() => setEditDialogOpen(false)}>
          <DialogTitle sx={{ my: 2 }}>
            {specificInterview ? "Edit Question/Answer" : "Add Question/Answer"}
          </DialogTitle>
          <DialogContent>
            <TextField
              label="ID"
              value={specificInterview ? specificInterview.id : editInterviewid}
              disabled
              fullWidth
              sx={{ mb: 2 }}
            />
            <TextField
              label="Question"
              value={editedInterviewQuestion}
              onChange={(e) => setEditedInterviewQuestion(e.target.value)}
              fullWidth
              sx={{ mb: 2 }}
            />
            <TextField
              label="Answer"
              multiline
              rows={4}
              value={editedInterviewAnswer}
              onChange={(e) => setEditedInterviewAnswer(e.target.value)}
              fullWidth
              sx={{ mb: 2 }}
            />
          </DialogContent>
          <DialogActions>
            <Button
              onClick={() => setEditDialogOpen(false)}
              sx={{ mr: 2, mb: 4, color: "#5B53E7" }}
            >
              Cancel
            </Button>
            <Button
              onClick={handleSaveEdit}
              variant="contained"
              sx={{
                mr: 2,
                mb: 4,
                background: "#5B53E7",
                color: "#FFF",
                "&:hover": {
                  background: "#5B53E7",
                },
              }}
            >
              {editInterviewid ? "Save" : "Add"}
            </Button>
          </DialogActions>
        </Dialog>

        {/* Dialog for Confirm Deletion */}
        <Dialog
          open={deleteDialogOpen}
          onClose={() => setDeleteDialogOpen(false)}
        >
          <DialogTitle>Confirm Deletion</DialogTitle>
          <DialogContent>
            <p>Are you sure you want to delete "{editedInterviewQuestion}"?</p>
          </DialogContent>
          <DialogActions>
            <Button
              onClick={() => setDeleteDialogOpen(false)}
              sx={{ mr: 2, mb: 2, color: "#5B53E7" }}
            >
              Cancel
            </Button>
            <Button
              onClick={handleConfirmDelete}
              variant="contained"
              color="error"
              sx={{ mr: 2, mb: 2 }}
            >
              Delete
            </Button>
          </DialogActions>
        </Dialog>
      </div>
    </>
  );
};

export default InterviewDetail;
