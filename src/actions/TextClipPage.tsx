

import { createAndUploadTextClipItem } from "./GoogleClipItem";

import { client } from "../ApolloHelper";
import { setComponentVisibility } from "./ComponentVisibility";
import { setField } from "./GQLFlatten";

export const CREATE_NEW = "@CREATE_NEW"; // should this be inside ../constant/

export function setTextClipPageTarget(target: any = ""){
  setField("components.text_clip_page.target", target);  
}
export function setTextClipPageVisible(visible: boolean = false){
  // dispatch({ type: "SET_TEXT_CILP_PAGE_VISIBLE", visible })
  setComponentVisibility("text_clip_page", visible);
}
export function setTextClipPageTitle(title: string){
  setField("components.text_clip_page.title", title);
}
export function setTextClipPageContent(content: string){
  setField("components.text_clip_page.content", content);
}


function onCloseButtonClick(dispatch: any){
  setTextClipPageTarget();
  setTextClipPageVisible(false);
  setTextClipPageTitle("");
  setTextClipPageContent("");
}
function onTitleChange(dispatch: any, title: string){
  setTextClipPageTitle(title);
}
export function onDoneButtonClick(target: any, title: string, content: string){
  setTextClipPageTarget();
  setTextClipPageVisible(false);
  setTextClipPageTitle("");
  setTextClipPageContent("");

  if(!target){
    console.error("text clip page done button click without target specified");
  } else if(target === CREATE_NEW){
    createAndUploadTextClipItem(title, content);
  } else{
    
  }
}

function onContentChange(e: React.FormEvent<HTMLInputElement>){
  setTextClipPageContent(e.currentTarget.value);
}
function onContentBlur(e: React.FormEvent<HTMLInputElement>){

}
