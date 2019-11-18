

import { createSlice, PayloadAction } from '@reduxjs/toolkit'

import { AppThunk } from './store'
import GDL from "../GoogleDriveLibrary"
import {
  ClipItem,
  addDisplayedClipItem,
  downloadClipItemToCache,
} from './clipItemSlice'

interface AppState {
  signedIn: boolean
}

let initialState: AppState = {
  signedIn: false,
}

const appSlice = createSlice({
  name: 'app',
  initialState,
  reducers: {
    setSignedIn(state, { payload }: PayloadAction<boolean | undefined>){
      state.signedIn = !!payload
    },
  }
})

export const {
  setSignedIn,
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

export const init = (): AppThunk => async dispatch => {
  console.log("/src/logic/appSlice.tsx: init()");

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

  try{
    console.log("loading folder content");
    const files = await GDL.listAppFolder();
    files.forEach(({
      id, name, mimeType
    }: { id: string, name: string, mimeType: string}) => {
      let obj: ClipItem = { id, name, type: mimeType };
      dispatch(addDisplayedClipItem(obj));
      dispatch(downloadClipItemToCache(obj));
    })

  } catch(e){
    console.error(e);
  }

};