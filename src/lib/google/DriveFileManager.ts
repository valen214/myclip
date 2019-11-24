

import { FileManager, FileType } from "../../logic/FileManager";
import { signInPromise } from "./OAuth2"

class GoogleFile implements FileType {
  id?: string;
  parent?: FileType;
  children?: { [name: string]: FileType };
  name?: string;
  type?: string;
  data?: string | Blob;
  lastModified?: string;

  watching?: boolean;
  caching?: boolean;

  remoteId?: string;
  url?: string;
  state?: string;

  constructor(arg: {
    parent?: FileType
    children?: { [name: string]: FileType }
    name?: string
    type?: string
    data?: string | Blob
    lastModified?: string

    remoteId?: string
  } = {}){
    if(!arg.children) arg.children = {}
    Object.assign(this, arg)
  }

  read(): Promise<FileType> {
    return DriveFileManager.read(this)
  }
  write(data: string | Blob): Promise<FileType> {
    return DriveFileManager.write(this, data)
  }
  list(): Promise<{ [name: string]: FileType }> {
    return DriveFileManager.list(this)
  }
  del(): Promise<boolean | void> {
    return DriveFileManager.del(this)
  }
  watch(func: (f: FileType) => void): Promise<FileType> {
    return DriveFileManager.watch(this, func)
  }
  unwatch(): Promise<FileType> {
    return DriveFileManager.unwatch(this)
  }
  cache(): Promise<FileType> {
    return DriveFileManager.cache(this)
  }
  uncache(): Promise<FileType> {
    return DriveFileManager.uncache(this)
  }
}


let watching = new Map()

let file_structure: { [key: string]: FileType } = {
  "/": new GoogleFile({
    name: "/",
    type: "folder",
    remoteId: "appDataFolder"
  })
}
let id_to_file: { [id: string]: FileType } = {}


async function init(){
  await signInPromise


}
let initPromise: Promise<void> | void = init();

const resolvePath = (
  arg: string | FileType
): Array<string | FileType> => {
  let path: any;
  if(typeof arg !== "string"){
    path = [arg]
    while(arg.parent){
      path.unshift(arg.parent)
    }
    return path;
  }


  if(typeof arg === "string"){
    path = arg
  }

  path = path.split("/")

  if(path[0] == ""){
    path[0] = '/';
  } else{
    path.unshift('/')
  }

  let current: any = file_structure['/']
  path[0] = current
  for(let i = 1; i < path.length; ++i){
    let name = path[i]
    console.log(`resolvePath(): i: ${i}, name: ${name}, current:`, current)
    if(current.children && current.children.hasOwnProperty(name)){
        let f = current.children[name]
        path[i] = f
        current = f
    } else{
      break
    }
  }

  return path
}

async function read(arg: string | FileType): Promise<FileType> {
  await initPromise
  let path = resolvePath(arg)
  let last = path[path.length - 1]
  let name: string = typeof last === "string" ? last : last.name
  let parent = await list(
      path.slice(0, -1).reduce((l, r: FileType) => l + r.name, ""));
  let output
  if(Object.prototype.hasOwnProperty.call(parent, name)){
    output = parent[name]
  } else{
    throw Error("file not found")
  }
  return output
}
async function write(arg: string | FileType, data: string | Blob){
  await initPromise
  let path = resolvePath(arg)
  console.log("write(): path:", path)
  if(path.slice(0, -1).every(e => typeof e !== "string")){
    let [ parent, last ] = path.slice(-2) as [ FileType, string ]
    if(typeof last === "string"){
      let f = new GoogleFile({
        parent, name: last, data
      })
      parent.children[last] = f
      console.log("file written")
    } else{ // exists
      console.log("file exists")
    }
  } else{

  }
}
async function mkdir(arg: string){
  await initPromise
}
async function list(
  arg: string | FileType
): Promise<{ [name: string]: FileType }> {
  await initPromise
  let path = resolvePath(arg)
  for(let i = 1; i < path.length - 1; ++i){
    let current = path[i]
    if(typeof current !== "string") continue;
    console.log("parent folder not exists locally, checking remote")
    let parent = path[i-1] as FileType
    let files = await listAppFolderByID(parent.remoteId);
    files.forEach(({ id, name, mimeType }: {
      id: string, name: string, mimeType: string
    }) => {
      if(name in parent.children){
        console.assert(id === parent.children[name].remoteId)
      } else{
        parent.children[name] = new GoogleFile({
          remoteId: id, name, type: mimeType
        })
      }
    })
    if(current in parent.children){
      console.log("parent folder %s found in remote, continue", current);
    } else{
      throw new Error("attempt to list non-existing folder")
    }
    path[i] = parent.children[name]
  }

  return (path.slice(-1)[0] as FileType).children
}
async function del(arg: string | FileType){
  await initPromise

}
async function watch(
  arg: string | FileType,
  func: (f: FileType) => void
): Promise<FileType> {

  return arg as FileType
}
async function unwatch(arg: string | FileType): Promise<FileType> {

  return arg as FileType
}
async function cache(arg: string | FileType): Promise<FileType> {

  return arg as FileType
}
async function uncache(arg: string | FileType): Promise<FileType> {

  return arg as FileType
}



async function uploadByID(id: string, data: string | Blob){

}
async function updateByID(id: string, data: string | Blob){

}
async function downloadByID(id: string){

}
async function listAppFolderByID(
  id: string,
  fields: string = "nextPageToken, files(id, name, mimeType)"
){
  await signInPromise
  try{
    let res = await window.gapi.client.drive.files.list({
      spaces: "appDataFolder",
      q: `'${id}' in parents`,
      maxResults: 100,
      fields
    })
    let files = res.result.files.map(({
      id, name, mimeType
    }: {
      id: string
      name: string
      mimeType: string
    }) => ({
      id, name, mimeType
    }))
    return files
  } catch(e){
    console.error("DriveFileManager.ts: listAppFolderByID:", e)
  } 
}
async function deleteByID(id: string){

}



const DriveFileManager = {
  file_structure,
  resolvePath,
  init,
  read,
  write,
  mkdir,
  list,
  del,
  watch,
  unwatch,
  cache,
  uncache,

  uploadByID,
  updateByID,
  downloadByID,
  listAppFolderByID,
  deleteByID,
} as any as FileManager
export default DriveFileManager