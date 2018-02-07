/**
 * Copyright JS Foundation and other contributors, http://js.foundation
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 **/
import {
  Context,
  $,
  delegateTo,
  delegator,
  container
} from './_base'

import { LibraryUI } from '../library-ui'

import { LibraryConfiguration } from './configuration';
import { LibraryFlowsPoster, ILibraryFlowsPoster } from './flows-poster';
import { LibraryFlowsLoader, ILibraryFlowsLoader } from './flows-loader';

const { log } = console

import {
  ILibrary
} from './interface'
import { ILibraryFlowExporter } from './exporter';
import { ILibraryConfiguration } from '../library-ui/configuration';

export {
  ILibrary
}

@delegator({
  container,
  map: {
    libraryConfiguration: 'LibraryConfiguration',
    flowsPoster: 'LibraryFlowsPoster',
    flowsLoader: 'LibraryFlowsLoader',
    flowExporter: 'ILibraryFlowExporter'
  }
})
export class Library extends Context implements ILibrary {
  exportToLibraryDialog: any;
  flowName: any;
  ui: any;

  protected libraryConfiguration: ILibraryConfiguration
  protected flowsPoster: ILibraryFlowsPoster
  protected flowsLoader: ILibraryFlowsLoader
  protected flowExporter: ILibraryFlowExporter

  constructor() {
    super()
    const { ctx } = this
    this.configure()
  }

  @delegateTo('configuration')
  configure() {
    //this.libraryConfiguration.configure()
  }

  async postLibraryFlow(flowName) {
    return await this.flowsPoster.postLibraryFlow(flowName)
  }

  async loadFlowsLibrary() {
    return await this.flowsLoader.loadFlowsLibrary()
  }

  /**
   * TODO: use delegate class
   * Create Library UI
   * @param options
   */
  createUI(options) {
    var libraryData = {};
    var selectedLibraryItem = null;
    var libraryEditor = null;

    if (!options.editor) {
      this.handleError('createUI: missing editor: option', {
        options
      })
    }
    let editor = options.editor
    if (!(editor.setText || editor.getText || editor.setValue || editor.getValue)) {
      this.handleError('createUI: invalid editor', {
        editor
      })
    }

    // Orion editor has set/getText
    // ACE editor has set/getValue
    // normalise to set/getValue
    if (editor.setText) {
      // Orion doesn't like having pos passed in, so proxy the call to drop it
      editor.setValue = function (text, pos) {
        editor.setText.call(editor, text);
      }
    }
    if (editor.getText) {
      editor.getValue = editor.getText;
    }
    options.selectedLibraryItem = selectedLibraryItem;
    this.ui = new LibraryUI(options)
  }

  /**
   *
   */
  exportFlow() {
    this.flowExporter.exportFlow()
  }
}
