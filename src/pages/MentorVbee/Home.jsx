import { CircularProgress } from "@mui/material";
import React, { useEffect, useState } from "react";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { getUserId } from "services/api";

const Home = () => {
  const [prompt, setPrompt] = useState("");
  const [profile, setProfile] = useState({
    picture: "",
    name: "",
    intro: "",
  });
  const userId = getUserId();
  const [isLoader, setIsLoader] = useState(false);

  // Fetch user data on component mount
  useEffect(() => {
    fetchPromptData();
    fetchUserData();
  }, []);

  const fetchUserData = async () => {
    const userId = getUserId();
    const apiUrl = `https://hcomb-container-app.victoriousbush-67842c2f.eastus.azurecontainerapps.io/user_details/${userId}`;
    try {
      const response = await fetch(apiUrl);
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      const data = await response.json();
      // Update profile state with API response
      const { overview } = data;
      const fetchedProfile = {
        picture: overview.profile_image,
        name: overview.name,
        intro: overview.intro,
      };
      setProfile(fetchedProfile);
    } catch (error) {
      console.error("Error fetching profile data:", error);
    }
  };

  const fetchPromptData = async () => {
    setIsLoader(true)
    const apiUrl = `https://hcomb-container-app.victoriousbush-67842c2f.eastus.azurecontainerapps.io/assistance_by_user_id/${userId}`;
    try {
      const response = await fetch(apiUrl);
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      const data = await response.json();
      setPrompt(data?.overview?.prompt || ""); // Assuming API returns a "prompt" field
    } catch (error) {
      console.error("Error fetching data:", error);
      toast.error("Failed to fetch data. Please try again later.");
    } finally {
      setIsLoader(false)
    }
  };

  const handleUpdatePrompt = async () => {
    setIsLoader(true)
    const apiUrl = `https://api.hcomb.ai/v1/open-ai/create-assistants`;

    const payload = {
      name: profile.name || 'assistants',
      instructions: prompt,
      user_id: userId,
    };

    try {
      const response = await fetch(apiUrl, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(payload),
      });
      setIsLoader(false)
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      toast.success("Instruction updated successfully!");
      fetchUserData(); // Refresh data after updating
    } catch (error) {
      console.error("Error updating prompt:", error);
      toast.error("Failed to update Instruction. Please try again.");
    }
  };

  return (
    <>
      <ToastContainer />
      <nav
        className="flex mx-12 my-4 lg:mt-20 md:mt-20 max-sm:mt-20 sm:mt-20"
        aria-label="Breadcrumb"
      >
        Instruction
      </nav>
      <div className="mx-12 mt-8">
        {isLoader ? (
          <div className="h-96 w-full bg-[#1A1C1E] rounded-md flex items-center justify-center">
            <div className="flex flex-col items-center space-y-4">
              <CircularProgress sx={(theme) => ({ color: 'white' })} />
              <span className="text-white">Loading instructions...</span>
            </div>
          </div>
        ) : (
          <textarea
            style={{ height: "400px", width: "100%" }}
            className="p-4 border border-white bg-[#1A1C1E] text-white rounded-md 
                     focus:outline-none focus:border-[#5b52e7]
                     placeholder-gray-500"
            placeholder="Enter your instructions here..."
            value={prompt}
            onChange={(e) => setPrompt(e.target.value)}
          />
        )}
        <div className="flex justify-end mt-4">
          <button
            className="px-6 py-2 bg-[#5b52e7] text-white rounded-md hover:bg-[#5247e2] text-center"
            disabled={isLoader}
            onClick={handleUpdatePrompt}
          >
            {isLoader ?
              <CircularProgress size={28} thickness={4} sx={(theme) => ({ color: 'white' })} />
              : 'Update Instruction'
            }
          </button>
        </div>
      </div>
    </>
  );
};

export default Home;