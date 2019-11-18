

import { createSlice, PayloadAction } from '@reduxjs/toolkit'

import { AppThunk } from './store'
import GDL from "../GoogleDriveLibrary"

export interface ClipItem {
  id: string
  name?: string
  type?: string
  content?: string | Blob
}

interface DisplayedClipItemsID {
  displayedClipItemsID: [] | string[]
}

interface CachedClipItems {
  cachedClipItems: { [key: string]: ClipItem }
}

type ClipItemState = CachedClipItems & DisplayedClipItemsID;

let initialState: ClipItemState = {
  displayedClipItemsID: [],
  cachedClipItems: {},
}

const clipItemSlice = createSlice({
  name: 'clipItem',
  initialState,
  reducers: {
    addDisplayedClipItem(state, action: PayloadAction<ClipItem | string>){
      let id: string, name;
      if(typeof action.payload === "string"){
        id = action.payload;
      } else{
        ({ id, name } = action.payload);
      }
      state.displayedClipItemsID = [...state.displayedClipItemsID, id];
    },
    setDisplayedClipItems(state, action: PayloadAction<string[]>){
      state.displayedClipItemsID = action.payload
    },
    removeDisplayedClipItem(state, action: PayloadAction<string>){
      state.displayedClipItemsID =
          state.displayedClipItemsID.filter(id => id !== action.payload);
    },
    addCachedClipItem(state, { payload }: PayloadAction<ClipItem>){
      state.cachedClipItems[payload.id] = payload
    },
    setCachedClipItemInfo(state, { payload }: PayloadAction<ClipItem>){
      let obj: ClipItem = { id: payload.id }
      // seriously might cause bug, old, invalid cache
      Object.assign(obj, state.cachedClipItems[payload.id], payload)
      state.cachedClipItems[payload.id] = obj;
    },
    removeCachedClipItem(state, action: PayloadAction<ClipItem | string>){
      let id = (typeof action.payload === "string" ?
          action.payload : action.payload.id)
      delete state.cachedClipItems[id];
    },
  }
})

export const {
  addDisplayedClipItem,
  setDisplayedClipItems,
  removeDisplayedClipItem,
  addCachedClipItem,
  setCachedClipItemInfo,
  removeCachedClipItem,
} = clipItemSlice.actions

export default clipItemSlice.reducer

export const downloadClipItemToCache = (
  id: string
): AppThunk => async dispatch => {
  let text = await GDL.getFileAsText(id);
  dispatch(setCachedClipItemInfo({
    id, content: text
  }))
}

export const uploadClipItem = (
  obj: Partial<ClipItem>, displayed: boolean = true
): AppThunk => async dispatch => {
  try{
    if(Object.prototype.hasOwnProperty.call(obj, "id") && obj.id){
      dispatch(setCachedClipItemInfo(<ClipItem>obj));
      let res = await GDL.patchToAppFolder(obj.id, obj.content);
      console.assert(res.id === obj.id);
    } else{
      let res = await GDL.uploadToAppFolder(obj.name, obj.content);
      obj.id = res.id;
      dispatch(addCachedClipItem(<ClipItem>obj))
      if(displayed) dispatch(addDisplayedClipItem(obj.id))
    }
  } catch(e){
    console.error(e);
  }
}

export const deleteClipItem = (id: string): AppThunk => async dispatch => {
  try{
    dispatch(removeCachedClipItem(id))
    dispatch(removeDisplayedClipItem(id))
    await GDL.deleteFileByID(id);
  } catch(e){
    console.error(e);
  }
};