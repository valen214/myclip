

const BLOB_TO_URL: Map<Blob, string> = new Map()
const URL_TO_BLOB: {[key: string]: Blob} = {}

export const blobToUrl = (blob: Blob): string => {
  if(BLOB_TO_URL.has(blob)){
    return BLOB_TO_URL.get(blob);
  } else{
    let url = URL.createObjectURL(blob);
    BLOB_TO_URL.set(blob, url);
    URL_TO_BLOB[url] = blob;
    return url;
  }
}

export const urlToBlob = (url: string): Blob => {
  if(URL_TO_BLOB.hasOwnProperty(url)){
    return URL_TO_BLOB[url]
  } else{
    throw Error("BlobStore: no blob with such url found!")
  }
}

export const revokeBlob = (obj: string | Blob): void => {
  let url, blob;
  if(typeof obj === "string"){
    url = obj;
    blob = URL_TO_BLOB[url];
  } else{
    blob = obj;
    url = BLOB_TO_URL.get(blob);
  }

  BLOB_TO_URL.delete(blob);
  delete URL_TO_BLOB[url];
  URL.revokeObjectURL(url);
}