# TypedInput

The `TypedInput` widget is structured as follows:

```js
import jQuery from 'jquery'

export function factory(RED) {
  // ...

  (function ($) {
    // ...

    $.widget("nodered.typedInput", {
      // ...
    })
  })(jQuery)
}
```

Many of the jQuery widgets use this pattern of packaging and initialization.

We have a `factory` method which takes a `RED` runtime context object.

The immediately invoked function expression [IIFE](https://en.wikipedia.org/wiki/Immediately-invoked_function_expression) creates a closure and initializes the jQuery widget `nodered.typedInput`.

We should then have a factory `.typedInput` function available on jQuery (selected) elements.

Any DOM element can then be turned into a `typedInput` widget by applying this factory function on it.

```js
// get hold of an element
// wrap DOM element as a jQuery element with jQuery/widget API available
let elem = $('my-elem')
// turn unto a typedInput widget
elem.typedInput(inputOpts)
```

## Sample use

Sample usage in `58-debug.html` node type configuration (in node-red project under `nodes/core`)

```js
$("#node-input-typed-complete").typedInput({
  types:['msg', {
    value:"full",
    label: RED._("node-red:debug.msgobj"),
    hasValue:false
  }]
});
```

Warning: There is a Validator function of the same name, taking different args

```js
$("#node-input-payload").typedInput('type',this.payloadType);
```

## Widget options

```js
var allOptions = {
  msg: {
    value: 'msg',
    label: 'msg.',
    validate: RED.utils.validatePropertyExpression
  },
  flow: {
    value: 'flow',
    label: 'flow.',
    validate: RED.utils.validatePropertyExpression
  },
  global: {
    value: 'global',
    label: 'global.',
    validate: RED.utils.validatePropertyExpression
  },
  str: {
    value: 'str',
    label: 'string',
    icon: icon('az')
  },
  num: {
    value: 'num',
    label: 'number',
    icon: icon('09'),
    validate: /^[+-]?[0-9]*\.?[0-9]*([eE][-+]?[0-9]+)?$/
  },
  bool: {
    value: 'bool',
    label: 'boolean',
    icon: icon('bool'),
    options: ['true', 'false']
  },
  json: {
    value: 'json',
    label: 'JSON',
    icon: icon('json'),
    validate: function (v) {
      try {
        JSON.parse(v);
        return true;
      } catch (e) {
        return false;
      }
    },
    expand: function () {
      var that = this;
      var value = this.value();
      try {
        value = JSON.stringify(JSON.parse(value), null, 4);
      } catch (err) {}
      RED.editor.editJSON({
        value: value,
        complete: function (v) {
          var value = v;
          try {
            value = JSON.stringify(JSON.parse(v));
          } catch (err) {}
          that.value(value);
        }
      })
    }
  },
  re: {
    value: 're',
    label: 'regular expression',
    icon: icon('re')
  },
  date: {
    value: 'date',
    label: 'timestamp',
    hasValue: false
  },
  jsonata: {
    value: 'jsonata',
    label: 'expression',
    icon: icon('expr'),
    validate: function (v) {
      try {
        jsonata(v);
        return true;
      } catch (e) {
        return false;
      }
    },
    expand: function () {
      var that = this;
      RED.editor.editExpression({
        value: this.value().replace(/\t/g, '\n'),
        complete: function (v) {
          that.value(v.replace(/\n/g, '\t'));
        }
      })
    }
  },
  bin: {
    value: 'bin',
    label: 'buffer',
    icon: icon('bin'),
    expand: function () {
      var that = this;
      RED.editor.editBuffer({
        value: this.value(),
        complete: function (v) {
          that.value(v);
        }
      })
    }
  }
};
```

You better ask on [node-red slack channel](node-red.slack.com) how it works internally.
