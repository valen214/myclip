
import gql from "graphql-tag";
import { useQuery } from "@apollo/react-hooks";

import { client } from "../ApolloHelper";
import GDL from "../GoogleDriveLibrary";
import { CLIP_ITEM_LIST } from "../constants/Query";

export const FileQueryResolvers = {

};
export const FileMutationResolvers = {
//@ts-ignore
  file(obj, { id, content }, { client }, info){

  }
};


const WRITE_FILE_QUERY = gql`
  query($id: String!) {
    file(id: $id){
      id
      name
      content
    }
  }
`;
export const writeFileToCache = ({
  id, name, content
}: { id: string, name: string, content: any }) => {
  client.writeQuery({
    query: WRITE_FILE_QUERY,
    data: {
      file: {
        __typename: "File",
        id,
        name,
        content,
      }
    },
    variables: {
      id
    }
  });
};
//@ts-ignore
window.writeFileToCache = writeFileToCache;


const READ_FILE_QUERY = gql`
  query($id: String!){
    file(id: $id){
      id
      name
      content
    }
  }
`;
export const useFileContent = (id: string) => {
  const {
    data: {
      file: {
        name,
        id: _id,
        content,
      }
    } = {
      file: {
        id,
        name: undefined,
        content: undefined,
      }
    }
  } = useQuery(READ_FILE_QUERY, {
    variables: {
      id
    }
  });
  console.assert(id === _id);
  return { id, name, content };
};


async function initClipItemList(){
  try{
    console.log("loading folder content");
    const files = await GDL.listAppFolder();
    const l = files.reduce((l: any, r: any) => {
      if("id" in r){
        l.push({
          ...r,
          __typename: "ClipItem",
        });
        // GDL.deleteFileByID(r.id);
        let { id, name } = r;
        GDL.getFileAsText(id).then(text => {
          writeFileToCache({
            id,
            name,
            content: text
          });
        });
      }
      return l;
    }, []);

    client.writeQuery({
      query: CLIP_ITEM_LIST,
      data: {
        clip_items: l,
      }
    });
    /*
    setItemList({
      variables: {
        list: l
      }
    });
    */
  } catch(e){
    console.error(e);
  }
}


export function startListeningToChanges(){
  initClipItemList();
  return () => {
  
  };
}
