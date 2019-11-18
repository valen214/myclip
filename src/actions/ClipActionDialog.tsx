

import { connect } from "react-redux";

import { createAndUploadTextClipItem, deleteClipItem } from "./GoogleClipItem";

import { client } from "../ApolloHelper";
import { setComponentVisibility } from "./ComponentVisibility";
import { getField, setField } from "./GQLFlatten";

export function setClipActionDialogTarget(target: any = ""){
  setField("components.clip_action_dialog.target", target);
}
export function setClipActionDialogVisible(visible: boolean = false){
  // dispatch({ type: "SET_TEXT_CILP_PAGE_VISIBLE", visible })
  setField("components.clip_action_dialog.visible", visible);
}

export function onClickAway(){
  /**
   * /src/actions/GoogleClipItem.onClipActionClick
   * would set BOTH 'visible' and 'target',
   * but ClickAwayListener will also invoked at the same time
   **/
  setClipActionDialogVisible(false);
  setClipActionDialogTarget();
}


export function onDeleteButtonClick(target: any){
  if(target){
    setClipActionDialogVisible(false);
    setClipActionDialogTarget();
    deleteClipItem(target);
  }
}
