
import { connect } from "react-redux";

import gql from "graphql-tag";

//@ts-ignore
import GDL from "../GoogleDriveLibrary";
import { client } from "../ApolloHelper";
import { startListeningToChanges } from "./GoogleDriveFileHelper";

async function afterSignedIn(): Promise<Function> {
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
  let cleanup_func = startListeningToChanges();
  return cleanup_func;
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
