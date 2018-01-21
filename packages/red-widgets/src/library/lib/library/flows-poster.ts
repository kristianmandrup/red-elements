
import {
  Library
} from './'
import { Context } from '../../../context';
import { LibraryApi } from '../../../../../red-runtime/src/api/library-api';

const { log } = console

interface IDialog extends JQuery<HTMLElement> {
  dialog: Function
}

export class LibraryFlowsPoster extends Context {
  protected libraryApi: LibraryApi

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
      libraryApi,
      onPostSuccess,
      onPostError
    } = this

    this.libraryApi = new LibraryApi().configure({
      url
    })

    try {
      const result = await libraryApi.post(data)
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
