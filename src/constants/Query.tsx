
import gql from "graphql-tag";

export const GET_CLIP_ITEMS = gql`
  query GetClipItems @client {
    clip_items {
      id
      name
    }
  }
`;


export const TEXT_CLIP_PAGE_PROPERTIES = gql`
  query GetTextClipPageVisibility @client {
    components @client {
      text_clip_page {
        visible
        target
        title
        content
      }
    }
  }
`;