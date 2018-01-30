# End to End (E2E) test setup

All E2E testing will use [CodeCeptJS](http://codecept.io), a unified layer on top of popular test runners.

## Alternative E2E libs

Other E2E libraries for consideration:

- [Cypress](https://www.cypress.io/)
- [TestCafe](https://devexpress.github.io/testcafe/)
- [List of best Webdriver alternatives](https://www.slant.co/options/9649/alternatives/~wd-js-alternatives)

## CodeCeptJS

CodeceptJS provides a general high-level API which can easily be executed using one of popular test runner libraries:

- [WebDriverIO](http://webdriver.io/)
- [Protractor](http://www.protractortest.org/)
- [NightmareJS](http://www.nightmarejs.org/)
- [Appium](http://appium.io/)
- others (ie. community/custom adapters)

## Example

The tests read much like [Gherkin](https://github.com/cucumber/cucumber/wiki/Gherkin) syntax, as used by [Cucumber](https://cucumber.io/).

```txt
Feature('CodeceptJS Demonstration');

Scenario('submit form successfully', (I) => {
  I.amOnPage('/documentation')
  I.fillField('Email', 'hello@world.com')
  I.fillField('Password', '123456')
  I.checkOption('Active')
  I.checkOption('Male');
  I.click('Create User')
  I.see('User is valid')
  I.dontSeeInCurrentUrl('/documentation')
});
```

### Install CodeCeptJS

```bash
$ npm install -g codeceptjs
+ codeceptjs@1.1.2
```

## Puppeteer

We will be using the [Google Chrome Puppeteer driver API](https://github.com/GoogleChrome/puppeteer) a Headless Chrome Node API

Uses Google Chrome's Puppeteer library to run tests inside headless Chrome. Browser control is executed via DevTools without Selenium. This helper works with a browser out of the box with no additional tools required to install.

Requires [puppeteer](https://www.npmjs.com/package/puppeteer) package to be installed.

Puppeteer is based on the Google Chrome DevTools Protocol. It operates over Google Chrome directly without requireing additional tools like ChromeDriver.
Tests setup with Puppeteer can be started with `npm install` only.

[CodeceptJS Puppeteer](http://codecept.io/puppeteer/)

### Configuration

Make sure Puppeteer helper is enabled in codecept.json config:

```json
{ // ..
  "helpers": {
    "Puppeteer": {
      "url": "http://localhost",
      "show": false
    }
  }
  // ..
}
```

Turn on the `show` option if you want to follow test progress in a window.
This is very useful for debugging.

### Advanced config

The puppeteer helper is configured in `codecept.json`

- `url` base url of website to be tested
- `show` (optional, default: `false`) show Google Chrome window for debug.
- `disableScreenshots` (optional, default: `false`) don't save screenshot on failure.
- `uniqueScreenshotNames` (optional, default: `false`) option to prevent screenshot - `override` if you have scenarios with the same name in different suites.
- `waitForAction`: (optional) how long to wait after click, doubleClick or PressKey actions in ms. Default: `100`.
- `waitForTimeout`: (optional) default wait* timeout in ms. Default: `1000`.
- `windowSize`: (optional) default window size. Set a dimension like 640x480.
- `chrome`: (optional) pass additional Puppeteer run options.

### Writing Tests

CodeceptJS test should be created with gt command:

`$ codeceptjs gt`

### Setup

To start you need [CodeceptJS with Puppeteer](http://codecept.io/helpers/Puppeteer/) [packages](https://www.npmjs.com/package/codeceptjs-puppeteer) installed

```bash
npm install -g codeceptjs-puppeteer
+ codeceptjs-puppeteer@1.1.0
```

### Install Webdriver

Install [Webdriver.io](http://webdriver.io/)

```bash
$ npm install -g webdriverio
```

### Initialize codeceptjs project

`$ codeceptjs init`

Good to go! :)