
import React from "react";

import gql from 'graphql-tag';
import ApolloClient from "apollo-client";
import { createHttpLink } from "apollo-link-http";
import { InMemoryCache } from 'apollo-cache-inmemory';
import { ApolloProvider } from "react-apollo";

import { ITEM_LIST_QUERY } from "./constants/Query";

const typeDefs = `
  type ClipItem {
    id: String!
    name: String
  }
  type Query {
    clip_items: [ClipItem]
  }
`;


const customFetch = (uri: string, options: object) => {
  return fetch(uri, options);
};


const cache = new InMemoryCache();


export const client = new ApolloClient({
  // url: "https://48p1r2roz4.sse.codesandbox.io",
  cache,
  link: createHttpLink({ fetch: customFetch }),
  typeDefs,
  resolvers: {
    Query: {
      clip_items(){
        const data: any = cache.readQuery({ query: ITEM_LIST_QUERY });
        console.log("Query: data:", data);
        return data.clip_items;
      }
    },
    Mutation: {
      setItemList(parent, args, context, info){
        try{
          let item_list_query = cache.readQuery({ query: ITEM_LIST_QUERY });
          cache.writeQuery({
            query: ITEM_LIST_QUERY,
            data: {
              clip_items: args.list
            }
          })
        } catch(e){
          console.error(e);
        }
      },

    }
  }
});

const initialData: any = {
  top_nav: {
    visible: true,
  },
  // clip_items: [],
};


cache.writeQuery({
  query: ITEM_LIST_QUERY,
  data: {
    clip_items: [],
  }
});


export const ApolloProviderWrapper = (props: any) => {
  return <ApolloProvider client={client} {...props}>
    {props.children}
  </ApolloProvider>;
}
