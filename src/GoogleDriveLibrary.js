
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


function importScript(url, callback, isAsync = false){
    const script = document.createElement("script");
    script.src = url;
    script.async = isAsync;
    if(callback instanceof Function) script.onload = callback;
    document.body.appendChild(script);
}
function splitPath(path){
    let i = path.lastIndexOf('/');
    let parents = i >= 0 ? path.substring(0, i) : "";
    let name = path.substring(i + 1);
    return [parents, name];
}
// eslint-disable-next-line
function randomstring(len=8, alphabet="abcdefghijklmnopqrstuvwxyz"){
    // https://jsperf.com/js-random-string-implementation-performance
    return crypto.getRandomValues(new Uint8Array(len)).reduce((l, r, i) => {
        // alphabet.chatAt(i / 255 * alphabet.length)
        l[i] = alphabet[Math.floor(r / 256 * alphabet.length)];
        return l;
    }, new Array(len)).join("");
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
        await gapi.client.init({
            "apiKey": API_KEY,
            "clientId": CLIENT_ID,
            "discoveryDocs": DISCOVERY_DOCS,
            "scope": SCOPE
        });
        log("%cfinished initializing gapi", "#afd");
        return true;
    } catch(e){
        console.error(e);
    }
})();


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
        log('list app folder');
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
        return files;
    } catch(e){
        console.error(`listAppFolder(): ${e}` + "\n\n" +
          "server response:", res);
    }
}

export async function uploadFile(path, data){
    await initialized;
    log(`GoogleLibrary.js: uploadFile(${path}, ${data})`);
    try{
        let [parents, name] = splitPath(path);
        let res = await gapi.client.drive.files.create({
            "name": name,
            parents: [parents],
            media: {
                "mimeType": "text/plain",
                "body": await new Response(data).text(),
            },
            fields: "id, parents",
        }, {
            body: "asdf",
            media: {
                "mimeType": "text/plain",
                "body": await new Response(data).text(),
            }
        });
        res = res.result;
        log("file uploaded:", res);
    } catch(e){
        console.error(e);
    }

}

export async function uploadToAppFolder(filename, data){
    await initialized;
    const access_token = gapi.auth2.getAuthInstance().currentUser.get(
            ).getAuthResponse().access_token;

    let formData = new FormData();
    formData.append("meta", new Blob([JSON.stringify({
        "name": filename,
        "parents": ["appDataFolder"],
    })], { type: "application/json; charset=UTF-8" }));
    formData.append("body", await new Response(data).blob(), filename);

    let res = await fetch("https://www.googleapis.com/" +
            "upload/drive/v3/files?uploadType=multipart&fields=id,mimeType", {
            "method": "POST",
            "headers": {
                "Authorization": "Bearer " + access_token,
            },
            body: formData,
    });
    let obj = await res.json();
    log("file uploaded to app folder: res:", obj);
    return obj;
}
export async function patchToAppFolder(id, data, filename){
    await initialized;
    const access_token = gapi.auth2.getAuthInstance().currentUser.get(
            ).getAuthResponse().access_token;
    
    let formData = new FormData();
    formData.append("meta", new Blob([JSON.stringify({
        "name": filename,
        // "parents": ["appDataFolder"],
    })], { type: "application/json; charset=UTF-8" }));
    formData.append("body", await new Response(data).blob());

    let res = await fetch("https://www.googleapis.com/" +
            "upload/drive/v3/files/" + id +
            "?uploadType=multipart&fields=id,mimeType", {
            "method": "PATCH",
            "headers": {
                "Authorization": "Bearer " + access_token,
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
    const access_token = gapi.auth2.getAuthInstance().currentUser.get(
            ).getAuthResponse().access_token;
    try{
        let res = await fetch(
            `https://www.googleapis.com/drive/v3/files/${id}?alt=media`, {
            "method": "GET",
            "headers": {
                "Authorization": "Bearer " + access_token,
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
    uploadFile,
    uploadToAppFolder,
    patchToAppFolder,
    getFile,
    getFileAsText,
    getFileAsBlob,
    deleteFileByID,
    getFileChanges,
};
window.GDL = GDL;

export default GDL;
