

import { combineReducers } from "redux";

import TextClipPage from "./TextClipPage";
import TopNav from "./TopNav";


export default combineReducers({
  top_nav: TopNav,
  text_clip_page: TextClipPage,
});

/*
https://itnext.io/advanced-react-redux-techniques-
how-to-use-refs-on-connected-components-e27b55c06e34

https://reactjs.org/docs/hooks-reference.html#useref

  console.log("./src/reducers/UIReducers():")
  console.log("state:", JSON.stringify(state, null, 4));
  console.log("action:", JSON.stringify(action, null, 4));

*/
