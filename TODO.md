# TODO

First make each of the original Node-red Editor components into Custom Elements (ie. Web Components) so that they can be re-used across any framework or web context, and are not constrained to a particular framework.

Then wrap the custom elements as Vue components and build up a Vue app, composed from these Vue components.

## Status

Currently the package [lit-html-element](https://www.npmjs.com/package/lit-html-element) has been defined as a dependency for each of the UI packages of this lerna project.

Next step is to wrap the components!

## Mocking the runtime/api

Until the new api/runtime are ready for showtime, we could potentially mock the dependency...
