

import StaticComponents from "../constants/StaticComponents";
import { TopNavMode } from "../constants/TopNav";

const initialState = {
  visible: false,
  title: "",
  content: "",
};

const TextClipPageReducers = (state: any = initialState, action: any) => {
  switch(action.type){
  case "SET_TEXT_CILP_PAGE_VISIBLE":
    return {
      ...state,
      visible: action.visible
    };
  case "SET_TEXT_CLIP_PAGE_TITLE":
    return {
      ...state,
      title: action.title,
    };
  case "SET_TEXT_CLIP_PAGE_CONTENT":
    return {
      ...state,
      content: action.content,
    };
  default:
    return state;
  }
};

export default TextClipPageReducers;
