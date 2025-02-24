import { ADD_TASK, CURRENT_COLOR, CURRENT_MODE } from "./customerActionType";

const initialState = {
    name: 'hardik',
    currentColor : '#03C9D7',
    currentMode : 'Light'
  };
  
  export const customerReducer = (state = initialState, action) => {
   const  { type , payload } = action;
    switch (type) {
      case ADD_TASK:
        return {
          ...state,
          name: payload
        };
      case CURRENT_COLOR:
        return {
         ...state,
         currentColor: payload
        };
      case CURRENT_MODE:
        return {
         ...state,
         currentMode: payload
        };
      default:
        return state;
    }
  };