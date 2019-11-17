
//@ts-ignore
import React from "react";

import gql from 'graphql-tag';
import ApolloClient from "apollo-client";
import { createHttpLink } from "apollo-link-http";
import { InMemoryCache } from 'apollo-cache-inmemory';
import { ApolloProvider } from "react-apollo";

import { CLIP_ITEM_LIST } from "./constants/Query";
import { FileQueryResolvers, FileMutationResolvers
    } from "./actions/GoogleDriveFileHelper";

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
      ...FileQueryResolvers
    },
    Mutation: {
      ...FileMutationResolvers,
      setClipItems(parent, args, context, info){
        try{
          let item_list_query = cache.readQuery({ query: CLIP_ITEM_LIST });
          cache.writeQuery({
            query: CLIP_ITEM_LIST,
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
    clip_action_dialog: {
      __typename: "Component",
      visible: false,
      target: null,
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
// dummy();
function dummy(){



(async () => { try{

const client = new ApolloClient({
  cache: new InMemoryCache(),
  link: createHttpLink(),
  resolvers: {
    Query: {
      /*
      file(obj, args, context, info){
        console.log("%cquery resolver invoked", "color: #5f5");
        console.log("%cobj:", "color: #5d5", obj);
        console.log("%cargs:", "color: #5d5", args);
        return {
          __typename: "File",
          id: args.id,
          content: new Blob(["asfd"]),
        };
      }
      */
    },
    Mutation: {
      async file(obj, args, context, info){
        try{
          console.log("%cMutation resolver invoked", "color: #5f5");
          console.log("%cobj:", "color: #5d5", obj);
          console.log("%cargs:", "color: #5d5", args);
          console.log("%ccontext:", "color: #5d5", context);

          let { id, content } = args;

          let data = {
            __typename: "File",
            id,
            content,
          };

          client.writeQuery({
            query: gql`
              query {
                file(id: "${id}") {
                  content
                }
              }
            `,
            data: {
              file: data
            }
          });
        } catch(e){
          console.error(e);
        }
      }
    }
  }
});

client.writeData({
  data: {
    content: "HI",
    user: {
      __typename: "User",
    }
  }
});

client.mutate({
  mutation: gql`
    mutation($id: String!) {
      file(id: $id, content: $content) @client {
        content
      }
    }
  `,
  variables: {
    id: "a.txt",
    content: new Blob(["alright"]),
  },
});


console.log("%cstart query", "color: #5f5");
let res = await client.query({
  query: gql`
    query {
      file(id: $id) @client {
        content
      }
      content @client(always: true)
    }
  `,
  variables: {
    "id": "a.txt",
  }
});
console.log("%cquery response:", "color: #5f5", res, "\n");

console.log("\n%cuser query:", "color: #55f");
res = await client.query({
  query: gql`
    query {
      user @client {
        name
      }
    }
  `,
});
console.log("%cquery response:", "color: #55f", res, "\n");


console.log("%cfinal client cache:", "color: #5d5");
console.log(client.extract());

} catch(e){ console.error(e); } })();


}