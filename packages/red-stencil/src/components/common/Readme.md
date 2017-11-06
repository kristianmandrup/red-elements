# Common components

The Common components are the main building blocks used for other higher level components.

## Components

The name of a custom element must be of the form `\w+-(\w+-)*` ie, a word, then a dash, then alphanumeric. This is to avoid clashing with native elements which are all one word element.

A custom element is defined by a Javascript class and registered with a tag name, by convention the dasherized class name.

- `RedCheckBoxSet` ie. `red-checkbox-set` custom element
- `RedEditableList` ie. `red-editable-list` custom element
- ...

## TODO

Each of these components must be wrapped as a Custom Element via lit-html or StencilJS so they can be used as native HTML elements.

For now: Use the original JQuery widgets/components/elements as "controllers" to control most of the state and view logic.
