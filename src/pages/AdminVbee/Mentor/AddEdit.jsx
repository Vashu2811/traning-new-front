import React from 'react';
import * as Yup from 'yup';
import { Formik, Form } from 'formik';
import { Dialog, DialogActions, DialogContent, DialogTitle } from '@mui/material';
import CustomButton from 'components/common/CustomButton';
import TextInput from 'components/common/formik/TextInput';

const AddEdit = ({ initialValues, toggleDialog, isOpen, handleSubmit }) => {
    const validationSchema = Yup.object({
        name: Yup.string().required('This filed is required')
    });

    return (
        <Dialog open={isOpen} onClose={toggleDialog}>
            <DialogTitle
                sx={{
                    py: 2,
                    background: '#242728',
                    color: '#BDBEBE',
                    fontFamily: 'Poppins, sans-serif'
                }}>
                {initialValues?.id ? 'Edit Mentor' : 'Add Mentor'}
            </DialogTitle>
            <Formik initialValues={initialValues} validationSchema={validationSchema} onSubmit={handleSubmit}>
                {({ isSubmitting }) => (
                    <Form>
                        <DialogContent sx={{ background: '#242728', color: '#BDBEBE' }}>
                            <TextInput name="name" label="Name" />
                        </DialogContent>

                        <DialogActions sx={{ background: '#242728', color: '#BDBEBE' }}>
                            <CustomButton
                                onClick={toggleDialog}
                                styles={{
                                    mr: 2,
                                    mb: 4,
                                    color: '#BDBEBE',
                                    fontFamily: 'Poppins, sans-serif',
                                    '&:hover': {
                                        background: '#282B2F'
                                    }
                                }}
                                name="Cancel"
                            />
                            <CustomButton
                                type="submit"
                                disabled={isSubmitting}
                                variant="contained"
                                styles={{
                                    mr: 2,
                                    mb: 4,
                                    color: '#BDBEBE',
                                    fontFamily: 'Poppins, sans-serif',
                                    '&:hover': {
                                        background: '#282B2F'
                                    }
                                }}
                                name={initialValues?.id ? 'Save' : 'Add'}
                            />
                        </DialogActions>
                    </Form>
                )}
            </Formik>
        </Dialog>
    );
};

export default AddEdit;
