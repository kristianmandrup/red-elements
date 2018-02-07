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
} from '../container'

import {
  INotifications,
  II18n
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
  @lazyInject(TYPES.notifications) $notifications: INotifications
  @lazyInject(TYPES.i18n) $i18n: II18n

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
      $i18n,
      $notifications
    } = this
    $notifications.notify($i18n.t("library.savedType", {
      type: options.type
    }), "success", "", 0);
  }

  onPostError(error) {
    const {
      jqXHR
    } = error
    const {
      $i18n,
      $notifications
    } = this
    if (jqXHR.status === 401) {
      $notifications.notify($i18n.t("library.saveFailed", {
        message: $i18n.t("user.notAuthorized")
      }), "error", "", 0);
    } else {
      $notifications.notify($i18n.t("library.saveFailed", {
        message: jqXHR.responseText
      }), "error", "", 0);
    }
  }
}

