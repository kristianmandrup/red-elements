# Popover

Insights & observations about Popover widget...

## Popover widget

The popover factory closure

```js
RED.popover = (function() {
    var deltaSizes = {
        "default": {
            top: 10,
            leftRight: 17,
            leftLeft: 25
        },
        "small": {
            top: 5,
            leftRight: 8,
            leftLeft: 16
        }
    }
    function createPopover(options) {
        var target = options.target;
        var direction = options.direction || "right";
        var trigger = options.trigger;
        var content = options.content;
        var delay = options.delay;
        var width = options.width||"auto";
        var size = options.size||"default";
        if (!deltaSizes[size]) {
            throw new Error("Invalid RED.popover size value:",size);
        }

        var timer = null;
        var active;
        var div;

        var openPopup = function() {
          // ...
        }
    }

    return {
      create: createPopover
    }
})()
```

The `create` function takes the following main options:

- `target`: DOM element
- `direction: string` (default 'right')
- `trigger : function`
- `content: string`
- `delay: number` ms
- `width: number|string` (default `auto`)
- `size number|string` (default `default`)

### Popover create/usage examples

```js
var popover = RED.popover.create({
    target: element,
    direction: 'left',
    size: 'small',
    content: RED._(msg)
});
setTimeout(function() {
    popover.close();
},1000);
popover.open();
```
