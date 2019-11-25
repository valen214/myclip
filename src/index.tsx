
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

/*

client.query({ query: gql`
{
  rates(currency: "USD") {
    currency
    rate
  }
} `}
).then(console.log).catch(console.warn);
*/


// import 'core-js/stable'
// import 'regenerator-runtime/runtime'

//@ts-ignore
import React from "react";
//@ts-ignore
import ReactDOM from "react-dom";

import { Provider } from "react-redux";

import store from "./logic/store";

import App from "./components/App";


const render = () => {
  ReactDOM.render(
    <Provider store={store}>
      <App />
    </Provider>
    ,
    document.getElementById("app")
  );
};

render();

if (process.env.NODE_ENV === 'development' && module.hot) {
  module.hot.accept('./components/App', render)
}


import GDL from "./GoogleDriveLibrary"

declare global {
  interface Window {
    gapi: any
    GDL: any
  }
}

window.GDL = GDL
