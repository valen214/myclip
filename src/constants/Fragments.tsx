
import gql from "graphql-tag";


export const COMPONENT_VISIBILITY = gql`
  fragment ComponentVisibility on Component {
    visible
  }
`;