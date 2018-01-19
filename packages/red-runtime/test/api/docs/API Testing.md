# API Testing

To test the client accessing backend APIs, please use [nock](https://www.npmjs.com/package/nock) to simulate server responses, including:

- full results
- empty results
- errors

## Adapter testing

Test each adapter on its own, then for each API write tests where the adapter is injected.

If possible, have some setting in the testing suite to configure which adapter will be used for API testing.