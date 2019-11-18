
//@ts-ignore
import GDL from "../GoogleDriveLibrary";
import { setComponentVisibility } from "./ComponentVisibility";
import { setClipActionDialogTarget } from "./ClipActionDialog";
import {
    setTextClipPageTarget,
    setTextClipPageTitle,
    setTextClipPageContent,
} from "./TextClipPage";
import { client } from "../ApolloHelper";
import { CLIP_ITEM_LIST } from "../constants/Query";
import { writeFileToCache } from "./GoogleDriveFileHelper";

export async function createAndUploadTextClipItem(
    title: string, content: string){
  if(content){
    let res = await GDL.uploadToAppFolder(title, content);
    const clip_item_list = client.readQuery({
      query: CLIP_ITEM_LIST
    }).clip_items;

    writeFileToCache({
      id: res.id,
      name: title,
      content
    });

    client.writeQuery({
      query: CLIP_ITEM_LIST,
      data: {
        clip_items: [
            ...clip_item_list,
            {
              __typename: "ClipItem",
              id: res.id,
              name: title,
            }
        ],
      },
    });

  } else{
    console.warn("/src/actions/GoogleCilpItem:",
        "createAndUploadTextClipItem():",
        "discard empty text clip");
    return false
  }
}

export async function deleteClipItem(id: string){
  GDL.deleteFileByID(id);

  const clip_item_list = client.readQuery({
    query: CLIP_ITEM_LIST
  }).clip_items;

  client.writeQuery({
    query: CLIP_ITEM_LIST,
    data: {
      clip_items: clip_item_list.filter((obj: any) => {
        return obj.id != id;
      }),
    }
  });
}


export function onClipItemClick(id: string, title: string, content: string){
  setTextClipPageTarget(id);
  setTextClipPageTitle(title);
  setTextClipPageContent(content);
  setComponentVisibility("text_clip_page", true);
}

export function onClipActionClick(id: string){
  setClipActionDialogTarget(id);
  setComponentVisibility("clip_action_dialog", true);
}