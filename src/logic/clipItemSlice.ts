

import { createSlice, PayloadAction } from '@reduxjs/toolkit'

import { AppThunk } from './store'
import GDL from "../GoogleDriveLibrary"
import { randomstring } from "../util"
import {
  blobToUrl, urlToBlob, revokeBlob
} from "./BlobStore"

enum LoadingState {

}

export interface ClipItem {
  id: string
  name?: string
  type?: string
  content?: string
  state?: LoadingState
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
    removeCachedClipItem(state, { payload }: PayloadAction<ClipItem | string>){
      let id = (typeof payload === "string" ? payload : payload.id)
      let { type, content } = state.cachedClipItems[id]
      setTimeout(() => {
        if(type && type.startsWith("text")){

        } else if(content){
          revokeBlob(content);
        }
      });
      delete state.cachedClipItems[id];
    },
    replaceClipItemID(state, {
      payload: [ oldId, newId ]
    }: PayloadAction<[string, string]>){
      if(oldId in state.cachedClipItems){
        state.cachedClipItems[newId] = state.cachedClipItems[oldId];
        state.cachedClipItems[newId].id = newId;
        delete state.cachedClipItems[oldId]
      }
      let i = Array.prototype.indexOf.call(state.displayedClipItemsID, oldId)
      if(i >= 0){
        state.displayedClipItemsID[i] = newId;
      }
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
  replaceClipItemID,
} = clipItemSlice.actions

export default clipItemSlice.reducer

export const downloadClipItemToCache = (
  obj: ClipItem | string
): AppThunk => async dispatch => {
  let id;
  if(typeof obj === "string"){
    id = obj;
    obj = { id }
  } else{
    id = obj.id;
    console.assert(!obj.content,
        "clip item to be downloaded to cache should have empty content");
  }

  let res = await GDL.getFile(id);

  let content;
  if(obj.type && obj.type.startsWith("text")){
    content = await res.text();
  } else{
    content = blobToUrl(await res.blob());
  }
  dispatch(setCachedClipItemInfo({
    ...obj, id, content
  }))
}

export const uploadOrUpdateClipItem = (
  obj: Partial<ClipItem>, displayed: boolean = true
): AppThunk => async dispatch => {
  try{
    let content: Blob | string = obj.content;
    if(obj.type && obj.type.startsWith("text")){
      
    } else if(content && content.includes("blob:")){
      content = urlToBlob(content);
    } else{
      console.warn("clipItemSlice.ts: undetermined clip item mine type");
    }
    if(Object.prototype.hasOwnProperty.call(obj, "id") && obj.id){
      dispatch(setCachedClipItemInfo(<ClipItem>obj));
      let res = await GDL.patchToAppFolder(obj.id, content, obj.name);
      console.assert(res.id === obj.id);
    } else{
      obj.id = randomstring(16)
      dispatch(addCachedClipItem(<ClipItem>obj))
      if(displayed) dispatch(addDisplayedClipItem(obj.id))
      let res = await GDL.uploadToAppFolder(obj.name, content);
      dispatch(replaceClipItemID([obj.id, res.id]));
    }
  } catch(e){
    console.error(e);
  }
}

export const deleteClipItem = (id: string): AppThunk => async dispatch => {
  try{
    dispatch(removeCachedClipItem(id))
    dispatch(removeDisplayedClipItem(id))
    await GDL.deleteFileByID(id); // expected No-Content
  } catch(e){
    console.error(e);
  }
};

export const uploadClipItemFiles = (
    files: File[]
): AppThunk => async dispatch => {
  if(files.length > 1){
    console.warn("multiple files (variations) found, only process first");
  }
  let f = files[0];
  let obj: Partial<ClipItem> = {
    name: f.name, type: f.type,
    content: blobToUrl(f),
  };
  dispatch(uploadOrUpdateClipItem(obj));
}