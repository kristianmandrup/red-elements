# Main container

The `main-container` is a container element and will display the elements it contains:

- red-workspace
- red-palette
- red-editor
- red-sidebar

The `render` method thus becomes (extracted from node-red mustache `.mst` template)

```ts
  render() {
    return (
      <div id="main-container" class="sidebar-closed hide">
        <red-workspace />
        <red-palette />
        <red-editor />
        <red-sidebar />
        <div id="sidebar-separator"></div>
      </div>
    );
  }
```
