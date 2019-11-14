
import { connect } from "react-redux";

import { setTextClipPageVisible } from "./TextClipPage";

export function onCreateTextClipButtonClick(dispatch: any){
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
