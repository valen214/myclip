




import { combineReducers } from '@reduxjs/toolkit'

import appReducers from "./appSlice"
import clipItemReducers from './clipItemSlice'
import topNavReducers from "./topNavSlice"
import textClipPageReducers from "./textClipPageSlice";
import clipActionDialogReducers from "./clipActionDialogSlice";
import createClipMenuReducers from "./createClipMenuSlice";
import functionalOverlay from "./functionalOverlaySlice" // yes I am lazy

const rootReducer = combineReducers({
  app: appReducers,
  clipActionDialog: clipActionDialogReducers,
  clipItem: clipItemReducers,
  topNav: topNavReducers,
  textClipPage: textClipPageReducers,
  createClipMenu: createClipMenuReducers,
  functionalOverlay,
})

export type RootState = ReturnType<typeof rootReducer>

export default rootReducer