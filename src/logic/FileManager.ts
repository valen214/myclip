



type Data = string | Blob

export interface FileType {
  id?: string
  parent?: FileType
  children?: { [name: string]: FileType }
  name?: string
  type?: string
  data?: string | Blob
  lastModified?: string

  watching?: boolean
  caching?: boolean

  remoteId?: string
  url?: string
  state?: string

  
  read(): Promise<FileType>
  write(data: string | Blob): Promise<FileType>
  list(): Promise<{ [name: string]: FileType }>
  del(): Promise<boolean | void>
  
  watch(func: () => void): Promise<FileType>
  unwatch(): Promise<FileType>
  cache(): Promise<FileType>
  uncache(): Promise<FileType>
}

export interface FileManager {
  init(config?: Object): Promise<void>
  read(arg: string | FileType): Promise<FileType>
  write(arg: string | FileType, data: string | Blob): Promise<FileType>
  mkdir(arg: string | FileType): Promise<FileType>
  list(arg: string | FileType): Promise<{ [name: string]: FileType }>
  del(arg: string | FileType): Promise<boolean | void>

  watch(arg: string | FileType, func: (f: FileType) => void): Promise<FileType>
  unwatch(arg: string | FileType): Promise<FileType>
  cache(arg: string | FileType): Promise<FileType>
  uncache(arg: string | FileType): Promise<FileType>
}