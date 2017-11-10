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
