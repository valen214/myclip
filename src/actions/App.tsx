
import { connect } from "react-redux";

import { store } from "../index";

//@ts-ignore
import GDL from "../GoogleDriveLibrary";

async function loadClipItemID(dispatch: any){
  console.log("loading folder content");
  const files = await GDL.listAppFolder();
  const l = files.reduce((l: any, r: any) => {
    if("id" in r){
      l.push(r);
      // GDL.deleteFileByID(r.id);
    }
    return l;
  }, []);
  console.warn(`loadClipItemID(): ${l}`);
  // setItemList(l);
}


async function afterSignedIn(dispatch: any){
//@ts-ignore
  while(!("gapi" in window) || !("auth2" in window["gapi"])){
    await new Promise(resolve => setTimeout(resolve, 100));
  }
  if(!GDL.isSignedIn()){
    await new Promise(resolve => GDL.addSignInListener(resolve));
  }
  await loadClipItemID(dispatch);
  const intervalID = setInterval(() => {
    loadClipItemID(dispatch);
  }, 1000 * 60 * 10);

  return () => {
    clearInterval(intervalID);
  };
}

export function init(dispatch: any){
  console.log("/src/actions/App.tsx: init()");
  console.log("/src/components/App.tsx: useEffect(() => {}, [])");

  let signOutCleanUpPromise = afterSignedIn(dispatch);

  return () => {
    signOutCleanUpPromise.then(cleanup => cleanup());
    console.log("./components/App.tsx: useEffect(() => {}, []) clean up");
  };
}


export function AppWrapper(target: any){
  return connect(
    (state: any) => ({
      state,
    }),
    (dispatch: any) => {
      console.log("/src/actions/App.tsx: new dispatch instance")
      return ({
      init: () => init(dispatch),
    })
    },
  )(target);
};
