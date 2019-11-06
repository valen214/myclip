

/*
good read:
https://codeburst.io/how-to-manage-ui-state-with-redux-24deb6cf0d57

followed this:
https://medium.com/octopus-labs-london/
replacing-redux-with-react-hooks-and-context-part-1-11b72ffdb533
*/

import React from "react";

import { ComponentsVisibilityContextProvider } from "./ComponentsVisibility";

export function GroupedContextProvider({ children }: any){
  return <ComponentsVisibilityContextProvider>
    {children}
  </ComponentsVisibilityContextProvider>;
}
