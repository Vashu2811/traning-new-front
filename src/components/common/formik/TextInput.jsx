import React from 'react';
import { useField } from 'formik';
import { TextField, MenuItem } from '@mui/material';

const TextInput = ({ name, label, options = [], optionKeys = [], select = false, ...props }) => {
    const [field, meta] = useField(name);

    return (
        <TextField
            {...field}
            {...props}
            label={label}
            select={select}
            error={meta.touched && Boolean(meta.error)}
            helperText={meta.touched && meta.error}
            fullWidth
            sx={{
                mb: 2,
                '& input': {
                    color: '#BDBEBE !important',
                    fontFamily: 'Poppins, sans-serif'
                },
                '& .MuiOutlinedInput-notchedOutline': {
                    borderColor: '#37383A !important'
                },
                '& .MuiInputLabel-outlined': {
                    color: '#BDBEBE !important'
                },
                '& .MuiSvgIcon-root': {
                    color: '#BDBEBE !important' // Arrow color changed to white
                }
            }}>
            {select &&
                options.map((option) => (
                    <MenuItem key={option.value} value={option[optionKeys[0]]}>
                        {option[optionKeys[1]]}
                    </MenuItem>
                ))}
        </TextField>
    );
};

export default TextInput;
