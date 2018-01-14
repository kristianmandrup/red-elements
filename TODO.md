# TODO

First make each of the original Node-red Editor components into Custom Elements (ie. Web Components) so that they can be re-used across any framework or web context, and are not constrained to a particular framework.

Then wrap the custom elements as Vue components and build up a Vue app, composed from these Vue components.

## red-runtime

Should possibly be renamed to red-runtime, to reflect that it contains the runtime (in-memory) model. For shared assets etc. we should have a red-assets module.

## red-widgets

Ensure all tests pass after major refactoring.

## stencil

### Status

Currently some skeleton StencilJS components have been defined for most of the original widgets/components in *red-widgets* package.

You can also see the *red-vue* package for reference (as this was the first attempt at wrapping the components)

Please see the [StenciJS specs](https://github.com/kristianmandrup/red-elements/blob/master/packages/red-stencil/Specs.md) for a full specification and development guide with examples.
