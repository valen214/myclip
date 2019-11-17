
//@ts-ignore
import GDL from "../GoogleDriveLibrary";
import { setComponentVisibility } from "./ComponentVisibility";
import { setTextClipPageTarget,
    setTextClipPageTitle,
    setTextClipPageContent } from "./TextClipPage";

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


export function onClipItemClick(id: string, title: string, content: string){
  setTextClipPageTarget(id);
  setTextClipPageTitle(title);
  setTextClipPageContent(content);
  setComponentVisibility("text_clip_page", true);
}

export function onClipActionClick(id: string){
  setComponentVisibility("clip_action_dialog", true);
}