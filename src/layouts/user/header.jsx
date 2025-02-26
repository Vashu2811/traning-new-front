import React, {useState, useEffect} from "react";
const header = () => {
  const transformProfileData = (data) => {
    if (!data) return null;

    return {
      email: data.email || "N/A",
      role: data.role || "Unknown",
    };
  };
  const UserProfile = () => {
    const [profile, setProfile] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
      const fetchUserProfile = async () => {
        try {
          const userId = localStorage.getItem("userId");
          if (!userId) {
            throw new Error("User ID not found in localStorage");
          }
          const response = await fetch(
            `https://hcomb-container-app.victoriousbush-67842c2f.eastus.azurecontainerapps.io/user_details/${userId}`
          );
          if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
          }
          const data = await response.json();
          const transformedData = transformProfileData(data.overview);
          if (!transformedData) {
            throw new Error("Invalid profile data received");
          }
          setProfile(transformedData);
        } catch (error) {
          setError(error.message);
        } finally {
          setLoading(false);
        }
      };
      fetchUserProfile();
    }, []);
    if (loading) {
      return <div>Loading...</div>;
    }
    if (error) {
      return <div>Error: {error}</div>;
    }
    const getInitials = (email) => {
      if (!email) return "";
      const parts = email.split("@")[0].split(".");
      return parts.length > 1
        ? `${parts[0][0].toUpperCase()}${parts[1][0].toUpperCase()}`
        : `${email[0].toUpperCase()}${email[1].toUpperCase()}`;
    };
    return (
      <div className="profile-containerborder  rounded-lg  p-2">
          {profile ? (
            <div className="flex items-center">
              <div
                className="flex items-center justify-center w-12 h-12  bg-[#5B53E7] text-white font-bold rounded-full"
                style={{ fontSize: "14px" }}
              >
                {getInitials(profile.email)}
              </div>
              <div className="ml-3">
                <p className="text-[14px] font-semibold text-white">
                  {profile.email}
                </p>
                <p className="text-sm text-gray-200 overflow-hidden whitespace-nowrap text-ellipsis w-32">
                  {profile.role}
                </p>
              </div>
            </div>
          ) : (
            <div>No profile data available</div>
          )}
        </div>
    );
  };

  return (
    <header className={"flex justify-end bg-[#1A1C1E] border-b border-[#37383A] dark:bg-main-dark-bg w-full "}>
     <UserProfile />
    </header>
  );
};
export default header;
