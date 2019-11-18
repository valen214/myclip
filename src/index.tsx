
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


import 'core-js/stable'
import 'regenerator-runtime/runtime'

import React from "react";
import ReactDOM from "react-dom";

import { createStore } from "redux";
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




declare global {
  interface Window {
    gql: any;
    TEXT_CLIP_PAGE_VISIBILITY: any;
    client: any;
    getField: any;
    setField: any;
    InMemoryCache: any;
    createHttpLink: any;
    ApolloClient: any;
  }
}

import gql from "graphql-tag";
window.gql = gql;

import { InMemoryCache } from 'apollo-cache-inmemory';
window.InMemoryCache = InMemoryCache;

import { createHttpLink } from "apollo-link-http";
window.createHttpLink = createHttpLink;

import ApolloClient from "apollo-client";
window.ApolloClient = ApolloClient;