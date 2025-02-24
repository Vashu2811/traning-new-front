import React from 'react';
import { Button } from '@mui/material';

const CustomButton = ({ icon, name, styles, ...props }) => {
    return (
        <Button
            {...props}
            sx={
                styles || {
                    background: '#5B53E7',
                    borderColor: '#5B53E7',
                    color: '#FFF',
                    fontFamily: 'Poppins, sans-serif',
                    '&:hover': {
                        background: '#5B53E7',
                        borderColor: '#5B53E7'
                    }
                }
            }>
            {icon}
            {name}
        </Button>
    );
};

export default CustomButton;
