import {
  Context,
  $
} from '../../../context'

import { LibraryApi } from '@tecla5/red-runtime/src/api/library-api'
import { LibraryUI } from './';

export class LibraryPoster extends Context {
  protected libraryApi: LibraryApi
  constructor(public ui: LibraryUI) {
    super()
  }

  async postLibrary(data: any, options: any) {
    const url = 'library/' + options.url + '/' + options.fullpath

    const {
      libraryApi,
      onPostSuccess,
      onPostError
    } = this

    this.libraryApi = new LibraryApi().configure({
      url
    })

    try {
      const result = await libraryApi.post(data)
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

