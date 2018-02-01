import {
  log,
  $,
  Context,
  container,
  delegateTarget,
  LibrariesApi
} from './_base'

import { LibraryUI } from './';

export interface ILibraryPoster {
  postLibrary(data: any, options: any)
  onPostSuccess(data, options: any)
  onPostError(error)
}

@delegateTarget({
  container,
})
export class LibraryPoster extends Context implements ILibraryPoster {
  protected librariesApi: LibrariesApi
  constructor(public ui: LibraryUI) {
    super()
  }

  async postLibrary(data: any, options: any) {
    const url = 'library/' + options.url + '/' + options.fullpath

    const {
      librariesApi,
      onPostSuccess,
      onPostError
    } = this

    this.librariesApi = new LibrariesApi().configure({
      url
    })

    try {
      const result = await librariesApi.create.one(data)
      onPostSuccess(result, options)
    } catch (error) {
      onPostError(error)
    }
  }

  onPostSuccess(data, options: any = {}) {
    const {
      RED
    } = this
    RED.notify(RED._("library.savedType", {
      type: options.type
    }), "success");
  }

  onPostError(error) {
    const {
      RED
    } = this
    const {
      jqXHR
    } = error

    if (jqXHR.status === 401) {
      RED.notify(RED._("library.saveFailed", {
        message: RED._("user.notAuthorized")
      }), "error");
    } else {
      RED.notify(RED._("library.saveFailed", {
        message: jqXHR.responseText
      }), "error");
    }
  }
}

