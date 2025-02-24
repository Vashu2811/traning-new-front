import { Box, Modal, TextField, Typography } from "@mui/material"
import { Button } from "components"
import { useState } from "react";

const ModuleAddEditModel = ({showAddModal, setShowAddModal, selectedModuleId, addNewModule, handleInputChange, newModule}) => {
    return (
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
            {selectedModuleId ? 'Edit' : 'Add New'} Module
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
              "& input": { color: "#BDBEBE !important", fontFamily: "Poppins, sans-serif" },
              "& .MuiOutlinedInput-notchedOutline": { borderColor: "#37383A !important" },
              "& .MuiInputLabel-outlined": { color: "#BDBEBE !important" },
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
              onClick={addNewModule}
              sx={{ background: "#282B2F", color: "#BDBEBE", fontFamily: "Poppins, sans-serif", "&:hover": { background: "#282B2F" } }}
            >
              {selectedModuleId ? 'Edit' : 'Add'}
            </Button>
          </div>
        </Box>
      </Modal>
    )
}

export default ModuleAddEditModel