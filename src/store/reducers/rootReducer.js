// reducers/index.js

import { combineReducers } from "@reduxjs/toolkit";

// Import your reducers
import courses from "./courseReducer.js"; // Assuming you have a course reducer
import loading from "./loadingReducer.js";
import userSlice from "./userSlice.js";

// Combine reducers
const rootReducer = combineReducers({
  //   courses: coursesReducer,
  [courses.name]: courses.reducer,
  [loading.name]: loading.reducer,
  [userSlice.name]: userSlice.reducer,
  // Add other reducers here if you have any
});

export default rootReducer;
