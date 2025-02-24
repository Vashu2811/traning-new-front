import React from 'react';
import { Button, IconButton, Chip } from '@mui/material';
import DeleteIcon from "@mui/icons-material/Delete";
import EditIcon from "@mui/icons-material/Edit";
import AddCircleOutlineIcon from "@mui/icons-material/AddCircleOutline";

const ModuleGrid = ({
  title,
  modules,
  canEdit = false,
  onAddModule,
  onEditModule,
  onDeleteModule,
  onModuleClick,
  userId,
  trainerUserId,
  isTrainer = true
}) => {
  const handleModuleClick = (moduleId) => {
    onModuleClick?.(moduleId);
  };

  const handleEdit = (event, module) => {
    event.stopPropagation();
    onEditModule?.(module);
  };

  const handleDelete = (event, moduleId, moduleName) => {
    event.stopPropagation();
    onDeleteModule?.(moduleId, moduleName);
  };

  return (
    <div className="m-5 bg-[#1A1C1E] rounded-lg">
     
       <div className="flex items-center justify-between header-title">
          <h4>{title}</h4>
          {userId === trainerUserId && isTrainer && (
          <Button
            variant="contained"
            onClick={() => onAddModule?.()}
            sx={{
              background: "#5b52e7",
              display:"flex",
              color: "#ffffff",
              fontFamily: "Poppins, sans-serif",
              "&:hover": {
                background: "#5b52e7",
              },
            }}
          >
            <AddCircleOutlineIcon sx={{ mr: 1 }} /> Add 
          </Button>
        )}
        </div>

      <div className="grid gap-6 p-8 overflow-x-auto 2xl:grid-cols-5 xl:grid-cols-4 lg:grid-cols-3 md:grid-cols-2">
        {!modules || modules.length === 0 ? (
          <div className="text-[#BDBEBE]">No {title} available</div>
        ) : (
          modules.map((module) => (
            <div
              key={module.id}
              className="bg-[#242728] border border-[#303234] rounded-md p-4 gap-3 cursor-pointer relative"
              onClick={() => handleModuleClick(module.id)}
            >
              {isTrainer &&
                <div className="absolute -top-3 -left-3">
                  <Chip
                    label={module.order_number}
                    size="small"
                    color="primary"
                  />
                </div>
              }
              <div className="flex items-start justify-between">
                <h5 className="text-[#BDBEBE] font-semibold">
                  {module.module_name}
                </h5>
                {canEdit && (
                  <div className="flex flex-col">
                    <IconButton
                      color="primary"
                      aria-label="edit"
                      onClick={(e) => handleEdit(e, module)}
                    >
                      <EditIcon sx={{ fontSize: 18 }} />
                    </IconButton>
                    <IconButton
                      color="error"
                      aria-label="delete"
                      onClick={(e) => handleDelete(e, module.id, module.module_name)}
                    >
                      <DeleteIcon sx={{ fontSize: 18 }} />
                    </IconButton>
                  </div>
                )}
              </div>
              {/* <p className="text-[#BDBEBE]">{module.module_description}</p> */}
             <p className="text-[#BDBEBE]"> {module.module_description.length > 50
    ? module.module_description.slice(0, 50) + "..."
    : module.module_description}</p>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default ModuleGrid;