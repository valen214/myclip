

import StaticComponents from "../constants/StaticComponents";

const initialState = {
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
  default:
    return state;
  }
};

export default UIReducers;
