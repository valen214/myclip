

import { createSlice, PayloadAction } from '@reduxjs/toolkit'

interface CreateClipMenu {
  button_visible: boolean
  menu_visible: boolean
  target: string
}

let initialState: CreateClipMenu = {
  button_visible: true,
  menu_visible: false,
  target: "",
}

const createClipMenuSlice = createSlice({
  name: 'clipActionDialog',
  initialState,
  reducers: {
    setButtonVisible(state, { payload }: PayloadAction<boolean | undefined>){
      state.button_visible = !!payload
    },
    setMenuVisible(state, { payload }: PayloadAction<boolean | undefined>){
      state.menu_visible = !!payload
    },
    setTarget(state, { payload }: PayloadAction<string>){
      state.target = payload
    },
  }
})

export const {
  setButtonVisible,
  setMenuVisible,
  setTarget,
} = createClipMenuSlice.actions

export default createClipMenuSlice.reducer