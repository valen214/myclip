

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
};

const UIReducers = (state: any = initialState, action: any) => {
  console.log("./src/reducers/UIReducers(): ");
  switch(action.type){
  case "SHOW_TEXT_PAGE":
    return Object.assign({}, state, {
      text_clip_page: { visible: true }
    });
  case "SET_TOP_NAV_MODE":
    return Object.assign({}, state,
        Object.assign({}, state.top_nav, {
          mode: action.mode == TopNavMode.input ?
              TopNavMode.input : TopNavMode.normal,
    }));
  case "SET_TOP_NAV_PLACEHOLDER":
    return Object.assign({}, state,
        Object.assign({}, state.top_nav, {
          placeholder: action.placeholder,
    }));
  default:
    return state;
  }
};

export default UIReducers;
