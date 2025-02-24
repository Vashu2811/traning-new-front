import { createAsyncThunk } from "@reduxjs/toolkit";

import { getCourses } from "../../../services/api";
import { setLoading } from "../../reducers/loadingReducer";

const fetchAllCourses = createAsyncThunk(
  "courses/fetchAllCourses",
  async (id, { rejectWithValue,dispatch }) => {
    //dispatch(setLoading(true));
    const response = await getCourses();
    //dispatch(setLoading(false));
    return response.data;
  }
);

export {
  fetchAllCourses,
  // others
};
