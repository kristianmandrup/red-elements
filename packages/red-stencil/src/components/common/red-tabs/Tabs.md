# Tabs

We use the `Tabs.vue` as the base to work from initially.
We copy the Vue template to our `render` method.

```ts
  <div class="red-ui-tabs" id="my-tabs">
    <ul>
      <li class="red-ui-tab">hello</li>
      <li class="red-ui-tab">bye</li>
    </ul>
  </div>
```

Then we reuse the Vue component controller logic. Instead of mount, we simply use the constructor, or perhaps one of our component life cycle methods?

`DidLoad` or whatever (please try/check)

```ts
import { Tabs } from "../controllers/tabs";
import "../styles/tabs.scss";

export default {
  name: "tabs",
  mounted() {
    log("tabs");
    let options = {
      id: "my-tabs"
    };
    new Tabs(options);
  }
};
```

## Individual tab elements

We can enhance this by using individual tab elements: `red-tab`

```ts
  <div class="red-ui-tabs" id="my-tabs">
    <ul>
      <red-tab caption="hello" />
      <red-tab caption="bye" />
    </ul>
  </div>
```

## Original tabs widget

Looking at *node-red* project and searching for `tabs` in the code base, we find
the way it is used and the options it expects:

- `id` of element that should be made into a tabs
- `onchange` event handler that receives a change of `tab` (which tab is active)
- `minimumActiveTabWidth` number, min size of tabs

```js
editorTabs = RED.tabs.create({
    id:"palette-editor-tabs",
    onchange:function(tab) {
        $("#palette-editor .palette-editor-tab").hide();
        tab.content.show();
        if (filterInput) {
            filterInput.searchBox('value',"");
        }
        if (searchInput) {
            searchInput.searchBox('value',"");
        }
        if (tab.id === 'install') {
            if (searchInput) {
                searchInput.focus();
            }
        } else {
            if (filterInput) {
                filterInput.focus();
            }
        }
    },
    minimumActiveTabWidth: 110
});
```

## onchange

We can see that the `onchange` handler, hides all tabs, then only shows the one received, so it acts to control and activate which tab is shown (active) while hiding the others (inactive).

```js
onchange:function(tab) {
  $("#palette-editor .palette-editor-tab").hide();
  tab.content.show();
  // ...
```
