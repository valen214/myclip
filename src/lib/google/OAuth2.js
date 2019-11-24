
/*global gapi*/

export function isSignedIn(){
  try{
    return gapi.auth2.getAuthInstance().isSigned().get();
  } catch(e){
    return false;
  }
}

export async function init({
  apiKey, clientId, discoveryDocs, scope
}){
  try{
    if(!Object.prototype.hasOwnProperty.call(window, "gapi")){
      console.warn("gapi not found, importing script");
      await new Promise(resolve => {
        let s = document.createElement("script");
        s.src = "https://apis.google.com/js/api.js";
        s.onload = resolve;
        document.body.appendChild(s);
      });
    }

    console.log("%cstart initializing gapi", "color: #33d");
    await new Promise(resolve => gapi.load("client:auth2", resolve));
    console.log("$callow redirect url:",
        "color: #33d", String(window.location));
    await gapi.client.init({
        apiKey,
        clientId,
        discoveryDocs,
        scope,
        "cookiepolicy": "single_host_origin",
        "ux_mode": "redirect",
        "redirect_url": String(window.location),
    });
    console.log("%cfinished initializing gapi", "color: #afa");

  } catch(e){
    console.error(e);
  }
}
let initPromise = init({
  apiKey: "AIzaSyCp8Rwg-WfaxkOz5MfdOGaXJI9R2ZXb5GM",
  clientId: "948862535396-9ficl2trtv77ekjn3k2p1sg04kofmj67" +
      ".apps.googleusercontent.com",
  discoveryDocs: [
      "https://www.googleapis.com/discovery/v1/apis/drive/v3/rest"
  ],
  scope: [
      "https://www.googleapis.com/auth/drive",
      "https://www.googleapis.com/auth/drive.appfolder"
  ].join(" ")
});

export const signInPromise = (async () => {
  await initPromise;
  if(!isSignedIn()){
    await new Promise(resolve => {
      addSignInListener(  (signedIn) => { if(signedIn) resolve(); }  )
    });
  }
})();

export async function addSignInListener(func){
  await initPromise;
  gapi.auth2.getAuthInstance().isSignedIn.listen(func);
}

export async function signIn(){
  await initPromise;
  return gapi.auth2.getAuthInstance().signIn();
}

export async function signOut(){
  await initPromise;
  return gapi.auth2.getAuthInstance().signOut();
}

export default {
  isSignedIn,
  addSignInListener,
  signIn,
  signOut,
}