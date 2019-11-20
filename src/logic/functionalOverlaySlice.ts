

import { createSlice, PayloadAction } from '@reduxjs/toolkit'

type FunctionalOverlay = {
  visible: boolean
  type: string
  content: string
  background?: string
}

let initialState: FunctionalOverlay = {
  visible: false,
  type: "",
  content: "",
}

const functionalOverlaySlice = createSlice({
  name: 'functionOverlay',
  initialState,
  reducers: {
    setVisible(state, { payload }: PayloadAction<boolean | undefined>){
      state.visible = !!payload
    },
    setContent(state, {
            payload: { content, type }
        }: PayloadAction<{ content: string, type: string}>){
      state.type = type
      state.content = content
    },
    setBackground(state, { payload }: PayloadAction<string>){
      state.background = payload
    }
  }
})

export const {
  setVisible,
  setContent,
  setBackground,
} = functionalOverlaySlice.actions

export default functionalOverlaySlice.reducer