
import gql from "graphql-tag";

export const GET_CLIP_ITEMS = gql`
  query GetClipItems @client {
    clip_items {
      id
      name
    }
  }
`;
