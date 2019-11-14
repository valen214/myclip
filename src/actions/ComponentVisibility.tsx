

import { client } from "../ApolloHelper";
import gql from "graphql-tag";

export function setComponentVisibility(
    component: string,
    visible: boolean = false){
  // dispatch({ type: "SET_TEXT_CILP_PAGE_VISIBLE", visible })
  client.writeQuery({
    query: gql`
      query GetComponentVisibility @client {
        components @client {
          ${component} {
            visible
          }
        }
      }
    `,
    data: {
      components: {
        [component]: {
          visible,
          __typename: "Component",
        },
        __typename: "Object",
      }
    }
  });
}