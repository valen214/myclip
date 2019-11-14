
import React from "react";

import gql from 'graphql-tag';
import ApolloClient from "apollo-client";
import { createHttpLink } from "apollo-link-http";
import { InMemoryCache } from 'apollo-cache-inmemory';
import { ApolloProvider } from "react-apollo";

import { GET_CLIP_ITEMS } from "./constants/Query";

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
  typeDefs,
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
      __typename: "Component",
      visible: true,
    },
    text_clip_page: {
      __typename: "Component",
      visible: false,
      target: null,
      title: "",
      content: "",
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


/*

(() => {
let uuid = "asdfasdfasdfasdf";

client.writeData({
  data: {
    [uuid]: {
      "content": "Hello World",
      __typename: "Object",
    }
  }
});

let { [uuid]: { content }} = client.readQuery({ query: gql`
  query ReadContentWithUUID @client {
    ${uuid} @client {
      content
    }
  }
`});

console.log(content); // Hello World
})();

*/


/*

(() => {

const client = new ApolloClient({
  cache: new InMemoryCache(),
  link: createHttpLink(),
  typeDefs: gql`
    type Query {
      content: String
      CustomQ(foo: String): String
    }
    type CustomQ {
      content: String
      foo: String
    }
  `,
  resolvers: {
    CustomQ(content, foo){
      console.log("CustomQ resolver");
    },
    ReadContentWithUUID(parent, args, context, info){
      console.log(parent, args, context, info);
      return "OUTER ReadContentWithUUID RESOLVER";
    },
    Query: {
      foo(parent, args, context, info){
        console.log("INNER FOO RESOLVER");
      },
      customQ(parent, args, context, info){
        console.log(parent, args, context, info);
        return {
          foo: "INNER QUERY RESOLVER customQ"
        };
      },
      CustomQ(parent, args, context, info){
        console.log(parent, args, context, info);
        return "INNER QUERY RESOLVER CustomQ";
      },
      ReadContentWithUUID(parent, args, context, info){
        console.log(parent, args, context, info);
        return "INNER ReadContentWithUUID RESOLVER";
      },
    },
    Mutation: {}
  }
});

client.writeData({
  data: {
    content: "HI",
    customQ: [
      {
        foo: "HEY",
        content: "customQ_content",
        __typename: "CustomQ",
      }, {
        foo: "NOT HEY",
        content: "customQ_content",
        __typename: "CustomQ",
      }
    ]
  }
});

let res = client.readQuery({
  query: gql`
    query ReadContentWithUUID($foo: String) @client {
      CustomQ(foo: $foo) {
        content
        foo
      }
      content
    }
  `,
  variables: {
    "foo": "HEY",
  }
});
console.log(JSON.stringify(res, null, 4));

})();


*/