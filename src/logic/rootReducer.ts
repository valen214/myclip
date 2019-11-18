




import { combineReducers } from '@reduxjs/toolkit'

import appReducers from "./appSlice"
import clipItemReducers from './clipItemSlice'
import topNavReducers from "./topNavSlice"
import textClipPageReducers from "./textClipPageSlice";
import clipActionDialogReducers from "./clipActionDialogSlice";
import createClipMenuReducers from "./createClipMenuSlice";

const rootReducer = combineReducers({
  app: appReducers,
  clipActionDialog: clipActionDialogReducers,
  clipItem: clipItemReducers,
  topNav: topNavReducers,
  textClipPage: textClipPageReducers,
  createClipMenu: createClipMenuReducers,
})

export type RootState = ReturnType<typeof rootReducer>

export default rootReducer