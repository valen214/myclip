
/*
https://www.typescriptlang.org/docs/handbook/react-&-webpack.html

https://material.io/develop/web/
https://material.io/develop/web/components/top-app-bar/
https://material.io/resources/

https://material-ui.com/components/app-bar/
https://reactjs.org/docs/hooks-effect.html
*/

import { setConfig, cold } from 'react-hot-loader';

setConfig({
  reloadHooks: true,
  onComponentCreate: (type, name) => (
    String(type).indexOf('useState') > 0 ||
    String(type).indexOf('useEffect') > 0) && cold(type),
});


import 'core-js/stable'
import 'regenerator-runtime/runtime'

import * as React from "react";
import * as ReactDOM from "react-dom";

/*
import { Provider } from "react-redux";
import store from "./store";
*/

import App from "./components/App";
import { GroupedContextProvider } from "./contexts/GroupedContextProvider";

ReactDOM.render(
  <GroupedContextProvider>
    <App />
  </GroupedContextProvider>,
  document.getElementById("app")
);
