import React, { useState, useEffect } from "react";
import {
  IconButton,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Button,
} from "@mui/material";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import { upsertMentor, getMentors } from "services/api";
import { toast } from "react-toastify";

const List = ({ data=[], handleEdit, setData=()=>{} }) => {
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [selectedMentor, setSelectedMentor] = useState(null);

  const handleDelete = async () => {
    if (!selectedMentor) return;

    try {
      const updatedMentor = { ...selectedMentor, is_deleted: true };
      const response = await upsertMentor(updatedMentor);

      if (response) {
        const res =  await getMentors();
        setData(res && res.data && res.data.mentors && res.data.mentors.length> 0 ? res.data.mentors : []);
        toast.success("Mentor deleted successfully!", { autoClose: 3000 });
      }
    } catch (error) {
      toast.error("Something Went Wrong, Please Try Again.", {
        autoClose: 3000,
      });
    } finally {
      setDeleteDialogOpen(false);
    }
  };

  const confirmDelete = (mentor) => {
    setSelectedMentor(mentor);
    setDeleteDialogOpen(true);
  };

  useEffect(() => {
    getMentors();
  }, []);

  return (
    <div className="m-5 course-section">
      <TableContainer component={Paper} className="">
        <Table>
          <TableHead className="border-2 border-[#37383A] bg-[#292B2D]">
            <TableRow sx={{ border: "2px solid #37383A" }}>
              <TableCell
                sx={{
                  fontSize: "16px",
                  color: "#BDBEBE",
                  fontFamily: "Poppins, sans-serif",
                }}
              >
                No.
              </TableCell>
              <TableCell
                sx={{
                  fontSize: "16px",
                  color: "#BDBEBE",
                  fontFamily: "Poppins, sans-serif",
                }}
              >
                Mentor Name
              </TableCell>
              <TableCell
                sx={{
                  fontSize: "16px",
                  color: "#BDBEBE",
                  fontFamily: "Poppins, sans-serif",
                }}
              >
                Actions
              </TableCell>
            </TableRow>
          </TableHead>
          <TableBody className="border-2 border-[#37383A] bg-[#1A1C1E]">
            {data?.map((ele, index) => (
              <TableRow key={ele?.id} sx={{ border: "2px solid #37383A" }}>
                <TableCell
                  sx={{
                    color: "#BDBEBE",
                    fontFamily: "Poppins, sans-serif",
                    fontSize: "16px",
                  }}
                >
                  {index + 1}
                </TableCell>
                <TableCell
                  sx={{
                    color: "#BDBEBE",
                    fontFamily: "Poppins, sans-serif",
                    fontSize: "16px",
                  }}
                >
                  {ele?.name}
                </TableCell>
                <TableCell
                  sx={{
                    color: "#BDBEBE",
                    fontFamily: "Poppins, sans-serif",
                    fontSize: "16px",
                  }}
                  className="action-btn"
                >
                  <IconButton
                    color="primary"
                    aria-label="edit"
                    onClick={() => handleEdit({ id: ele.id, name: ele.name })}
                  >
                    <EditIcon />
                  </IconButton>
                  <IconButton
                    color="error"
                    aria-label="delete"
                    onClick={() => confirmDelete(ele)}
                  >
                    <DeleteIcon />
                  </IconButton>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>

      {/* Confirmation Dialog */}

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
          <p>Are you sure you want to delete?</p>
        </DialogContent>
        <DialogActions sx={{ background: "#242728", color: "#BDBEBE" }}>
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
            onClick={handleDelete}
            variant="contained"
            color="error"
            sx={{ mr: 2, mb: 2, fontFamily: "Poppins, sans-serif" }}
          >
            Delete
          </Button>
        </DialogActions>
      </Dialog>
    </div>
  );
};

export default List;
