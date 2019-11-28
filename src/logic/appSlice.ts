

import { createSlice, PayloadAction } from '@reduxjs/toolkit'
import { ThunkAction, ThunkDispatch } from 'redux-thunk'
import { AnyAction } from "redux";

import { AppThunk } from './store'
import GDL from "../GoogleDriveLibrary"
import {
  uploadClipItemFiles,
  loadFolder,
} from './clipItemSlice'

import {
  setAll,
} from "./textClipPageSlice"

interface AppState {
  signedIn: boolean
  authLoaded: boolean
  showTutorial: boolean
}
type DispatchType = ThunkDispatch<{}, {}, AnyAction>
type PasteEvent = React.SyntheticEvent<HTMLElement, ClipboardEvent> & {
  clipboardData: DataTransfer
}

let initialState: AppState = {
  signedIn: false,
  authLoaded: false,
  showTutorial: false,
}

const appSlice = createSlice({
  name: 'app',
  initialState,
  reducers: {
    setAuthLoaded(state, { payload }: PayloadAction<boolean>){
      state.authLoaded = !!payload
    },
    setSignedIn(state, { payload }: PayloadAction<boolean | undefined>){
      state.signedIn = !!payload
    },
    setShowTutorial(state, { payload }: PayloadAction<boolean>){
      state.showTutorial = !!payload
    },
  }
})

export const {
  setAuthLoaded,
  setSignedIn,
  setShowTutorial,
} = appSlice.actions

export default appSlice.reducer


export const signIn = (): AppThunk => async dispatch => {
  if(GDL.isSignedIn()){
    console.log("already signed in!");
  } else{
    let isSignedIn = await GDL.signIn();
    dispatch(setSignedIn(isSignedIn))
  }
}

async function loadAndAuthen(dispatch: DispatchType){
  //@ts-ignore
  while(!("gapi" in window) || !("auth2" in window["gapi"])){
    await new Promise(resolve => setTimeout(resolve, 100));
  }


  if(!GDL.isSignedIn()){
    await new Promise(resolve => GDL.addSignInListener(
      (signedIn: boolean) => (signedIn && resolve())
    ));
  }
  
  dispatch(setSignedIn(true));
}


export const onPaste = (e: PasteEvent): AppThunk =>
    async (dispatch, getState) => {
  if(!getState().app.signedIn) return;

  let {
    target,
    nativeEvent,
    clipboardData: data
  } = e

  if(( target instanceof HTMLInputElement )
  || ( target instanceof HTMLTextAreaElement )){
    console.log("pasting on input element, skip global paste handler");
    return;
  }
  
  /*
https://www.w3.org/TR/html51/editing.html#the-datatransferitemlist-interface
  */
  let text = data.getData("text");
  let items: DataTransferItemList, f;
  if(!text){
    items = data && data.items;
    // console.log(items[0], items[1], items.length);
    let length = items.length;
    if(length > 1){
      console.log(
          "multiple item variations %d found in DataTransferItemList,",
          items.length, "prioritise file instead of string");
    }
    for(let i = 0; i < length; ++i){
      let item = items[i]
      let { kind, type } = item
      if(kind === "file"){
        // FILE CAN ONLY BE ACCESSED ONCE!
        f = item.getAsFile();
        console.log("retrieve one file from DataTransferItemList:\n" +
            `type: ${f.type}; name: ${f.name}; f:`, f);
      }
    }
  }
  if(f){
    dispatch(uploadClipItemFiles([f]))
  } else{
    if(!text){
      text = await new Promise(resolve =>
          Array.prototype.find.call(items, (e: DataTransferItem) => (
              e.kind === "string" && e.type.match(/^text/)
          )).getAsString(resolve))
    }
    dispatch(setAll({
      target: "", title: "", content: text, visible: true,
    }))
  }
};

export const init = (): AppThunk => async dispatch => {
  console.log("/src/logic/appSlice.tsx: init()");

  await loadAndAuthen(dispatch)
  dispatch(setAuthLoaded(true))
  dispatch(loadFolder("appDataFolder"))
};