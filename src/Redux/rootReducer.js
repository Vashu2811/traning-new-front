import { combineReducers } from "redux";
import { customerReducer } from "./Customer/customerReducer";

const rootReducer = combineReducers({
  customer: customerReducer 
});

export default rootReducer;