# API

The API should reside in its own lerna packed `red-client-api`.

## Architecture

The API should handle all interaction with the backend.
No riuntime class or widget should have any logic or knowledge of the backend, the protocol used or the API there.

Keep the client clean!

## Simulating server responses

Use [nock](https://www.npmjs.com/package/nock) to simulate server responses, including:

- full results
- empty results
- errors