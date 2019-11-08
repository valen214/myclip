
import { connect } from "react-redux";

import { TopNavMode } from "../constants/TopNav";

export function setTopNavSearchInput(dispatch: any, value: string){
  dispatch({
    type: "TOP_NAV_SEARCH_INPUT_CHANGE",
    value,
  });
}


export function onSignInButtonClick(dispatch: any, e: any){

};

export function onSearchButtonClick(dispatch: any, e: any){
  dispatch({
    type: "SET_TOP_NAV_MODE",
    mode: TopNavMode.input,
  });
};

export function onSearchInputChange(dispatch: any,
    e: React.FormEvent<HTMLInputElement>){
  setTopNavSearchInput(dispatch, e.currentTarget.value);
};

function onSearchDoneClick(dispatch: any, e: any){
  setTopNavSearchInput(dispatch, "");
  dispatch({
    type: "SET_TOP_NAV_MODE",
    mode: TopNavMode.normal,
  });
}


export function TopNavWrapper(target: any){
  return connect(
    (state: any) => ({
      mode: state.ui.top_nav.mode,
      searchInput: state.data.top_nav.value,
      placeholder: state,
    }),
    (dispatch: any) => ({
      onSignInButtonClick: (e: any) => onSignInButtonClick(dispatch, e),
      onSearchButtonClick: (e: any) => onSearchButtonClick(dispatch, e),

      onSearchInputChange: (e: any) => onSearchInputChange(dispatch, e),
      onSearchDoneClick: (e: any) => onSearchDoneClick(dispatch, e),
    })
  )(target);
};
