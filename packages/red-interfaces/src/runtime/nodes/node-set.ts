export interface INodeSet {
  id: string
  name: string
  added: boolean
  module: any
  local: boolean
  types: string[]
  version: string
  pending_version: string,
  enabled: boolean
}
