import { ADD_TASK } from "./customerActionType";

const initialState = {
    name: 'hardik'
  };
  
  export const customerReducer = (state = initialState, action) => {
   const  { type , payload } = action;
    switch (type) {
      case ADD_TASK:
        return {
          ...state,
          name: payload
        };
      default:
        return state;
    }
  };