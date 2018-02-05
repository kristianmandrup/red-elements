export interface INodeCredentials {
  encryptedCredentials: any
  credentialCache: any
  credentialsDef: any
  removeDefaultKey: boolean
  encryptionEnabled: boolean
  encryptionAlgorithm: string
  encryptionKey: any

  load(credentials: any): Promise<any>
  add(id: string, creds: any): INodeCredentials
  get(id: string): any
  delete(id: string): INodeCredentials
  clean(config: any): INodeCredentials
  register(type: string, definition: any): INodeCredentials
  export(): Promise<any>
  dirty: boolean
}
