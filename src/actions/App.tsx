
import { connect } from "react-redux";

import gql from "graphql-tag";

//@ts-ignore
import GDL from "../GoogleDriveLibrary";
import { client } from "../ApolloHelper";
import { GET_CLIP_ITEMS } from "../constants/Query";

async function loadClipItemID(){
  try{
    console.log("loading folder content");
    const files = await GDL.listAppFolder();
    const l = files.reduce((l: any, r: any) => {
      if("id" in r){
        r.__typename = "ClipItem";
        l.push(r);
        // GDL.deleteFileByID(r.id);
      }
      return l;
    }, []);
    console.warn(`loadClipItemID(): ${JSON.stringify(l)}`);
    
    

    client.writeQuery({
      query: GET_CLIP_ITEMS,
      data: {
        clip_items: l,
      }
    });
    /*
    setItemList({
      variables: {
        list: l
      }
    });
    */
  } catch(e){
    console.error(e);
  }
}


async function afterSignedIn(){
//@ts-ignore
  while(!("gapi" in window) || !("auth2" in window["gapi"])){
    await new Promise(resolve => setTimeout(resolve, 100));
  }
  if(!GDL.isSignedIn()){
    await new Promise(resolve => GDL.addSignInListener(
      (signedIn: boolean) => {
        if(signedIn){
          resolve();
        }
      }
    ));
  }
  await loadClipItemID();
  const intervalID = setInterval(() => {
    loadClipItemID();
  }, 1000 * 60 * 10);

  return () => {
    clearInterval(intervalID);
  };
}

export function init(){
  console.log("/src/actions/App.tsx: init()");
  console.log("/src/components/App.tsx: useEffect(() => {}, [])");

  let signOutCleanUpPromise = afterSignedIn();

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
      return {}
    },
  )(target);
};
