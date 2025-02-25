import { ADD_TASK, GEt_MODULES, SET_ACTIVE_HEADER, SET_ACTIVE_MENU, SET_CURRENT_COLOR, SET_CURRENT_MODE, SET_HANDLE_IS_CLICKED, SET_SCREEN_SIZE, SET_THEME_SETTINGS } from "./customerActionType";
import { initialState } from "../initialState";
  export const customerReducer = (state = initialState, action) => {
   const  { type , payload } = action;
    switch (type) {

      case ADD_TASK:
        return {
          ...state,
          name: payload
        };

      case SET_CURRENT_COLOR:
        return {
         ...state,
         currentColor: payload
        };

      case SET_CURRENT_MODE:
        return {
         ...state,
         currentMode: payload
        };

      case SET_THEME_SETTINGS:
        return {
         ...state,
         themeSettings: payload
        };

      case SET_ACTIVE_MENU:
        return {
         ...state,
         activeMenu: payload
        };

      case SET_ACTIVE_HEADER:
        return {
         ...state,
         activeHeader: payload
        };

      case SET_HANDLE_IS_CLICKED:

        const is_click = {
                          chat:false,
                          cart : false,
                          userProfile : false,
                          Notification: false,
                        }
        return {
         ...state,
         isClicked: { is_click, [payload]: true}
        };

      case SET_SCREEN_SIZE:
        return {
         ...state,
         screenSize: payload
        };

      case GEt_MODULES :
        return {
         ...state,
         modulesData: payload
        };
      default:
        return state;
    }
  };