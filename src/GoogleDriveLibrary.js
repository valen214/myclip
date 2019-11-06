

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
function randomstring(len=8, alphabet="abcdefghijklmnopqrstuvwxyz"){
    // https://jsperf.com/js-random-string-implementation-performance
    return crypto.getRandomValues(new Uint8Array(len)).reduce((l, r, i) => {
        // alphabet.chatAt(i / 255 * alphabet.length)
        l[i] = alphabet[Math.floor(r / 256 * alphabet.length)];
        return l;
    }, new Array(len)).join("");
}

var gapi;
(async () => {
    try{
        if("gapi" in window){

        } else{
            console.warn("'gapi' undefined, importing gapi script");
            await new Promise(ok =>{
                importScript("https://apis.google.com/js/api.js", ok);
            });
        }
        console.log("start initializing gapi");
        gapi = window["gapi"];
        await new Promise(ok => gapi.load("client:auth2", ok));
        await gapi.client.init({
            "apiKey": API_KEY,
            "clientId": CLIENT_ID,
            "discoveryDocs": DISCOVERY_DOCS,
            "scope": SCOPE
        });
        console.log("finished initializing gapi");
    } catch(e){
        console.error(e);
    }
})();

export function isSignedIn(){
    try{
        return gapi.auth2.getAuthInstance().isSignedIn.get();
    } catch(e){
        return false;
    }
}
export function addSignInListener(func){
    gapi.auth2.getAuthInstance().isSignedIn.listen(func);
}

export function signIn(){
    gapi.auth2.getAuthInstance().signIn();
}

export function signOut(){
    gapi.auth2.getAuthInstance().signOut();
}

export function listFiles(path=""){

}


export async function listAppFolder(){
    let res;
    try{
        console.log('list app folder');
        res = await gapi.client.drive.files.list({
            spaces: "appDataFolder",
            // q: "'0AAEfTIVzjL1JUk9PVA' in parents",
            // q: "'appDataFolder' in parents",
            maxResults: 100,
            fields: "nextPageToken, files(id, name)",
        });
        let files = res.result.files;
        if(files && files.length){
            files.forEach(file =>{
                console.log("found file:", file.name, file.id);
            });
        } else{
            console.log('no file found');
        }
        return files;
    } catch(e){
        console.error(`listAppFolder(): ${e}` + "\n\n" +
          "server response:", res);
    }
}

export async function uploadFile(path, data){
    console.log(`GoogleLibrary.js: uploadFile(${path}, ${data})`);
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
        console.log("file uploaded:", res);
    } catch(e){
        console.error(e);
    }

}

export async function uploadToAppFolder(path, data, type="text/plain"){
    const access_token = gapi.auth2.getAuthInstance().currentUser.get(
            ).getAuthResponse().access_token;
    const nl = "\r\n";
    let [parents, name] = splitPath(path);
    let meta = "Content-Type: application/json; charset=UTF-8" + nl + nl +
        JSON.stringify({
            "name": name,
            "parents": ["appDataFolder"],
        });
    let body_text = await new Response(data).text();

    let boundary = randomstring(32);
    while(meta.includes(boundary) || body_text.includes(boundary)){
        boundary = randomstring(boundary.length + 16);
        if(boundary.length > 256){
            console.error("something id probably wrong",
                    "in creatation of multipart POST boundary");
        }
    }

    let body = new Blob([
        "--", boundary, nl, meta, nl,
        "--", boundary, nl,
        "Content-Type: ", type, nl,
        nl, data, nl,
        "--", boundary, "--"
    ]);

    let res = await fetch("https://www.googleapis.com/" +
            "upload/drive/v3/files?uploadType=multipart&fields=id", {
            "method": "POST",
            "headers": {
                "Authorization": "Bearer " + access_token,
                "Content-Type": "multipart/related; boundary=" + boundary,
                "Content-Length": body.size
            },
            "body": body,
    });
    let obj = await res.json();
    console.log("file uploaded to app folder: res:", obj);
    return obj;
}

export async function getFile(id){
    if(!id){
      throw "empty fild id!";
    }
    console.log(`GoogleLibrary.js: getFile(${id})`);
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
        console.log(res);
        return res;
    } catch(e){
        console.error(e);
    }
}
export async function getFileAsText(id){
    let res = await getFile(id);
    let text = await res.text();
    console.log(`getFileAsText(${id}): ${text}`);
    return text;
}
export async function getFileAsBlob(id){
    let res = await getFile(id);
    let blob = await res.blob();
    console.log(`getFileAsBlob(${id}): ${blob}`);
    return blob;
}

export async function deleteFileByID(id){
    try{
      let res = await gapi.client.drive.files.delete({
          "fileId": id
      })
      console.log("deleted id:%s completed, res:", id, res);
      console.assert(res.status === 204);
    } catch(e){
      console.log("delete failed:", e);
    }
}

const GDL = {
    isSignedIn,
    addSignInListener,
    signIn,
    signOut,
    listFiles,
    listAppFolder,
    uploadFile,
    uploadToAppFolder,
    getFile,
    getFileAsText,
    getFileAsBlob,
    deleteFileByID,
};
window.GDL = GDL;

export default GDL;
