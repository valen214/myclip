
import { TopNav } from "../constants/TopNav";

const initialState = {
  clip_items: {

  },
  top_nav: {
    search: {
      value: "",
    },
  },
  text_clip_page: {
    title: "",
    content: "",
  }
};

const DataReducers = (state: any = initialState, action: any) => {
  switch(action.type){
  default:
    return state;
  }
};

export default DataReducers;
