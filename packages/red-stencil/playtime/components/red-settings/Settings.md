# Settings

Much ado about Settings...

## Definition

In `editor/settings.js`. The `init` factory is async and takes a `done` callback function as argument. Should be refactored using a `Promise`.

```js
RED.settings = (function () {

    var loadedSettings = {};

    var init = function (done) {
        var accessTokenMatch = /[?&]access_token=(.*?)(?:$|&)/.exec(window.location.search);
        if (accessTokenMatch) {
            var accessToken = accessTokenMatch[1];
            RED.settings.set("auth-tokens",{access_token: accessToken});
            window.location.search = "";
        }

        $.ajaxSetup({
            beforeSend: function(jqXHR,settings) {
                // Only attach auth header for requests to relative paths
                if (!/^\s*(https?:|\/|\.)/.test(settings.url)) {
                    var auth_tokens = RED.settings.get("auth-tokens");
                    if (auth_tokens) {
                        jqXHR.setRequestHeader("Authorization","Bearer "+auth_tokens.access_token);
                    }
                    jqXHR.setRequestHeader("Node-RED-API-Version","v2");
                }
            }
        });

        load(done);
    }

    return {
        init: init, // factory
        load: load,
        set: set,
        get: get,
        remove: remove,
        theme: theme
    }
})()
```

## Settings usage

In `editor/main.js`. It will thus call `loadEditor` after initialization is done!

```js
RED.i18n.init(function() {
    RED.settings.init(loadEditor);
})
```

Warning: Don't confuse and mix it up with the `settings` in the runtime :P
