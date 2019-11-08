
import { TopNav } from "../constants/TopNav";

const initialState = {
  clip_items: {

  },
  top_nav: {
    search: {
      value: "",
    },
  },
};

const DataReducers = (state: any = initialState, action: any) => {
  switch(action.type){
  case "TOP_NAV_SEARCH_INPUT_CHANGE":
    return Object.assign({}, state, {
      top_nav: {
        search: {
          value: action.value,
        }
      }
    });
  default:
    return state;
  }
};

export default DataReducers;
