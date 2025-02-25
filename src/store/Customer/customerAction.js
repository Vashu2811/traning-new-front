import { ADD_TASK, SET_ACTIVE_HEADER, SET_ACTIVE_MENU, SET_CURRENT_COLOR, SET_CURRENT_MODE, SET_HANDLE_IS_CLICKED, SET_SCREEN_SIZE, SET_THEME_SETTINGS } from "./customerActionType";

export const addTodo = (text) => {
  return {
    type: ADD_TASK,
    payload: text
  };
};

export const setCurrentColor = (color) => {
  return {
    type: SET_CURRENT_COLOR,
    payload: color
  };
};

export const setCurrentMode = (mode) => {
  return {
    type: SET_CURRENT_MODE,
    payload: mode
  };
};
export const setThemeSettings = (settings) => {
  return {
    type: SET_THEME_SETTINGS,
    payload: settings
  };
};

export const setActiveMenu = (menu) => {
  return {
    type: SET_ACTIVE_MENU,
    payload: menu
  };
};

export const setActiveHeader = (header) => {
  return {
    type: SET_ACTIVE_HEADER,
    payload: header
  };
};

export const setHandleIsClicked = (clicked) => {
  return {
    type: SET_HANDLE_IS_CLICKED,
    payload: clicked
  };
};

export const setScreenSize = (size) => {
  return {
    type: SET_SCREEN_SIZE,
    payload: size
  };
};

