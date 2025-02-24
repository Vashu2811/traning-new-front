import React from 'react';
import { IconButton, Button, Dialog, DialogTitle, DialogContent, DialogActions } from '@mui/material';
import DeleteIcon from "@mui/icons-material/Delete";
import EditIcon from "@mui/icons-material/Edit";
import AddCircleOutlineIcon from "@mui/icons-material/AddCircleOutline";
import { TailSpin } from "react-loader-spinner";

const ContentCard = ({
  title = "Lessons",
  lessons,
  canEdit = false,
  onAddLesson,
  onEditLesson,
  onDeleteLesson,
  onLessonClick,
  courseId,
  moduleId,
  isLoading = false
}) => {
  const [deleteDialogOpen, setDeleteDialogOpen] = React.useState(false);
  const [lessonToDelete, setLessonToDelete] = React.useState(null);

  const handleEdit = (event, lesson) => {
    event.stopPropagation();
    onEditLesson?.(lesson);
  };

  const handleDelete = (event, lesson) => {
    event.stopPropagation();
    setLessonToDelete(lesson);
    setDeleteDialogOpen(true);
  };

  const handleConfirmDelete = () => {
    onDeleteLesson?.(lessonToDelete.id);
    setDeleteDialogOpen(false);
    setLessonToDelete(null);
  };

  const getYoutubeEmbedUrl = (url) => {
    if (!url) return null;
    if (url.includes("youtube.com")) {
      return `https://www.youtube.com/embed/${url.split("v=")[1]?.split("&")[0]}`;
    } else if (url.includes("youtu.be")) {
      return `https://www.youtube.com/embed/${url.split("/").pop()}`;
    }
    return url;
  };

  return (
    <div className="m-5 bg-[#1A1C1E] rounded-lg">
      <div className="flex items-center justify-between header-title">
        <h4>{title}</h4>
        {canEdit && (
          <Button
            variant="contained"
            onClick={onAddLesson}
            sx={{
              background: "#5b52e7",
              color: "#ffffff",
              fontFamily: "Poppins, sans-serif",
              textTransform: "uppercase",
              "&:hover": {
                background: "#5b52e7",
              },
            }}
          >
            <AddCircleOutlineIcon sx={{ mr: 1 }} />
            Add New {title}
          </Button>
        )}
      </div>

      <div className="grid gap-6 p-8 overflow-x-auto 2xl:grid-cols-5 xl:grid-cols-4 lg:grid-cols-3 md:grid-cols-2">
        {isLoading ? (
          <TailSpin
            color="#FFFFFF"
            height={20}
            width={20}
            style={{ margin: "10px 10px" }}
          />
        ) : !lessons || lessons.length === 0 ? (
          <div>No Lessons available</div>
        ) : (
          lessons
            .sort((a, b) => a.lesson_number - b.lesson_number)
            .map((lesson) => (
              <div
                key={lesson.id}
                className="bg-[#242728] border border-[#303234] overflow-hidden rounded-md gap-3"
              >
                <div
                  onClick={() => onLessonClick?.(lesson.id)}
                  style={{ textDecoration: "none" }}
                >
                  {lesson.url ? (
                    <div className="">
                      <iframe
                        title={`Video - ${lesson.title}`}
                        width="100%"
                        height="170"
                        src={getYoutubeEmbedUrl(lesson.url)}
                        frameBorder="0"
                        allow="accelerometer; autoplay; encrypted-media; gyroscope; picture-in-picture"
                        allowFullScreen
                      />
                    </div>
                  ) : (
                    <div
                      className="loading-spinner"
                      style={{
                        width: "100%",
                        height: "170px",
                        backgroundColor: "#000000",
                        animation: "loading 2s infinite linear",
                      }}
                    >
                      <TailSpin color="#c5c6c7" height={40} width={40} />
                    </div>
                  )}
                  <div className="flex items-start justify-between">
                    <div>
                      <h5 className="flex align-middle justify-start my-1 text-lg font-normal px-2">
                        {lesson.title}
                      </h5>
                    </div>
                    {canEdit && (
                      <div className="flex flex-col">
                        <IconButton
                          color="primary"
                          aria-label="edit"
                          onClick={(e) => handleEdit(e, lesson)}
                        >
                          <EditIcon sx={{ fontSize: 18 }} />
                        </IconButton>
                        <IconButton
                          color="error"
                          aria-label="delete"
                          onClick={(e) => handleDelete(e, lesson)}
                        >
                          <DeleteIcon sx={{ fontSize: 18 }} />
                        </IconButton>
                      </div>
                    )}
                  </div>
                  {/* <p className="px-4 opacity-50 my-2.5">
                    {lesson.lesson_description}
                  </p> */}
                  <p className="px-4 opacity-50 my-2.5">
  {lesson.lesson_description.length > 50
    ? lesson.lesson_description.slice(0, 50) + "..."
    : lesson.lesson_description}
</p>
                </div>
              </div>
            ))
        )}
      </div>

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
          <p>Are you sure you want to delete "{lessonToDelete?.title}"?</p>
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
    </div>
  );
};

export default ContentCard;