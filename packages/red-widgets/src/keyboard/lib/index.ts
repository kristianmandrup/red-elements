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


const { log } = console

import {
  keyMap,
  metaKeyCodes
} from './codes'

interface IActionKeyMap {
  scope?: object,
  key?: string,
  user?: object
}

interface I18n extends JQuery<HTMLElement> {
  i18n: Function
}

interface ISearchBox extends JQuery<HTMLElement> {
  searchBox: Function
}

interface IEditableList extends JQuery<HTMLElement> {
  editableList: Function
}

// FF generates some different keycodes because reasons.
const firefoxKeyCodeMap = {
  59: 186,
  61: 187,
  173: 189
}

import {
  Context,
  $,
  Searchbox
} from '../../common'

import { KeyboardConfiguration } from './configuration';

import {
  delegator,
  container
} from '../../deploy/lib/container'

export interface IKeyboard {
  configure()
  add: Function
  remove(name: string)
  getShortcut(actionName: string)
  formatKey(key: string)
}

@delegator({
  container,
  map: {
    configuration: KeyboardConfiguration
  }
})
export class Keyboard extends Context {
  public handlers = {};
  public partialState = null;
  public actionToKeyMap: IActionKeyMap = {}
  public defaultKeyMap = {};
  public mainElement: HTMLElement

  protected configuration: KeyboardConfiguration

  constructor() {
    super()
    this.configure()
  }

  /**
  * Configure Keyboard
  */
  configure() {
    this.configuration.configure()
    return this
  }

}
