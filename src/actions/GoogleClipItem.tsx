
//@ts-ignore
import GDL from "../GoogleDriveLibrary";


export async function createAndUploadTextClipItem(
    title: string, content: string){
  if(content){
    return GDL.uploadToAppFolder(title, content);
  } else{
    console.warn("/src/actions/GoogleCilpItem:",
        "createAndUploadTextClipItem():",
        "discard empty text clip");
    return false
  }
}
