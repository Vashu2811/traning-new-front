import React, { useEffect, useState } from 'react';
import { useDispatch } from 'react-redux';
import { upsertMentor, getMentors } from 'services/api';
import { setLoading } from '../../../store/reducers/loadingReducer';
import { ToastContainer, toast } from 'react-toastify';
import AddCircleOutlineIcon from '@mui/icons-material/AddCircleOutline';
import 'react-toastify/dist/ReactToastify.css';
import CustomButton from 'components/common/CustomButton';
import List from './List';
import AddEdit from './AddEdit';
import Assign from './Assign';

const Mentor = () => {
    const [data, setData] = useState([]);
    const [isOpen, setIsOpen] = useState(false);
    const [values, setValues] = useState({ name: '' });
    const [openAssignDialog, setOpenAssignDialog] = useState(false);
    const dispatch = useDispatch();
    const fetchMentors = async () => {
        dispatch(setLoading(true));
        try {
            const response = await getMentors();
            if (response) {
                setData(response.data.mentors);
            } else {
                toast.error('Something Went Wrong, Please Try Again.', {
                    autoClose: 3000
                });
            }
        } catch (error) {
            toast.error('Something Went Wrong, Please Try Again.', {
                autoClose: 3000
            });
        }
        dispatch(setLoading(false));
    };

    const toggleDialog = () => setIsOpen((preState) => !preState);

    const toggleAssignDialog = () => setOpenAssignDialog((preState) => !preState);

    const handleSubmit = async (values, { resetForm }) => {
        dispatch(setLoading(true));
        try {
            const response = await upsertMentor(values);
            if (response) {
                resetForm();
                toggleDialog();
                fetchMentors();
            } else {
                toast.error('Something Went Wrong, Please Try Again.', {
                    autoClose: 3000
                });
            }
        } catch (error) {
            toast.error('Something Went Wrong, Please Try Again.', {
                autoClose: 3000
            });
        }
        dispatch(setLoading(false));
    };

    const handleAdd = () => {
        setValues({name:''});
        toggleDialog();
    };

    const handleEdit = (values) => {
        setValues(values);
        toggleDialog();
    };

    const handleAssign = (values, { resetForm }) => {
        resetForm();
        toggleAssignDialog();
    };

    useEffect(() => {
        fetchMentors();
    }, []);
   
    return (
        <>
            <ToastContainer />
            <nav class="flex mx-12 my-4 lg:mt-20 md:mt-20 max-sm:mt-20 sm:mt-20" aria-label="Breadcrumb">
                Manage Mentors
            </nav>
            <div className="m-5 bg-[#1A1C1E] rounded-lg border border-[#37383A]">
                <div className="flex items-center justify-between header-title">
                    <h4>Manage Mentors</h4>
                    <div className="flex  gap-5 lg:mt-0 md:mt-0 ">
                        <CustomButton onClick={handleAdd} icon={<AddCircleOutlineIcon sx={{ mr: 1 }} />} name="Add Mentor" />
                    </div>
                </div>
                <List data={data} handleEdit={handleEdit} setData={setData} />
                <AddEdit toggleDialog={toggleDialog} isOpen={isOpen} handleSubmit={handleSubmit} initialValues={values} />
                <Assign data={data} toggleDialog={toggleAssignDialog} isOpen={openAssignDialog} handleSubmit={handleAssign} />
            </div>
        </>
    );
};

export default Mentor;
