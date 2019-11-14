

import { client } from "../ApolloHelper";
import gql from "graphql-tag";

export function setField(field_chain: string, value: any){
  let list = field_chain.split('.');
  let composed_object = list.reduceRight((r: any, l) => ({
    [l]: r,
    __typename: "",
  }), value);
  
  return client.writeQuery({
    query: gql`
      query GetComponentVisibility @client {
        ${list.join(" {") + "}".repeat(list.length - 1)}
      }
    `,
    data: composed_object,
  });
}


export function getField(field_chain: string, value: any){
  let list = field_chain.split('.');
  
  let obj_chain = client.readQuery({
    query: gql`
      query GetComponentVisibility @client {
        ${list.join(" {") + "}".repeat(list.length - 1)}
      }
    `,
  });
  return list.reduce((l, r) => l[r], obj_chain);
}
