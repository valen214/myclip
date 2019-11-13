

import { connect } from "react-redux";

import { createAndUploadTextClipItem } from "./GoogleClipItem";

import { client } from "../ApolloHelper";
import { TEXT_CLIP_PAGE_VISIBILITY } from "../constants/Query";

export function setTextClipPageVisible(dispatch: any, visible: boolean = false){
  // dispatch({ type: "SET_TEXT_CILP_PAGE_VISIBLE", visible })
  client.writeQuery({
    query: TEXT_CLIP_PAGE_VISIBILITY,
    data: {
      components: {
        __typename: "Object",
        text_clip_page: {
          __typename: "Object",
          visible
        }
      }
    }
  });
}
export function setTextClipPageTitle(dispatch: any, title: string){
  dispatch({ type: "SET_TEXT_CLIP_PAGE_TITLE", title })
}
export function setTextClipPageContent(dispatch: any, content: string){
  dispatch({ type: "SET_TEXT_CLIP_PAGE_CONTENT", content })
}


function onCloseButtonClick(dispatch: any){
  setTextClipPageVisible(dispatch, false);
  setTextClipPageTitle(dispatch, "");
  setTextClipPageContent(dispatch, "");
}
function onTitleChange(dispatch: any, title: string){
  setTextClipPageTitle(dispatch, title);
}
function onDoneButtonClick(dispatch: any, title: string, content: string){
  setTextClipPageVisible(dispatch, false);
  setTextClipPageTitle(dispatch, "");
  setTextClipPageContent(dispatch, "");

  createAndUploadTextClipItem(title, content);
}
function onContentChange(dispatch: any, content: string){
  setTextClipPageContent(dispatch, content);
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
      onDoneButtonClick: (title: string, content: string) => (
          onDoneButtonClick(dispatch, title, content)),
      onContentChange: (content: string) => onContentChange(dispatch, content),
      onContentBlur: (content: string) => onContentBlur(dispatch, content),
    })
  )(target);
}
