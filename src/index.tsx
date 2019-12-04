
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

const rootElem = document.getElementById("app");

const render = (App: React.Component) => (
  <Provider store={store}>
    <App />
  </Provider>
);

ReactDOM.render(render(App), rootElem);

if (process.env.NODE_ENV === 'development' && module.hot) {
  module.hot.accept('./components/App', () => {
    const App = require('./components/App').default
    ReactDOM.render(render(App), rootElem);
  })
}


import GDL from "./GoogleDriveLibrary"

declare global {
  interface Window {
    gapi: any
    GDL: any
  }
}

window.GDL = GDL
