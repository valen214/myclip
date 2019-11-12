

import gql from "graphql-tag";

export const SET_CLIP_ITEMS = gql`
  mutation SetClipItems($list: [ClipItem]) @client {
    setClipItems(list: $list) @client
  }
`;
/*
setClipItems(list: $list) @client
*/
