import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { getUserId } from 'services/api';

// Helper function to transform API response to profile format
const transformProfileData = (data) => {
  if (!data) return null;
  return {
    picture: data.profile_image || '',
    name: data.name || '',
    intro: data.intro || '',
    user_details: data.user_details,
  };
};

// Async thunk for fetching user profile
export const fetchUserProfile = createAsyncThunk(
  'user/fetchProfile',
  async (_, { rejectWithValue }) => {
    try {
      const userId = getUserId();
      const response = await fetch(
        `https://hcomb-container-app.victoriousbush-67842c2f.eastus.azurecontainerapps.io/user_details/${userId}`
      );

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      const transformedData = transformProfileData(data.overview);

      if (!transformedData) {
        throw new Error('Invalid profile data received');
      }

      return transformedData;
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

// Async thunk for updating user profile
export const updateUserProfile = createAsyncThunk(
  'user/updateProfile',
  async (profile, { rejectWithValue }) => {
    try {
      const userId = getUserId();
      console.log('Sending profile update:', profile); // Debug log

      // Prepare the request payload
      const payload = {
        overview: {
          id: userId,
          name: profile.name || '',
          intro: profile.intro || '',
          profile_image: profile.picture || '',
          user_details: JSON.stringify(profile.user_details || {}),
        },
      };

      console.log('Update payload:', payload); // Debug log

      const response = await fetch(
        `https://hcomb-container-app.victoriousbush-67842c2f.eastus.azurecontainerapps.io/user_details/${userId}`,
        {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(payload),
        }
      );

      if (!response.ok) {
        const errorText = await response.text();
        console.error('API Error Response:', errorText); // Debug log
        throw new Error(`HTTP error! status: ${response.status}, message: ${errorText}`);
      }

      const data = await response.json();
      console.log('API Response:', data); // Debug log

      // If the API returns a different structure, adapt accordingly
      let profileData;
      if (data.overview) {
        profileData = data.overview;
      } else if (data.data) {
        profileData = data.data;
      } else {
        profileData = data;
      }

      // Transform the profile data
      const transformedData = transformProfileData(profileData);

      // Return the transformed data
      return transformedData;
    } catch (error) {
      console.error('Update profile error:', error); // Debug log
      return rejectWithValue(error.message);
    }
  }
);

// Async thunk for uploading profile picture
export const uploadProfilePicture = createAsyncThunk(
  'user/uploadProfilePicture',
  async (file, { rejectWithValue }) => {
    try {
      const formData = new FormData();
      formData.append('file', file);
      formData.append('folderName', 'profile-images');

      const response = await fetch('https://coreutilities.hcomb.ai/v1/aws/uploadFile', {
        method: 'POST',
        body: formData,
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      return data.data;
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

const userSlice = createSlice({
  name: 'user',
  initialState: {
    profile: {
      picture: '',
      name: '',
      intro: '',
      user_details: {},
    },
    loading: {
      fetchProfile: false,
      updateProfile: false,
      uploadPicture: false,
    },
    error: null,
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      // Update Profile
      .addCase(updateUserProfile.pending, (state) => {
        state.loading.updateProfile = true;
        state.error = null;
      })
      .addCase(updateUserProfile.fulfilled, (state, action) => {
        state.loading.updateProfile = false;
        state.profile = action.payload;
        state.error = null;
      })
      .addCase(updateUserProfile.rejected, (state, action) => {
        state.loading.updateProfile = false;
        state.error = action.payload;
        // Log the error payload for debugging
        console.error('Redux state error:', action.payload);
      })
      // Fetch Profile
      .addCase(fetchUserProfile.pending, (state) => {
        state.loading.fetchProfile = true;
        state.error = null;
      })
      .addCase(fetchUserProfile.fulfilled, (state, action) => {
        state.loading.fetchProfile = false;
        state.profile = action.payload;
      })
      .addCase(fetchUserProfile.rejected, (state, action) => {
        state.loading.fetchProfile = false;
        state.error = action.payload;
      })
      // Upload Profile Picture
      .addCase(uploadProfilePicture.pending, (state) => {
        state.loading.uploadPicture = true;
        state.error = null;
      })
      .addCase(uploadProfilePicture.fulfilled, (state, action) => {
        state.loading.uploadPicture = false;
        state.profile.picture = action.payload;
      })
      .addCase(uploadProfilePicture.rejected, (state, action) => {
        state.loading.uploadPicture = false;
        state.error = action.payload;
      });
  },
});

export default userSlice;