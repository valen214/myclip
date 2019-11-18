

import { createSlice, PayloadAction } from '@reduxjs/toolkit'

interface ClipActionDialog {
  visible: boolean
  target: string
}

let initialState: ClipActionDialog = {
  visible: false,
  target: "",
}

const clipActionDialogSlice = createSlice({
  name: 'clipActionDialog',
  initialState,
  reducers: {
    setVisible(state, { payload }: PayloadAction<boolean | undefined>){
      state.visible = !!payload
    },
    setTarget(state, { payload }: PayloadAction<string>){
      state.target = payload
    },
  }
})

export const {
  setVisible,
  setTarget,
} = clipActionDialogSlice.actions

export default clipActionDialogSlice.reducer