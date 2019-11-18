

import { createSlice, PayloadAction } from '@reduxjs/toolkit'

import { AppThunk } from './store'
import GDL from "../GoogleDriveLibrary"
import {
  ClipItem,
  addDisplayedClipItem,
  addCachedClipItem,
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
    setSignedIn(state, action: PayloadAction<boolean | undefined>){
      state.signedIn = !!action.payload
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
      (signedIn: boolean) => signedIn && resolve()
    ));
  }
  
  try{
    console.log("loading folder content");
    const files = await GDL.listAppFolder();
    files.forEach(({ id = undefined, name }: Partial<ClipItem>) => {
      if(typeof id === "string"){
        dispatch(addDisplayedClipItem({ id, name }));
        GDL.getFileAsText(id).then(text => {
          dispatch(addCachedClipItem({
            id,
            name,
            content: text
          }));
        });
      } else{
        console.error("file retrieved from server missing id");
      }
    })

  } catch(e){
    console.error(e);
  }

};