# Test Infrastructure setup

Jest and mocks for internal dependencies needed for tests are configured in `test/_setup.ts`

```ts
// ...

jest
  .dontMock('fs')
  .dontMock('jquery')

const $ = require('jquery');
const fs = require('fs')

global.$ = $

global.jQuery = global.$
require('jquery-ui-dist/jquery-ui')

// ...
```

Please mock and stub whatever you need to make tests pass. Jest includes advanced mocking capabilities.
