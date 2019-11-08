

import StaticComponents from "../constants/StaticComponents";
import { TopNavMode } from "../constants/TopNav";

const initialState = {
  top_nav: {
    visible: true,
    mode: TopNavMode.normal,
    placeholder: "Search ...",
  },
  text_clip_page: {
    visible: false,
  },
  sign_in_button: {
    visible: true,
  }
};

const UIReducers = (state: any = initialState, action: any) => {
  switch(action.type){
  case "SHOW_TEXT_PAGE":
    return {
      ...state,
      text_clip_page: {
        visible: true
      }
    };
  case "SET_TEXT_CILP_PAGE_VISIBLE":
    return {
      ...state,
      text_clip_page: {
        ...state.text_clip_page,
        visible: action.visible
      }
    };
  case "SET_TOP_NAV_MODE":
    return {
      ...state,
      top_nav: {
        ...state.top_nav,
        mode: action.mode == TopNavMode.input ?
            TopNavMode.input : TopNavMode.normal,
      }
    };
  case "SET_TOP_NAV_PLACEHOLDER":
    return {
      ...state,
      top_nav: {
        ...state.top_nav,
        placeholder: action.placeholder,
      }
    };
  default:
    return state;
  }
};

export default UIReducers;
