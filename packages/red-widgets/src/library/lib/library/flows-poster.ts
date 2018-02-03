import {
  Library,
  lazyInject,
  $TYPES,
  log,
  Context,
  container,
  delegateTarget,
  LibrariesApi
} from './_base'

import {
  ISettings,
} from '@tecla5/red-runtime'

import {
  IMenu,
  INotifications
} from '../../../_interfaces'

const TYPES = $TYPES.all

interface IDialog extends JQuery<HTMLElement> {
  dialog: Function
}

export interface ILibraryFlowsPoster {
  postLibraryFlow(flowName)
  onPostSuccess(data)
  onPostError(error)
}

@delegateTarget({
  container,
})
export class LibraryFlowsPoster extends Context implements ILibraryFlowsPoster {

  @lazyInject(TYPES.library) library: ILibraryFlowsPoster
  @lazyInject(TYPES.notifications) notifications: INotifications

  protected librariesApi: LibrariesApi

  // constructor(public library: Library) {
  constructor() {
    super()
  }

  async postLibraryFlow(flowName) {
    const {
      RED
    } = this.library

    const url = 'library/flows/' + flowName
    const data = $("#node-input-library-filename").attr('nodes')

    const {
      librariesApi,
      onPostSuccess,
      onPostError,
    } = this

    this.librariesApi = new LibrariesApi().configure({
      url
    })

    try {
      const result = await librariesApi.create.one(data)
      onPostSuccess(result)
    } catch (error) {
      onPostError(error)
    }
  }

  onPostSuccess(data) {
    const {
      RED,
      library,
      notifications
    } = this

    library.loadFlowLibrary();
    notifications.notify(RED._("library.savedNodes"), "success", "", 0);
  }

  onPostError(error) {
    const {
      RED,
      notifications
    } = this

    const {
      xhr, textStatus, err
    } = error

    if (xhr.status === 401) {
      notifications.notify(RED._("library.saveFailed", {
        message: RED._("user.notAuthorized")
      }), "error", "", 0);
    } else {
      notifications.notify(RED._("library.saveFailed", {
        message: xhr.responseText
      }), "error", "", 0);
    }
  }
}
