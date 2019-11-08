
import { connect } from "react-redux";

//@ts-ignore
import GDL from "../GoogleDriveLibrary";

import { TopNavMode } from "../constants/TopNav";

export function setTopNavSearchInput(dispatch: any, value: string){
  dispatch({ type: "TOP_NAV_SEARCH_INPUT_CHANGE", value });
}
export function setTopNavMode(dispatch: any, mode: TopNavMode){
  dispatch({ type: "SET_TOP_NAV_MODE", mode });
}


export function onSignInButtonClick(dispatch: any, e: any){
  console.log(`GDL.isSignedIn(): ${GDL.isSignedIn()}`);
  if(GDL.isSignedIn()){
    console.log("already signed in!");
  } else{
    (async () => {
      let res = await GDL.signIn();
      console.log("Signed in! res:", res);
    })();
    // loadFilesID();
  }
};

export function onSearchButtonClick(dispatch: any, e: any){
  setTopNavMode(dispatch, TopNavMode.input);
};


export function onSearchCancelClick(dispatch: any, e: any){
  setTopNavSearchInput(dispatch, "");
  setTopNavMode(dispatch, TopNavMode.normal);
}

export function onSearchInputChange(dispatch: any,
    e: React.FormEvent<HTMLInputElement>){
  setTopNavSearchInput(dispatch, e.currentTarget.value);
};

function onSearchDoneClick(dispatch: any, e: any){
  setTopNavSearchInput(dispatch, "");
  setTopNavMode(dispatch, TopNavMode.normal);
}


export function TopNavWrapper(target: any){
  return connect(
    (state: any) => ({
      mode: state.top_nav.mode,
      searchInput: state.top_nav.search.value,
      placeholder: state.top_nav.placeholder,
    }),
    (dispatch: any) => ({
      onSignInButtonClick: (e: any) => onSignInButtonClick(dispatch, e),
      onSearchButtonClick: (e: any) => onSearchButtonClick(dispatch, e),

      onSearchCancelClick: (e: any) => onSearchCancelClick(dispatch, e),
      onSearchInputChange: (e: any) => onSearchInputChange(dispatch, e),
      onSearchDoneClick: (e: any) => onSearchDoneClick(dispatch, e),
    })
  )(target);
};
