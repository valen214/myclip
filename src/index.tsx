
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

import App from "./components/App";
import { GroupedContextProvider } from "./contexts/GroupedContextProvider";
import reducer from "./reducers";

export const store = createStore(reducer);

import gql from 'graphql-tag';
import ApolloClient from "apollo-client";
import { ApolloProvider } from "@apollo/react-hooks";
import { InMemoryCache } from 'apollo-cache-inmemory';

const client = new ApolloClient({
  // url: "https://48p1r2roz4.sse.codesandbox.io",
  cache: new InMemoryCache(),
});


client.writeData({ data: {
  top_nav_visibility: Math.random(),
}});

ReactDOM.render(
  <Provider store={store}>
    <GroupedContextProvider>
      <ApolloProvider client={client}>
        <App />
      </ApolloProvider>
    </GroupedContextProvider>
  </Provider>,
  document.getElementById("app")
);
