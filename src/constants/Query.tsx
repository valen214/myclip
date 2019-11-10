
import gql from "graphql-tag";

export const ITEM_LIST_QUERY = gql`
  query clip_items @client {
    clip_items {
      id
      name
    }
  }
`;
