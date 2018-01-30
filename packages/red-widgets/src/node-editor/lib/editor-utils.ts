import { NodeEditor } from '.'

import {
  container,
  delegate,
  Context,
  $
} from './_base'

@delegate({
  container,
})

/**
 * Editor Utils for NodeEditor
 */
export class EditorUtils extends Context {
  constructor(public editor: NodeEditor) {
    super()
  }

  stringToUTF8Array(str) {
    this._validateStr(str, 'str', 'stringToUTF8Array')
    var data = [];
    var i = 0,
      l = str.length;
    for (i = 0; i < l; i++) {
      var char = str.charCodeAt(i);
      if (char < 0x80) {
        data.push(char);
      } else if (char < 0x800) {
        data.push(0xc0 | (char >> 6));
        data.push(0x80 | (char & 0x3f));
      } else if (char < 0xd800 || char >= 0xe000) {
        data.push(0xe0 | (char >> 12));
        data.push(0x80 | ((char >> 6) & 0x3f));
        data.push(0x80 | (char & 0x3f));
      } else {
        i++;
        char = 0x10000 + (((char & 0x3ff) << 10) | (str.charAt(i) & 0x3ff));
        data.push(0xf0 | (char >> 18));
        data.push(0x80 | ((char >> 12) & 0x3f));
        data.push(0x80 | ((char >> 6) & 0x3f));
        data.push(0x80 | (char & 0x3f));
      }
    }
    return data;
  }
}
