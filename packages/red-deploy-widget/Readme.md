# RED Deploy widget

Independent Deploy widget for node-red

Uses inversify and dependency injection in general to decouple all classes from implementation dependencies.

All dependencies are injected at runtime from containers with implementation bindings.

This means you can configure different bindings per context (test, dev etc.).

## Testing

### E2E

We will be using [CodeCept](codecept.io/) for E2E testing