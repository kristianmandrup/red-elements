import {
  log,
  $,
  Context,
  container,
  delegateTarget,
  LibrariesApi
} from './_base'

import {
  lazyInject,
  $TYPES
} from '../../../_container'

import {
  INotifications
} from '../../../_interfaces'

const TYPES = $TYPES.all

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

  @lazyInject(TYPES.notify) notify: INotifications

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
      RED,
      notify
    } = this
    notify.notify(RED._("library.savedType", {
      type: options.type
    }), "success", "", 0);
  }

  onPostError(error) {
    const {
      RED
    } = this
    const {
      jqXHR
    } = error
    const { notify } = this
    if (jqXHR.status === 401) {
      notify.notify(RED._("library.saveFailed", {
        message: RED._("user.notAuthorized")
      }), "error", "", 0);
    } else {
      notify.notify(RED._("library.saveFailed", {
        message: jqXHR.responseText
      }), "error", "", 0);
    }
  }
}

