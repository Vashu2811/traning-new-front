// // store/reducers/courseReducer.js
// import * as actionTypes from "../actions/actionTypes.js";

// const initialState = {
//   courses: [],
//   loading: false,
//   error: null,
// };

// const courseReducer = (state = initialState, action) => {
//   switch (action.type) {
//     case actionTypes.GET_COURSES_REQUEST:
//       return { ...state, loading: true, error: null };
//     case actionTypes.GET_COURSES_SUCCESS:
//       return { ...state, loading: false, courses: action.payload, error: null };
//     case actionTypes.GET_COURSES_FAILURE:
//       return { ...state, loading: false, error: action.payload };
//     default:
//       return state;
//   }
// };

// export default courseReducer;

import { createSlice } from "@reduxjs/toolkit";
import { fetchAllCourses } from "store/actions/course";

const initialState = {
  loading: false,
  error: null,
  courses: [],
};

// course actions
// const courseAction = createAsyncThunk()

export const courseSlice = createSlice({
  name: "course",
  initialState,
  reducers: {
    setCourses: (state, action) => {
      state.courses = action.payload;
    },
  },
  extraReducers: (builder) => {
    // Add reducers for additional action types here, and handle loading state as needed
    builder.addCase(fetchAllCourses.pending, (state, action) => {
      // Add user to the state array
      state.loading = true;
    });
    builder.addCase(fetchAllCourses.fulfilled, (state, action) => {
      // Add user to the state array
      state.loading = false;
      state.courses = action.payload.courses;
    });
    builder.addCase(fetchAllCourses.rejected, (state, action) => {
      // Add user to the state array
      state.loading = false;
      state.error =
        process.env.NODE_ENV === "production"
          ? action.error.message
          : action.error.stack;
    });
  },
});

export default courseSlice;
