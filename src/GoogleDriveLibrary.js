
/*global gapi*/

/**
https://github.com/valen214/new-app/blob/master/src/system/__google_api_library.js
**/
const API_KEY = "AIzaSyCp8Rwg-WfaxkOz5MfdOGaXJI9R2ZXb5GM";
const CLIENT_ID =
    "948862535396-9ficl2trtv77ekjn3k2p1sg04kofmj67" +
    ".apps.googleusercontent.com";
const DISCOVERY_DOCS = [
    "https://www.googleapis.com/discovery/v1/apis/drive/v3/rest"
];
const SCOPE = [
    "https://www.googleapis.com/auth/drive",
    "https://www.googleapis.com/auth/drive.appfolder"
].join(" ");

let enableLogging = false;
const log = (...args) => {
  if(enableLogging){
    console["log"](...args);
  }
};

const UPLOAD_URL = "https://www.googleapis.com/upload/drive/v3/files"

function importScript(url, callback, isAsync = false){
    const script = document.createElement("script");
    script.src = url;
    script.async = isAsync;
    if(callback instanceof Function) script.onload = callback;
    document.body.appendChild(script);
}

const initialized = (async () => {
    try{
        if("gapi" in window){
          log("gapi is loaded");
        } else{
            console.warn("'gapi' undefined, importing gapi script");
            await new Promise(ok =>{
                importScript("https://apis.google.com/js/api.js", ok);
            });
        }
        log("start initializing gapi");
        await new Promise(ok => gapi.load("client:auth2", ok));
        log("allow redirect url:", String(window.location));
        await gapi.client.init({
            "apiKey": API_KEY,
            "clientId": CLIENT_ID,
            "discoveryDocs": DISCOVERY_DOCS,
            "scope": SCOPE,
            "cookiepolicy": "single_host_origin",
            "ux_mode": "redirect",
            "redirect_uri": String(window.location),
            /*
            remember to set 'Authorized redirect URIs' in
https://console.developers.google.com/apis/credentials/oauthclient/
948862535396-9ficl2trtv77ekjn3k2p1sg04kofmj67.apps.googleusercontent.com?
project=main-custom-project&folder&organizationId
            */
        });
        log("%cfinished initializing gapi", "color: #afd");
        return true;
    } catch(e){
        console.error(e);
    }
})();

function getAccessToken(){
  return window.gapi.auth2.getAuthInstance(
      ).currentUser.get().getAuthResponse().access_token
}

async function waitTillAuth2Initialized(){
  while(!("gapi" in window) || !("auth2" in gapi)){
    await new Promise(resolve => setTimeout(resolve, 50));
  }
}
export function isSignedIn(){
    try{
        return gapi.auth2.getAuthInstance().isSignedIn.get();
    } catch(e){
        return false;
    }
}
export async function addSignInListener(func){
  await waitTillAuth2Initialized();
  gapi.auth2.getAuthInstance().isSignedIn.listen(func);
}
export async function removeSignInListener(func){
  func
}

export async function signIn(){
  await waitTillAuth2Initialized();
  return gapi.auth2.getAuthInstance().signIn();
}

export async function signOut(){
  await waitTillAuth2Initialized();
  return gapi.auth2.getAuthInstance().signOut();
}

export async function listFiles(parent="root"){
    await initialized;
    let res;
    try{
        log('list app folder');
        res = await gapi.client.drive.files.list({
            spaces: "drive",
            q: `'${parent}' in parents`,
            maxResults: 100,
            fields: "nextPageToken, files(id, name)",
        });
        let files = res.result.files;
        if(files && files.length){
            files.forEach(file =>{
                log("found file:", file.name, file.id);
            });
        } else{
            log('no file found');
        }
        return files;
    } catch(e){
        console.error(`listFiles(): ${e}` + "\n\n" +
          "server response:", res);
    }
}


export async function listAppFolder({
  parent = "appDataFolder",
  fields = "nextPageToken, files(id, name, mimeType)"
} = {}){
    await initialized;
    let res;
    try{
        console.log('list app folder: parent:', parent, "fields:", fields);
        res = await gapi.client.drive.files.list({
            spaces: "appDataFolder",
            q: `'${parent}' in parents`,
            maxResults: 100,
            fields,
        });
        let files = res.result.files;
        if(files && files.length){
            files.forEach(file =>{
                log("found file:", file.name, file.id);
            });
        } else{
            log('no file found');
        }
        return res.result;
    } catch(e){
        console.error("listAppFolder():", e, "\n\n" +
          "server response:", res);
    }
}

