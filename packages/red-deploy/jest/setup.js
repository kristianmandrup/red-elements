require("babel-core/register")
require("babel-polyfill")

Object.defineProperty(document, 'queryCommandSupported', {
  value: function (command) {
    return true
  }
});

Object.defineProperty(document, 'execCommand', {
  value: function (aCommandName, aShowDefaultUI, aValueArgument) {
    return true
  }
});

// console.log('jest config', {
//   queryCommandSupported: document.queryCommandSupported,
// })
