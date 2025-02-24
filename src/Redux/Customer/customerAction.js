import { ADD_TASK } from "./customerActionType";

export const addTodo = (text) => {
    return {
      type: ADD_TASK,
      payload: text
    };
  };
