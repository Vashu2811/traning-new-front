import React from 'react';
import * as Yup from 'yup';
import { Formik, Form } from 'formik';
import { Dialog, DialogActions, DialogContent, DialogTitle } from '@mui/material';
import CustomButton from 'components/common/CustomButton';
import TextInput from 'components/common/formik/TextInput';

const Assign = ({ data, toggleDialog, isOpen, handleSubmit, editCourseId }) => {
    const initialValues = {
        trainer_id: '',
        trainer_name: '',
        mentor_name: ''
    };

    const validationSchema = Yup.object({
        mentor_name: Yup.string().required('This filed is required'),
        trainer_id: Yup.string().required('This filed is required'),
        trainer_name: Yup.string().required('This filed is required')
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
                Assign Mentor
            </DialogTitle>
            <Formik initialValues={initialValues} validationSchema={validationSchema} onSubmit={handleSubmit}>
                {({ isSubmitting }) => (
                    <Form>
                        <DialogContent sx={{ background: '#242728', color: '#BDBEBE' }}>
                            <TextInput name="trainer_id" label="Trainer Id" />
                            <TextInput name="trainer_name" label="Trainer Name" />
                            <TextInput name="mentor_name" label="Mentor Name" select options={data} optionKeys={['id', 'course_name']} />
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
                                name="Assign"
                            />
                        </DialogActions>
                    </Form>
                )}
            </Formik>
        </Dialog>
    );
};

export default Assign;
