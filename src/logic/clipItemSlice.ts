
import { createSlice, PayloadAction } from '@reduxjs/toolkit'
import { ThunkAction, ThunkDispatch } from "redux-thunk"

import { AppThunk } from './store'
import GDL from "../GoogleDriveLibrary"
import { randomstring } from "../util"
import {
  blobToUrl, urlToBlob, revokeBlob
} from "./BlobStore"

enum LoadingState {

}

export const FOLDER = 'application/vnd.google-apps.folder'

export interface ClipItem {
  id: string
  name?: string
  type?: string
  content?: string
  objectURL?: string
  parent?: string

  state?: LoadingState
  md5?: string

  children?: Array<string>
}

type ClipItemState = {
  path: Array<string>
  displayedClipItemsID: Array<string>
  cache: { [id: string]: ClipItem }
}

let initialState: ClipItemState = {
  path: ["appDataFolder"],
  displayedClipItemsID: [],
  cache: {},
}

const clipItemSlice = createSlice({
  name: 'clipItem',
  initialState,
  reducers: {
    addDisplayedClipItem(state, action: PayloadAction<ClipItem | string>){
      let id: string;
      if(typeof action.payload === "string"){
        id = action.payload;
      } else{
        ({ id } = action.payload);
      }
      if(state.displayedClipItemsID.indexOf(id) >= 0) return;
      state.displayedClipItemsID = [...state.displayedClipItemsID, id];
    },
    setDisplayedClipItems(state, action: PayloadAction<string[]>){
      state.displayedClipItemsID = action.payload
    },
    removeDisplayedClipItem(state, action: PayloadAction<string>){
      state.displayedClipItemsID =
          state.displayedClipItemsID.filter(id => id !== action.payload);
    },
    removeCachedItem(state, { payload }: PayloadAction<string>){
      delete state.cache[payload]
    },
    setPath(state, { payload }: PayloadAction<string[]>){
      state.path = payload
    },
    setItems(state, { payload }: PayloadAction<{ [id: string]: ClipItem }>){
      Object.entries(payload).forEach(([id, item]) => {
          if(state.cache[id]){
            Object.assign(state.cache[id], item)
          } else{
            state.cache[id] = item;
          }
      });
    },
    setItem(state, { payload }: PayloadAction<ClipItem>){
      if(state.cache[payload.id]){
        Object.assign(state.cache[payload.id], payload)
      } else{
        state.cache[payload.id] = payload
      }
    },
  }
})

export const {
  addDisplayedClipItem,
  setDisplayedClipItems,
  removeDisplayedClipItem,
  removeCachedItem,
  setPath,
  setItems,
  setItem,
} = clipItemSlice.actions

export default clipItemSlice.reducer

export const downloadItem = (
  id: string
): AppThunk => async dispatch => {
  let id;

  let metaPromise = window.gapi.client.drive.files.get({
    fields: "id, mimeType, md5Checksum, parents",
    // + ", thumbnailLink, webContentLink, webViewLink",
    fileId: "1kE6QPJg0TdcJmYqSxSrBVDfrqOM5pukx_09VivyN0lIjDv-jfw"
  })
  let resPromise = GDL.getFile(id);

  let [ {
    id: _id, mimeType: type, md5Checksum: md5
  }, res ] = await Promise.all([ metaPromise, resPromise ])

  console.assert(_id === id)
  console.assert(type !== FOLDER)

  let content, objectURL;
  if(type && type.startsWith("text")){
    content = await res.text();
  } else{
    objectURL = blobToUrl(await res.blob());
  }
  dispatch(setItem({
    id, type, md5, content, objectURL,
  }))
}

const getUsableID = async (): Promise<string> => {
  let res = await window.gapi.client.drive.files.generateIds({
    space: "appDataFolder", count: 1
  })
  return res.result.ids[0]
};

export const uploadItem = (
  obj: {
    id?: string
    name?: string
    type?: string
    content?: string | Blob
    objectURL?: string
  }, displayed: boolean = true
): AppThunk => async (dispatch, getState) => {
  try{
    let parent = getState().clipItem.path.slice(-1)[0]
    if(!obj.id){
      let id = await getUsableID()
      obj.id = id
    }
    let content;
    if((obj.content) instanceof Blob){
      obj.objectURL = blobToUrl(obj.content)
      obj.content = undefined;
    } else{
      content = obj.objectURL ? urlToBlob(obj.objectURL) : obj.content
    }
    dispatch(setItem(<ClipItem>obj))
    if(displayed) dispatch(addDisplayedClipItem(obj.id))
    
    let res = await GDL.uploadToAppFolder({
      name, parent, content, id: obj.id
    });
    dispatch(setItem({
      id: parent,
      children: [...getState().clipItem.cache[parent].children, obj.id]
    }))
    dispatch(setItem({
      id: obj.id,
      type: res.mimeType,
    }))

  } catch(e){
    console.error(e);
  }
}

export const deleteItem = (
  id: string
): AppThunk => async (dispatch, getState) => {
  try{

    let cache = getState().clipItem.cache
    let obj = cache[id]
    let url = obj.objectURL
    if(url) revokeBlob(url)
    let parent = obj.parent
    if(parent && cache[parent]) dispatch(setItem({
      id: parent,
      children: cache[parent].children.filter(_id => _id !== id)
    }))
    dispatch(removeCachedItem(id))
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
    objectURL: blobToUrl(f),
  };
  dispatch(uploadItem(obj));
}

export const loadFolder = (
  parent: string
): AppThunk => async (dispatch, getState) => {
  try{
    let parentItem = getState().clipItem.cache[parent]
    if(parentItem){
      dispatch(setDisplayedClipItems(parentItem.children))
      return
    }
    const {
      files
    }: {
      files: Array<{
        id: string
        name: string
        mimeType: string
      }>
    } = await GDL.listAppFolder({
      parent, fields: "files(id, name, mimeType)"
    });

    let id_list = files.map(({ id }) => id)
    dispatch(setDisplayedClipItems(id_list));
    files.forEach(({
        id, name, mimeType
    }) => {
      dispatch(setItem({
          id, name, type: mimeType, parent
      }));
      (async () => {
        if(mimeType.startsWith("text")){
          let text = await GDL.getFileAsText(id)
          dispatch(setItem({
            id, content: text
          }));
        } else if(mimeType !== FOLDER){
          let blob = await GDL.getFileAsBlob(id)
          dispatch(setItem({
            id, objectURL: blobToUrl(blob)
          }))
        }
      })();
    });

    dispatch(setItem({
      id: parent,
      type: FOLDER,
      children: id_list,
    }))
  } catch(e){
    console.error(e);
  }
}

export const createFolder = (
  name: string
): AppThunk => async (dispatch, getState) => {
  let parent = getState().clipItem.path.slice(-1)[0]
  let { id, mimeType } = await GDL.createFolder(name, parent)
  let obj = { id, name, type: mimeType }
  dispatch(addDisplayedClipItem(obj))
  dispatch(setItem(obj))
}

export const changeParents = (
  path: string[]
): AppThunk => async (dispatch, getState) => {
  let last_parent = path[path.length - 1]
  dispatch(loadFolder(last_parent))
  dispatch(setPath(path))
}