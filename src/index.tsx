
/*
https://www.typescriptlang.org/docs/handbook/react-&-webpack.html

https://material.io/develop/web/
https://material.io/develop/web/components/top-app-bar/
https://material.io/resources/

https://material-ui.com/components/app-bar/
https://reactjs.org/docs/hooks-effect.html
*/
import 'core-js/stable'
import 'regenerator-runtime/runtime'

import * as React from "react";
import * as ReactDOM from "react-dom";

import { Provider } from "react-redux";
import store from "./store";

import App from "./components/App";

ReactDOM.render(
  <Provider store={ store }>
    <App />
  </Provider>,
  document.getElementById("app")
);
