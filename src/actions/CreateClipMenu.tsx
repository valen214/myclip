
import { connect } from "react-redux";

import {
  setTextClipPageVisible, setTextClipPageTarget, CREATE_NEW
} from "./TextClipPage";

export function onCreateTextClipButtonClick(dispatch: any){
  setTextClipPageTarget(CREATE_NEW);
  setTextClipPageVisible(true);
}


export function CreateClipMenuWrapper(target: any){
  return connect<any, any, any>(
    null,
    (dispatch: any) => ({
      onCreateTextClipButtonClick: () => onCreateTextClipButtonClick(dispatch),
    }),
    null, {
      forwardRef: false
    }
  )(target);
}
