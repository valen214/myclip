

import { connect } from "react-redux";

import { createAndUploadTextClipItem } from "./GoogleClipItem";

import { client } from "../ApolloHelper";
import { setComponentVisibility } from "./ComponentVisibility";
import { setField } from "./GQLFlatten";

export function setClipActionDialogTarget(target: any = ""){
  setField("components.clip_action_dialog.target", target);  
}
export function setClipActionDialogVisible(visible: boolean = false){
  // dispatch({ type: "SET_TEXT_CILP_PAGE_VISIBLE", visible })
  setComponentVisibility("clip_action_dialog", visible);
}


export function onClose(){
  setClipActionDialogTarget();
  setClipActionDialogVisible(false);
}

