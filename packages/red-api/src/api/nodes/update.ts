import {
  BaseApiUpdate
} from '../base'

export class UpdateNodes extends BaseApiUpdate {
  constructor(public url?: string) {
    super(url)
  }
}
