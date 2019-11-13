
import React from "react";

import gql from 'graphql-tag';
import ApolloClient from "apollo-client";
import { createHttpLink } from "apollo-link-http";
import { InMemoryCache } from 'apollo-cache-inmemory';
import { ApolloProvider } from "react-apollo";

import { GET_CLIP_ITEMS, TEXT_CLIP_PAGE_VISIBILITY } from "./constants/Query";

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


export const cache = new InMemoryCache();


export const client = new ApolloClient({
  // url: "https://48p1r2roz4.sse.codesandbox.io",
  cache,
  link: createHttpLink({ fetch: customFetch }),
  // typeDefs,
  resolvers: {
    Query: {
    },
    Mutation: {
      setClipItems(parent, args, context, info){
        try{
          let item_list_query = cache.readQuery({ query: GET_CLIP_ITEMS });
          cache.writeQuery({
            query: GET_CLIP_ITEMS,
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
  components:{
    __typename: "Object",
    top_nav: {
      __typename: "Object",
      visible: true,
    },
    text_clip_page: {
      __typename: "Object",
      visible: false,
    },
  },
  clip_items: [],
};
client.writeData({ data: initialData });

/*
cache.writeQuery({
  query: GET_CLIP_ITEMS,
  data: {
    clip_items: [],
  }
});
*/

export const ApolloProviderWrapper = (props: any) => {
  return <ApolloProvider client={client} {...props}>
    {props.children}
  </ApolloProvider>;
}
