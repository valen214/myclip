

import { connect } from "react-redux";

import { createAndUploadTextClipItem } from "./GoogleClipItem";

import { client } from "../ApolloHelper";
import { setComponentVisibility } from "./ComponentVisibility";
import { setField } from "./GQLFlatten";

export function setTextClipPageTarget(target: any = "@CREATE_NEW"){
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

  if(!target || target == "@CREATE_NEW"){
    createAndUploadTextClipItem(title, content);
  } else{
    
  }
}
function onContentChange(dispatch: any, content: string){
  setTextClipPageContent(content);
}
function onContentBlur(dispatch: any, content: string){

}


export function TextClipPageWrapper(target: any){
  return connect(
    (state: any) => ({
      open: state.text_clip_page.visible,
      title: state.text_clip_page.title,
      content: state.text_clip_page.content,
    }),
    (dispatch: any) => ({
      onCloseButtonClick: () => onCloseButtonClick(dispatch),
      onTitleChange: (title: string) => onTitleChange(dispatch, title),
      onContentChange: (content: string) => onContentChange(dispatch, content),
      onContentBlur: (content: string) => onContentBlur(dispatch, content),
    })
  )(target);
}
