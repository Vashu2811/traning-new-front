import { ADD_TASK, CURRENT_COLOR, CURRENT_MODE } from "./customerActionType";

export const addTodo = (text) => {
    return {
      type: ADD_TASK,
      payload: text
    };
  };

export const setCurrentColor = (color) => {
  return {
    type: CURRENT_COLOR,
    payload: color
  };
}

export const setCurrentMode = (mode) => { 
  return {
    type: CURRENT_MODE,
    payload: mode
  };
}
