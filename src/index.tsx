
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

import { TopNav } from "./components/TopNav";

ReactDOM.render(
  <TopNav compiler="OK" framework="BYE" />,
  document.getElementById("app")
);
