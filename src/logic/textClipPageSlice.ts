

import { createSlice, PayloadAction } from '@reduxjs/toolkit'

import { AppThunk } from './store'
import GDL from "../GoogleDriveLibrary"

type TextClipPageTarget = string | object;

export type PositionRect = {
  top: number
  left: number
  width: number
  height: number
}

interface TextClipPageState {
  visible: boolean | PositionRect
  target: TextClipPageTarget | null
  title: string
  content: string
}

let initialState: TextClipPageState = {
  visible: false,
  target: null,
  title: "",
  content: "",
}

const textClipPageSlice = createSlice({
  name: 'textClipPage',
  initialState,
  reducers: {
    setAll(state, { payload }: PayloadAction<TextClipPageState>){
      Object.assign(state, payload);
    },
    setVisible(state, { payload }: PayloadAction<boolean | PositionRect>){
      state.visible = payload
    },
    setTarget(state, { payload }: PayloadAction<TextClipPageTarget>){
      state.target = payload
    },
    setTitle(state, { payload }: PayloadAction<string>){
      state.title = payload
    },
    setContent(state, { payload }: PayloadAction<string>){
      state.content = payload;
    },
  }
})

export const {
  setAll,
  setVisible,
  setTarget,
  setTitle,
  setContent,
} = textClipPageSlice.actions

export default textClipPageSlice.reducer