export async function uploadToAppFolder({
  name, content, parent, id,
}){
    await initialized;

    let formData = new FormData();
    formData.append("meta", new Blob([JSON.stringify({
        name,
        "parents": [parent || "appDataFolder"],
        id,
    })], { type: "application/json; charset=UTF-8" }));
    formData.append("body", await new Response(content).blob(), name);

    let res = await fetch(UPLOAD_URL +
        "?uploadType=multipart&fields=id,mimeType", {
        "method": "POST",
        "headers": {
            "Authorization": "Bearer " + getAccessToken(),
        },
        body: formData,
    });
    let obj = await res.json();
    log("file uploaded to app folder: res:", obj);
    return obj;
}
export async function patchToAppFolder(id, data, filename){
    await initialized;
    
    let formData = new FormData();
    formData.append("meta", new Blob([JSON.stringify({
        "name": filename,
        // "mimeType": "application/vnd.google-apps.folder",
        // "parents": ["appDataFolder"],
    })], { type: "application/json; charset=UTF-8" }));
    formData.append("body", await new Response(data).blob());

    let res = await fetch(UPLOAD_URL + "/" + id +
            "?uploadType=multipart&fields=id", {
            "method": "PATCH",
            "headers": {
                "Authorization": "Bearer " + getAccessToken(),
            },
            body: formData,
    });
    let obj = await res.json();
    log("file uploaded to app folder: res:", obj);
    return obj;
}

export async function createFolder(name, parent){
    await initialized;

    let formData = new FormData();
    formData.append("meta", new Blob([JSON.stringify({
        "name": name,
        'mimeType': 'application/vnd.google-apps.folder',
        "parents": [parent || "appDataFolder"],
    })], { type: "application/json; charset=UTF-8" }));

    let res = await fetch(UPLOAD_URL +
            "?uploadType=multipart&fields=id,mimeType", {
            "method": "POST",
            "headers": {
                "Authorization": "Bearer " + getAccessToken(),
            },
            body: formData,
    });
    let obj = await res.json();
    log("file uploaded to app folder: res:", obj);
    return obj;
}

export async function getFile(id){
    if(!id){
      throw "empty fild id!";
    }
    log(`GoogleLibrary.js: getFile(${id})`);
    await initialized;
    try{
        let res = await fetch(
            `https://www.googleapis.com/drive/v3/files/${id}?alt=media`, {
            "method": "GET",
            "headers": {
                "Authorization": "Bearer " + getAccessToken(),
                "Accept": "text/plain,application/json;q=0.9,*/*;q=0.8",
            },
        });
        log(res);
        return res;
    } catch(e){
        console.error(e);
    }
}
export async function getFileAsText(id){
    let res = await getFile(id);
    let text = await res.text();
    log(`getFileAsText(${id}): ${text}`);
    return text;
}
export async function getFileAsBlob(id){
    let res = await getFile(id);
    let blob = await res.blob();
    log(`getFileAsBlob(${id}): ${blob}`);
    return blob;
}

export async function deleteFileByID(id){
    await initialized;
    try{
      let res = await gapi.client.drive.files.delete({
          "fileId": id
      })
      log("deleted id:%s completed, res:", id, res);
      console.assert(res.status === 204); // No-Content
      return res
    } catch(e){
      log("delete failed:", e);
    }
}

export async function getFileChanges(max=1, fields="*"){
  if(!Object.prototype.hasOwnProperty.call(getFileChanges, "startPageToken")){
    log("GDL.getFileChanges.startPageToken not found");
    let res = await gapi.client.drive.changes.getStartPageToken();
    // eslint-disable-next-line
    getFileChanges.startPageToken = res.result.startPageToken;
  }
  try{
    var pageToken = getFileChanges.startPageToken;
    let changes_list = [];
    for(let i = 0; i < max && pageToken; ++i){
      let res = await gapi.client.drive.changes.list({
        pageToken, fields
      });
      log("have change:", res.result);
      for(let change of res.result.changes){
        changes_list.push(change);
      }
      pageToken = res.result.nextPageToken;
    }
    return changes_list;
  } catch(e){
    delete getFileChanges.startPageToken;
    return getFileChanges(max);
  }
}


const GDL = {
    isSignedIn,
    addSignInListener,
    removeSignInListener,
    signIn,
    signOut,
    listFiles,
    listAppFolder,
    uploadToAppFolder,
    patchToAppFolder,
    createFolder,
    getFile,
    getFileAsText,
    getFileAsBlob,
    deleteFileByID,
    getFileChanges,
};
window.GDL = GDL;

export default GDL;
