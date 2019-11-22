

import { createSlice, PayloadAction } from '@reduxjs/toolkit'
import { ThunkAction, ThunkDispatch } from 'redux-thunk'
import { AnyAction } from "redux";

import { AppThunk } from './store'
import GDL from "../GoogleDriveLibrary"
import {
  ClipItem,
  addDisplayedClipItem,
  downloadClipItemToCache,
  uploadClipItemFiles,
} from './clipItemSlice'

import {
  setAll,
} from "./textClipPageSlice"

interface AppState {
  signedIn: boolean
}
type DispatchType = ThunkDispatch<{}, {}, AnyAction>
type PasteEvent = React.SyntheticEvent<HTMLElement, ClipboardEvent> & {
  clipboardData: DataTransfer
}

let initialState: AppState = {
  signedIn: false,
}

const appSlice = createSlice({
  name: 'app',
  initialState,
  reducers: {
    setSignedIn(state, { payload }: PayloadAction<boolean | undefined>){
      state.signedIn = !!payload
    },
  }
})

export const {
  setSignedIn,
} = appSlice.actions

export default appSlice.reducer


export const signIn = (): AppThunk => async dispatch => {
  if(GDL.isSignedIn()){
    console.log("already signed in!");
  } else{
    let isSignedIn = await GDL.signIn();
    dispatch(setSignedIn(isSignedIn))
  }
}

async function initLoadClipItems(dispatch: DispatchType){
  try{
    console.log("loading folder content");
    const files = await GDL.listAppFolder();
    files.forEach(({
      id, name, mimeType
    }: { id: string, name: string, mimeType: string}) => {
      let obj: ClipItem = { id, name, type: mimeType };
      dispatch(addDisplayedClipItem(obj));
      dispatch(downloadClipItemToCache(obj));
    })

  } catch(e){
    console.error(e);
  }

}

async function loadAndAuthen(dispatch: DispatchType){
  //@ts-ignore
  while(!("gapi" in window) || !("auth2" in window["gapi"])){
    await new Promise(resolve => setTimeout(resolve, 100));
  }


  if(!GDL.isSignedIn()){
    await new Promise(resolve => GDL.addSignInListener(
      (signedIn: boolean) => (signedIn && resolve())
    ));
  }
  
  dispatch(setSignedIn(true));
}


export const onPaste = (e: PasteEvent): AppThunk => async dispatch => {
  console.log("pasting:", e);
  let {
    currentTarget,
    nativeEvent,
    clipboardData: data
  } = e

  /*
https://www.w3.org/TR/html51/editing.html#the-datatransferitemlist-interface
  */
  let text = data.getData("text");
  let items: DataTransferItemList, f;
  if(!text){
    items = data && data.items;
    // console.log(items[0], items[1], items.length);
    let length = items.length;
    if(length > 1){
      console.log(
          "multiple kinds found in DataTransferItemList,",
          "prioritise file instead of string");
    }
    for(let i = 0; i < length; ++i){
      let item = items[i]
      let { kind, type } = item
      if(kind === "file"){
        // FILE CAN ONLY BE ACCESSED ONCE!
        f = item.getAsFile();
        console.log("retrieve one file from DataTransferItemList:\n" +
            `type: ${f.type}; name: ${f.name}; f:`, f);
      }
    }
  }
  if(f){
    dispatch(uploadClipItemFiles([f]))
  } else{
    if(!text){
      text = await new Promise(resolve =>
          Array.prototype.find.call(items, (e: DataTransferItem) => (
              e.kind === "string" && e.type.match(/^text/)
          )).getAsString(resolve))
    }
    dispatch(setAll({
      target: "", title: "", content: text, visible: true,
    }))
  }
};

async function initPasteListener(dispatch: DispatchType){
  /*
  async function onPaste(e){
      
    var items = data && data.items;
    let text = data.getData("text");
    if(text){
        printInfo(-1, "string", text);
        PasteBoard.add("text/plain", text);
        return;
    }
    if(!items || !items.length){
        console.warn("paste event triggered but no items received");
        return;
    }
    console.log("data trasnsfer list:", items);
    for(const [i, item] of Array.prototype.entries.call(items)){
        if(item.kind === "string" && item.type.match(/^text/)){
            text = await new Promise(resolve => item.getAsString(resolve));
            // text = await item.getAsString(txt => ({ then(){ return txt; } }));
            printInfo(i, "string", text);
        } else if(item.kind == "file"){
            var f = item.getAsFile();
            printInfo(i, "file<buffer>", f);
            PasteBoard.add(f.type, f, f.name);
        }
    }
  window.addEventListener("paste", onPaste);
  */
}

export const init = (): AppThunk => async dispatch => {
  console.log("/src/logic/appSlice.tsx: init()");

  await loadAndAuthen(dispatch)
  initLoadClipItems(dispatch)
};