## Architecture

Most classes extend the `Context` class which provides:

Automatic injection of `RED` global context constant. `RED` is injected as an instance variable on instance creation using a decorator.

Validation methods used to validate key function parameters.

Error/Warning handling via:

- `handleError`
- `logWarning`

Rebinding of methods via `rebind`
Setting of multiple instance vars via `setInstanceVars`

Please use these `Context` helper methods extensively, in order to avoid touching the original code and place more guards (ie. validations) to better track/debug errors.
