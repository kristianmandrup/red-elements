
import {
  Library
} from './'

import {
  log,
  Context,
  container,
  delegateTarget,
  LibrariesApi
} from './_base'

interface IDialog extends JQuery<HTMLElement> {
  dialog: Function
}

@delegateTarget({
  container,
})
export class LibraryFlowsPoster extends Context {
  protected librariesApi: LibrariesApi

  constructor(public library: Library) {
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
      onPostError
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
      RED
    } = this

    RED.library.loadFlowLibrary();
    RED.notify(RED._("library.savedNodes"), "success");
  }

  onPostError(error) {
    const {
      RED
    } = this

    const {
      xhr, textStatus, err
    } = error

    if (xhr.status === 401) {
      RED.notify(RED._("library.saveFailed", {
        message: RED._("user.notAuthorized")
      }), "error");
    } else {
      RED.notify(RED._("library.saveFailed", {
        message: xhr.responseText
      }), "error");
    }
  }
}
