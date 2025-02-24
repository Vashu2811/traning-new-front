import { bindActionCreators } from "redux";
import { useDispatch, useSelector } from "react-redux";

// actions
import { courseReducer } from "store/reducers";

export const useReduxActions = () => {
  const dispatch = useDispatch();

  return bindActionCreators(
    {
      ...courseReducer.actions,
      // others
    },
    dispatch
  );
};

export const useReduxState = (selector) => {
  return useSelector(selector);
};
