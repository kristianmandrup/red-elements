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

const keyMap = {
  "left": 37,
  "up": 38,
  "right": 39,
  "down": 40,
  "escape": 27,
  "enter": 13,
  "backspace": 8,
  "delete": 46,
  "space": 32,
  ";": 186,
  "=": 187,
  ",": 188,
  "-": 189,
  ".": 190,
  "/": 191,
  "\\": 220,
  "'": 222,
  "?": 191 // <- QWERTY specific
}
const metaKeyCodes = {
  16: true,
  17: true,
  18: true,
  91: true,
  93: true
}

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

import * as d3 from './d3'
import { KeyboardConfiguration } from './configuration';

export class Keyboard extends Context {
  public handlers = {};
  public partialState = null;
  public actionToKeyMap: IActionKeyMap = {}
  public defaultKeyMap = {};
  public mainElement: HTMLElement

  protected configuration: KeyboardConfiguration = new KeyboardConfiguration(this)

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
