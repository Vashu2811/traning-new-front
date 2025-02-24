import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { getMentorData } from 'services/api';
import { Skeleton } from '@mui/material';
import MentorCard from './MentorCard';
import { ToastContainer } from 'react-toastify';

// Skeleton card component for loading state
const MentorCardSkeleton = () => (
  <div className="bg-[#232528] rounded-lg p-4 h-[280px]">
    <div className="flex items-center space-x-3 mb-4">
      <Skeleton 
        variant="circular" 
        width={50} 
        height={50} 
        sx={{ bgcolor: '#747c83' }}
      />
      <Skeleton 
        variant="text" 
        width={120} 
        height={24} 
        sx={{ bgcolor: '#747c83' }}
      />
    </div>
    <Skeleton 
      variant="rectangular" 
      height={100} 
      sx={{ bgcolor: '#747c83', mb: 2 }}
    />
    <Skeleton 
      variant="text"
      width="60%"
      height={20}
      sx={{ bgcolor: '#747c83', mb: 1 }}
    />
    <Skeleton 
      variant="text" 
      width="40%" 
      height={20} 
      sx={{ bgcolor: '#747c83', mb: 2 }}
    />
    <Skeleton 
      variant="rectangular"
      height={36}
      width="100%"
      sx={{ bgcolor: '#747c83' }}
    />
  </div>
);

function MentorList() {
  const navigate = useNavigate();
  const [mentors, setMentors] = useState([]);
  const [loading, setLoading] = useState(true);

  const handleCardClick = (mentor) => {
    navigate(`/training/chat`, {
      state: {
        mentor: mentor
      }
    });
  };

  const getMentorDataa = async () => {
    try {
      setLoading(true);
      const response = await getMentorData();
      if (response?.mentors) {
        setMentors(response.mentors);
      }
    } catch (error) {
      console.error("Error fetching mentors data:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    getMentorDataa();
  }, []);

  return (
    <>
      <ToastContainer />
      <div className=" bg-[#1A1C1E] rounded-lg m-2">
  <div className="header-title ">
    <h4 className="text-white text-lg sm:text-xl md:text-2xl font-semibold">
      Mentors
    </h4>
  </div>

  <div className="">
    <div className="p-2 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 sm:gap-6">
      {loading
        ? [...Array(8)].map((_, index) => <MentorCardSkeleton key={index} />)
        : mentors.map((mentor) => (
            <MentorCard
              key={mentor.assistance_id}
              mentor={mentor}
              onMessageClick={handleCardClick}
            />
          ))}
    </div>
  </div>
</div>
    </>
  );
}

export default MentorList;