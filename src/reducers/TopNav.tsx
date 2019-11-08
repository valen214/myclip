
import { TopNav, TopNavMode } from "../constants/TopNav";

const initialState = {
  visible: true,
  mode: TopNavMode.normal,
  placeholder: "Search ...",
  search: {
    value: "",
  },
};


export default function TopNavReducers(state: any = initialState, action: any){
  switch(action.type){
  case "SET_TOP_NAV_MODE":
    return {
      ...state,
      mode: action.mode == TopNavMode.input ?
          TopNavMode.input : TopNavMode.normal,
    };
  case "SET_TOP_NAV_PLACEHOLDER":
    return {
      ...state,
      placeholder: action.placeholder,
    };
  case "TOP_NAV_SEARCH_INPUT_CHANGE":
    console.log("search:", action.value);
    return {
      ...state,
      search: {
        value: action.value,
      }
    };
  default:
    return state;
  }
}
