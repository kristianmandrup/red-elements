export const isMacLike = navigator.platform.match(/(Mac|iPhone|iPod|iPad)/i) ? true : false;
export const isIOS = navigator.platform.match(/(iPhone|iPod|iPad)/i) ? true : false;
export const isMac = /Mac/i.test(window.navigator.platform);
export const cmdCtrlKey = '<span class="help-key">' + (isMacLike ? '&#8984;' : 'Ctrl') + '</span>';

// FF generates some different keycodes because reasons.
export const firefoxKeyCodeMap = {
  59: 186,
  61: 187,
  173: 189
}

export const keyMap = {
  'left': 37,
  'up': 38,
  'right': 39,
  'down': 40,
  'escape': 27,
  'enter': 13,
  'backspace': 8,
  'delete': 46,
  'space': 32,
  ';': 186,
  '=': 187,
  ',': 188,
  '-': 189,
  '.': 190,
  '/': 191,
  '\\': 220,
  "'": 222,
  '?': 191 // <- QWERTY specific
}
export const metaKeyCodes = {
  16: true,
  17: true,
  18: true,
  91: true,
  93: true
}
