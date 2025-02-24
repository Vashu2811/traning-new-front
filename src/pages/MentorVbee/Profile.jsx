import { LoadingButton } from "@mui/lab";
import React, { useState, useEffect } from "react";
import { toast, ToastContainer } from "react-toastify";
import {
  fetchUserProfile,
  updateUserProfile,
  uploadProfilePicture,
} from "../../store/reducers/userSlice";
import { useDispatch, useSelector } from "react-redux";

const getInitials = (name) => {
  return (
    name
      ?.match(/(^\w\w?|\b\w)?/g) // Extract first letter of each word
      .join("")
      .match(/(^\w|\w$)?/g) // Keep only the first and last letter if multiple initials exist
      .join("")
      .toUpperCase() || ""
  );
};

const Profile = () => {
  const dispatch = useDispatch();
  const { profile, loading } = useSelector((state) => state.user);
  const [localProfile, setLocalProfile] = useState(null);
  const [imageError, setImageError] = useState(false);
  const initials = getInitials(localProfile.name);
  const [isPictureChanged, setIsPictureChanged] = useState(false);

  // Prevent scrolling when component mounts
  useEffect(() => {
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = "unset";
    };
  }, []);

  // Fetch profile data and initialize local state ONLY ONCE
  useEffect(() => {
    dispatch(fetchUserProfile())
      .unwrap()
      .then((fetchedProfile) => {
        // Only set local profile if it hasn't been initialized
        if (!localProfile) {
          setLocalProfile(fetchedProfile);
        }
      })
      .catch((error) => {
        toast.error("Failed to fetch profile data.");
        console.error("Error fetching profile data:", error);
      });
  }, [dispatch]); // Remove profile from dependencies

  // Handle input changes
  const handleChange = (e) => {
    const { name, value } = e.target;
    setLocalProfile((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleUserDetailsChange = (e) => {
    const { name, value } = e.target;
    setLocalProfile((prev) => ({
      ...prev,
      user_details: {
        ...(prev?.user_details || {}),
        [name]: value,
      },
    }));
  };

  const MAX_WIDTH = 800;
  const MAX_HEIGHT = 800;
  const QUALITY = 0.5;
  const MAX_FILE_SIZE = 1024 * 1024;

  const compressImage = (file) => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.readAsDataURL(file);

      reader.onload = (event) => {
        const img = new Image();
        img.src = event.target.result;

        img.onload = () => {
          // Calculate new dimensions while maintaining aspect ratio
          let width = img.width;
          let height = img.height;

          if (width > height) {
            if (width > MAX_WIDTH) {
              height = Math.round((height * MAX_WIDTH) / width);
              width = MAX_WIDTH;
            }
          } else {
            if (height > MAX_HEIGHT) {
              width = Math.round((width * MAX_HEIGHT) / height);
              height = MAX_HEIGHT;
            }
          }

          const canvas = document.createElement("canvas");
          canvas.width = width;
          canvas.height = height;

          const ctx = canvas.getContext("2d");
          ctx.drawImage(img, 0, 0, width, height);

          // Convert canvas to blob
          canvas.toBlob(
            (blob) => {
              if (blob.size > MAX_FILE_SIZE) {
                // If still too large, reduce quality
                const newQuality = (MAX_FILE_SIZE / blob.size) * QUALITY;
                canvas.toBlob(
                  (finalBlob) => resolve(finalBlob),
                  "image/jpeg",
                  newQuality
                );
              } else {
                resolve(blob);
              }
            },
            "image/jpeg",
            QUALITY
          );
        };

        img.onerror = (error) => reject(error);
      };

      reader.onerror = (error) => reject(error);
    });
  };

  // Handle profile picture change
  const handlePictureChange = async (e) => {
    const file = e.target.files[0];
    if (file) {
      try {
        // Show loading state if needed
        const compressedBlob = await compressImage(file);

        // Convert blob to File object
        const compressedFile = new File([compressedBlob], file.name, {
          type: "image/jpeg",
          lastModified: Date.now(),
        });

        const result = await dispatch(
          uploadProfilePicture(compressedFile)
        ).unwrap();
        // Update local profile with new picture URL
        setLocalProfile((prev) => ({
          ...prev,
          picture: result, // Adjust according to your API response
        }));
        setIsPictureChanged(true);
      } catch (error) {
        toast.error("Failed to upload image. Please try again.");
        console.error("Error uploading image:", error);
      }
    }
  };

  const handleUpdateProfile = async () => {
    try {
      dispatch(updateUserProfile(localProfile)).unwrap();
      toast.success("Profile updated successfully!");
      await dispatch(fetchUserProfile());
      setIsPictureChanged(false);
    } catch (error) {
      console.error("Profile update error:", error);
      toast.error(`Failed to update profile: ${error}`);
    }
  };

  useEffect(() => {
    if (!localProfile && profile) {
      setLocalProfile(profile);
    }
  }, [profile, localProfile]);

  const hasTextChanges = () => {
    if (!localProfile || !profile) return false;

    return (
      localProfile.name !== profile.name ||
      localProfile.intro !== profile.intro ||
      JSON.stringify(localProfile.user_details) !==
        JSON.stringify(profile.user_details)
    );
  };

  const hasChanges = hasTextChanges() || isPictureChanged;

  if (!localProfile) {
    return (
      <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
        <div className="loader border-t-4 border-white w-12 h-12 rounded-full animate-spin"></div>
      </div>
    );
  }
  return (
    <div className="bg-[#292B2D] text-white min-h-screen">
      {loading.fetchProfile && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
          <div className="loader border-t-4 border-white w-12 h-12 rounded-full animate-spin"></div>
        </div>
      )}
      <ToastContainer />
      <nav
        className="flex mx-12 my-4 lg:mt-20 md:mt-20 max-sm:mt-20 sm:mt-20"
        aria-label="Breadcrumb"
      >
        Profile Setting
      </nav>
      <div className="mx-12 mt-8">
        <div className="bg-[#1A1C1E] p-8 rounded-lg shadow-lg">
          <div className="flex flex-col items-center mb-6">
            <div className="relative w-32 h-32">
              {imageError || !localProfile.picture ? (
                <div className="w-32 h-32 rounded-full bg-[#5b52e7] flex items-center justify-center text-white font-bold text-3xl">
                  {initials}
                </div>
              ) : (
                <img
                  className="w-32 h-32 rounded-full object-cover"
                  src={localProfile.picture}
                  alt="Profile"
                  onError={() => setImageError(true)}
                />
              )}

              <div className="absolute bottom-0 right-4">
                <label
                  htmlFor="profile-picture"
                  className="px-2 py-1 bg-white text-sm text-[#5b52e7] rounded-full cursor-pointer"
                >
                  Picture
                </label>
                <input
                  id="profile-picture"
                  type="file"
                  accept="image/*"
                  onChange={handlePictureChange}
                  className="hidden"
                />
              </div>
            </div>
          </div>

          <div className="w-full mb-4">
            <label className="block mb-1 text-sm font-semibold text-gray-400">
              Name
            </label>
            <input
              type="text"
              name="name"
              value={localProfile.name || ""}
              onChange={handleChange}
              className="w-full p-2 bg-[#292B2D] text-white rounded-md border border-white focus:outline-none focus:border-[#5b52e7]"
              placeholder="Enter your name"
            />
          </div>

          <div className="w-full mb-4">
            <label className="block mb-1 text-sm font-semibold text-gray-400">
              Role
            </label>
            <input
              type="text"
              name="role"
              value={localProfile?.user_details?.role || ""}
              onChange={handleUserDetailsChange}
              className="w-full p-2 bg-[#292B2D] text-white rounded-md border border-white focus:outline-none focus:border-[#5b52e7]"
              placeholder="Enter your role"
            />
          </div>

          <div className="w-full mb-6">
            <label className="block mb-1 text-sm font-semibold text-gray-400">
              Introduction
            </label>
            <textarea
              name="intro"
              value={localProfile.intro || ""}
              onChange={handleChange}
              className="w-full p-2 bg-[#292B2D] text-white rounded-md border border-white focus:outline-none focus:border-[#5b52e7] h-40"
              placeholder="Enter your introduction"
            />
          </div>

          {/* Update Profile Button */}
          <div className="flex justify-end">
            <LoadingButton
              variant="contained"
              loading={loading.updateProfile}
              disabled={!hasChanges}
              onClick={handleUpdateProfile}
              sx={{
                px: 3,
                py: 1,
                backgroundColor: hasChanges ? "#5b52e7" : "#a0a0a0",
                color: "white",
                borderRadius: "0.375rem",
                "&:hover": {
                  backgroundColor: hasChanges ? "#5247e2" : "#a0a0a0",
                },
                "&.Mui-disabled": {
                  color: "#f0f0f0",
                },
                display: "flex",
                alignItems: "center",
                border: 1,
                borderColor: hasChanges ? "#5b52e7" : "white",
              }}
            >
              Update Profile
            </LoadingButton>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Profile;
