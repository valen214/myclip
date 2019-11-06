

/*
good read:
https://codeburst.io/how-to-manage-ui-state-with-redux-24deb6cf0d57

followed this:
https://medium.com/octopus-labs-london/
replacing-redux-with-react-hooks-and-context-part-1-11b72ffdb533
*/

import React from "react";
import StaticComponents from "../constants/StaticComponents";

const ComponentsVisibilityContext = React.createContext();


const initialVisibilityState = {
  [StaticComponents.CREATE_CLIP_BUTTON]: true,
  [StaticComponents.CREATE_CLIP_MENU]: false,
};

const reducer = (state: any, action: any) => {
  if(action.target in StaticComponents){
    return Object.assign({}, state, {
      [action.target]: action.visible
    });
  } else{
    return initialVisibilityState;
  }
}

export function getVisibilityController(){
  const { state, dispatch } = React.useContext(ComponentsVisibilityContext);
  return {
    isVisible: (target: StaticComponents) => state[target],
    setVisible: (target: StaticComponents,
        visible: boolean = true) => dispatch({
      target, visible: Boolean(visible)
    }),
    toggleVisible: (target: StaticComponents) => dispatch({
      target, visible: !Boolean(state[target])
    }),
  }
}

export function ComponentsVisibilityContextProvider({ children }: any){
  const [ state, dispatch ] = React.useReducer(reducer, initialVisibilityState);
  return <ComponentsVisibilityContext.Provider value={{ state, dispatch }}>
    {children}
  </ComponentsVisibilityContext.Provider>;
}
