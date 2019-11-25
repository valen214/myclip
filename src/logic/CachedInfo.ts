

const ID_TO_NAME: { [id: string]: string } = {}

export const getNameByID = (id: string) => {
  return ID_TO_NAME[id]
}

export const saveName = (id: string, name: string) => {
  ID_TO_NAME[id] = name
}


const ID_TO_CHILDREN: { [id: string]: string[] } = {}

export const getChildren = (id: string) => {
  return ID_TO_CHILDREN[id]
}

export const saveChildren = (id: string, children: string[]) => {
  ID_TO_CHILDREN[id] = children
}

export const addChild = (id: string, child: string) => {
  ID_TO_CHILDREN[id].push(child)
}