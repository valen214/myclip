

import gql from "graphql-tag";

export const SET_ITEM_LIST = gql`
  mutation SetItemList($list: [ClipItem]) @client {
    setItemList(list: $list) @client
  }
`;
