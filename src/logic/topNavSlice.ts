

import { createSlice, PayloadAction } from '@reduxjs/toolkit'

export enum TopNavMode {
  input,
  normal
}

interface TopNav {
  visible: boolean
  mode: TopNavMode
  searchString: string
}

let initialState: TopNav = {
  visible: true,
  mode: TopNavMode.normal,
  searchString: "",
}

const topNavSlice = createSlice({
  name: 'topNav',
  initialState,
  reducers: {
    setVisible(state, action: PayloadAction<boolean | undefined>){
      state.visible = !!action.payload
    },
    setMode(state, action: PayloadAction<TopNavMode>){
      state.mode = action.payload
    },
    setSearchString(state, action: PayloadAction<string>){
      state.searchString = action.payload
    },
  }
})

export const {
  setVisible,
  setMode,
  setSearchString,
} = topNavSlice.actions

export default topNavSlice.reducer