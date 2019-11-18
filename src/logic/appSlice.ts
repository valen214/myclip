

import { createSlice, PayloadAction } from '@reduxjs/toolkit'

import { AppThunk } from './store'
import GDL from "../GoogleDriveLibrary"

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