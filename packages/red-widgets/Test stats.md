# Test stats

## Issues

- Canvas
  x Needs fix to missing `d3.event`
- Main container
  x all broken due to `red.js` in `@tecla5/red-shared`
- Node diff
  ✕ Diff: mergeDiff (2ms)
  ✕ Diff: createNodeConflictRadioBoxes (5ms)
  ✕ Diff: createNodeConflictRadioBoxes (2ms)
  ✕ Diff: createNodeConflictRadioBoxes (2ms)

## Canvas

```bash
$ jest src/canvas/test/canvas.test.ts
 FAIL  src/canvas/test/canvas.test.ts
  ✓ View: create (9ms)
  ✓ View: configureD3 (15ms)
  ✓ View: configureHandlers (5ms)
  ✓ View: configureActions
  ✓ View: configureEvents (1ms)
  ✓ View: configure (2ms)
  ✕ View: showDragLines (2ms)

Test Suites: 1 failed, 1 total
Tests:       1 failed, 6 passed, 7 total
```

```bash
  ● View: showDragLines

    handleOuterTouchStartEvent: d3 missing event object
```

## Common

```bash
$ jest src/common/test/controllers/

Test Suites: 1 failed, 21 passed, 22 total
Tests:       3 failed, 2 skipped, 367 passed, 372 total
```

`TypeError: this.RED.utils.validatePropertyExpression is not a function`

### Validators

```bash
$ jest src/common/test/controllers/utils/validators.test.ts
 PASS  src/common/test/controllers/utils/validators.test.ts
  ✓ validators: create (7ms)
  ✓ validators: number (1ms)
  ✓ validators: regex (1ms)
  ✓ validators: typedInput - number (1ms)
  ✓ validators: typedInput - flow (1ms)
  ✓ validators: typedInput - json

Test Suites: 1 passed, 1 total
Tests:       6 passed, 6 total
```

### Utils

```bash
$ jest src/common/test/controllers/utils/utils.test.ts
 PASS  src/common/test/controllers/utils/utils.test.ts
  ✓ utils: create (12ms)
  ✓ Utils: with string (4ms)
  ✓ Util: with number object (3ms)
  ✓ Util: with array object (7ms)
  ✓ Util: with exposeApi (7ms)
  ✓ Util: with getMessage (1ms)
  ✓ Util: with normalisePropertyExpression
  ✓ Util: with getNodeIcon (1ms)
  ✓ Util: getNodeIcon with node type tab
  ✓ Util: getNodeIcon with node type unknown
  ✓ Util: getNodeIcon with node type subflow
  ✓ Util: getNodeIcon default
  ✓ Util: makeExpandable  (1ms)

Test Suites: 1 passed, 1 total
Tests:       13 passed, 13 total
```

### CheckboxSet

```bash
$ jest src/common/test/controllers/checkbox-set.test.ts
 PASS  src/common/test/controllers/checkbox-set.test.ts
  ✓ CheckboxSet: is a class (3ms)
  ✓ CheckboxSet: widget can be created (44ms)
  ✓ CheckboxSet: can change (5ms)
  ✓ CheckboxSet: can add child (1ms)
  ✓ CheckboxSet: can add remove child
  ✓ CheckboxSet: can update child (4ms)
  ✓ CheckboxSet: can disable child (1ms)
  ✓ CheckboxSet: can state child (1ms)

  console.log src/common/test/controllers/checkbox-set.test.ts:9
    before all

Test Suites: 1 passed, 1 total
Tests:       8 passed, 8 total
```

### Menu

```bash
$ jest src/common/test/controllers/menu.test.ts
 PASS  src/common/test/controllers/menu.test.ts
  ✓ Menu: is a class (3ms)
  ✓ Menu: can be created from id with NO options (6ms)
  ✓ Menu: widget can be created with options (2ms)
  ✓ Menu: can be created from id with options (4ms)
  ✓ Menu: can be created from id with options (1ms)
  ✓ Menu: set item to be selected with selected item without options (1ms)
  ✓ Menu: item to be selected
  ✓ Menu: remove selection from selected item (2ms)
  ✓ Menu: set element disable and enable (1ms)
  ✓ Menu: set element to be enabled (1ms)
  ✓ Menu: add item with empty sub menu (1ms)
  ✓ Menu: add item with sub menu (5ms)
  ✓ Menu: add item with sub menu (2ms)
  ✓ Menu: remove item (3ms)
  ✓ Menu: setAction
  ✓ Menu: setAction without options
  ✓ Menu: create menu items with option id (1ms)
  ✓ Menu: create menu items with sub menu (3ms)
  ✓ Menu: create menu items with option icon to jpg (1ms)
  ✓ Menu: create menu items with option icon to null (2ms)
  ✓ Menu: create menu items with options onselect (3ms)
  ✓ Menu: create menu items with options href (1ms)
  ✓ Menu: create menu items with option options (3ms)
  ✓ Menu: trigger action with type string (2ms)
  ✓ Menu: trigger action with type function
  ✓ Menu: trigger action without callback (3ms)
  ✓ Menu: set initial state without options
  ✓ Menu: set initial state with options and RED setting true (2ms)
  ✓ Menu: set initial state with options RED setting true (6ms)
  ✓ Menu: set initial state with options RED setting false (1ms)
  ✓ Menu: set initial state with options selected true (1ms)
  ✓ Menu: set initial state with options selected false (1ms)
  ✓ Menu: toggle selection (1ms)

  console.log src/common/controllers/menu/index.ts:185
    No callback for id undefined

Test Suites: 1 passed, 1 total
Tests:       33 passed, 33 total
```

### Popover

```bash
$ jest src/common/test/controllers/popover.test.ts
 PASS  src/common/test/controllers/popover.test.ts
  ✓ Popover: is a class (6ms)
  ✓ Popover: widget can NOT be created without target elem (1ms)
  ✓ Popover: widget can be created from target elem (1ms)
  ✓ Popover: closePopup
  ✓ Popover: openPopup (85ms)
  ✓ Popover: setContent
  ✓ Popover: close (1ms)
  ✓ Popover: close with option (1ms)
  ✓ Popover: can open (41ms)
  ✓ Popover: can open with properties (44ms)
  ✓ Popover: with no matching size (1ms)
  ✓ Popover: open (41ms)
  ✓ Popover: open Popup with different options  (44ms)
  ✓ Popover: close Popup with different options  (1ms)
  ✓ Popover: target mouseleave (1ms)
  ✓ Popover: target click (1ms)

Test Suites: 1 passed, 1 total
Tests:       16 passed, 16 total
```

### Stack

```bash
$ jest src/common/test/controllers/stack.test.ts
 PASS  src/common/test/controllers/stack.test.ts
  ✓ Stack: is a class (7ms)
  ✓ Stack: widget can NOT be created without container elem (4ms)
  ✓ Stack: widget can be created from target elem
  ✓ Stack: can add(entry) (5ms)
  ✓ Stack: can add(entry) with visible false (2ms)
  ✓ Stack: can add(entry) with collapsible false (2ms)
  ✓ Stack : toggle is function and must return true (105ms)
  ✓ Stack : expand is function (68ms)
  ✓ Stack : isExpanded is function (2ms)
  ✓ Stack : collapse is function (59ms)
  ✓ Stack : collapse is function (3ms)
  ✓ Stack: can add(entry) if entry is not object
  ✓ Stack : toggle is function (61ms)
  ✓ Stack : expand is function (2ms)
  ✓ Stack: can toggle visiblity to true (1ms)
  ✓ Stack: can toggle visiblity to false (1ms)
  ✓ Stack: show() with entries
  ✓ Stack: header can be clicked (2ms)
  ✓ Stack: handle header clicked event with expanded to false (1ms)
  ✓ Stack: handle header clicked event with options singleExpanded to false
  ✓ Stack: hide() with entries

  console.log src/common/base/context.ts:23
    Stack must take a container: option that is a jQuery element { options: {} }

Test Suites: 1 passed, 1 total
Tests:       21 passed, 21 total
```

### TypedInput

```bash
$ jest src/common/test/controllers/typed-input.test.ts
 PASS  src/common/test/controllers/typed-input.test.ts
  ✓ TypedInput: is a class (4ms)
  ✓ TypedInput: widget can be created (127ms)
  ✓ TypedInput: widget can be resize (10ms)
  ✓ TypedInput: option can be clicked (110ms)
  ✓ TypedInput: desired width (30ms)
  ✓ TypedInput: value to be defined (2ms)
  ✓ TypedInput: can show type menu (92ms)
  ✓ TypedInput: can be focused (1ms)
  ✓ TypedInput: red-ui-typedInput can be focused (1ms)
  ✓ TypedInput: red-ui-typedInput can be blured (1ms)

Test Suites: 1 passed, 1 total
Tests:       10 passed, 10 total
```

### EditableList

```bash
$ jest src/common/test/controllers/editable-list.test.ts
 PASS  src/common/test/controllers/editable-list.test.ts
  ✓ EditableList: is a class (3ms)
  ✓ EditableList: widget can be created (143ms)
  ✓ EditableList: widget header created (116ms)
  ✓ EditableList: widget addItem with empty object (114ms)
  ✓ EditableList: widget addItem without data (117ms)
  ✓ EditableList: widget addItem without sort (115ms)
  ✓ EditableList: widget addItem with sort (115ms)
  ✓ EditableList: widget addItem with sort false (56ms)
  ✓ EditableList: widget addItem without removable option (59ms)
  ✓ EditableList: widget addItem without passing function (58ms)
  ✓ EditableList: widget addItems with array of items (61ms)
  ✓ EditableList: widget removeItems (60ms)
  ✓ EditableList: widget removeItems without passing function (56ms)
  ✓ EditableList: widget get Items (58ms)
  ✓ EditableList: empty element (53ms)
  ✓ EditableList: get element length (55ms)
  ✓ EditableList: set element height (74ms)
  ✓ EditableList: sort elements (52ms)
  ✓ EditableList: sort elements without function (54ms)
  ✓ EditableList: filter without argument (52ms)
  ✓ EditableList: filter with argument returning true (53ms)
  ✓ EditableList: filter with argument returning false (55ms)
  ✓ EditableList: filter with argument to execute catch block (54ms)
  ✓ EditableList: destroy editable list (55ms)
  ✓ EditableList: set width (69ms)
  ✓ EditableList: create element with auto height (55ms)
  ✓ EditableList: create element with minHeight to 0 (51ms)
  ✓ EditableList: create element with add button to false (52ms)
  ✓ EditableList: with RED null (54ms)
  ✓ EditableList: with RED null (57ms)
  ✓ EditableList: create widget without connect width (55ms)

Test Suites: 1 passed, 1 total
Tests:       31 passed, 31 total
```

### Panels

```bash
$ jest src/common/test/controllers/panels.test.ts
 PASS  src/common/test/controllers/panels.test.ts
  ✓ Panel: can NOT be created from id unless has 2 child elements (5ms)
  ✓ Panel: can be created from id when has 2 child elements (98ms)
  ✓ Panel: can start drag (25ms)
  ✓ Panel: can be draggable (17ms)
  ✓ Panel: can stop dragging (1ms)
  Panel
    ✓ is a class (3ms)

Test Suites: 1 passed, 1 total
Tests:       6 passed, 6 total
```

### Searchbox

```bash
$ jest src/common/test/controllers/search-box.test.ts
 PASS  src/common/test/controllers/search-box.test.ts
  ✓ Searchbox: is a class (3ms)
  ✓ Searchbox: widget can be created (9ms)
  ✓ Searchbox: can clear search input box (2ms)
  ✓ Searchbox: count (3ms)
  ✓ Searchbox: count with null parameter (1ms)
  ✓ Searchbox: count with empty string parameter
  ✓ Searchbox: count with value (47ms)
  ✓ Searchbox: change search text
  ✓ Searchbox: change get search text value (6ms)
  ✓ Searchbox: clear search text on escape button
  ✓ Searchbox: do not clear search text if escape button not pressed (1ms)
  ✓ Searchbox: change search text on key up

Test Suites: 1 passed, 1 total
Tests:       12 passed, 12 total
```

## Tabs

```bash
$ jest src/common/test/controllers/tabs.test.ts
 PASS  src/common/test/controllers/tabs.test.ts
  ✓ Tabs: is a class (12ms)
  ✓ Tabs: widget can NOT be created without id: or element: option (3ms)
  ✓ Tabs: widget can NOT be created without option type object (1ms)
  ✓ Tabs: widget can be created with element: option (2ms)
  ✓ Tabs: widget can set RED as 2nd option (2ms)
  ✓ Tabs: widget can be created from target elem (1ms)
  ✓ Tabs: widget can be created from different options (15ms)
  ✓ Tabs: handle add tab click event without options (2ms)
  ✓ Tabs: handle add tab click event without options add button (1ms)
  ✓ Tabs: scrollEventHandler (45ms)
  ✓ Tabs: onTabClick (13ms)
  ✓ Tabs: updateScroll (21ms)
  ✓ Tabs: updateScroll with blank div (5ms)
  ✓ Tabs: updateScroll with scroll left (33ms)
  ✓ Tabs: onTabDblClick (2ms)
  ✓ Tabs: activateTab (3ms)
  ✓ Tabs: activateTab (78ms)
  ✓ Tabs: activatePreviousTab (2ms)
  ✓ Tabs: activateNextTab (1ms)
  ✓ Tabs: updateTabWidths (10ms)
  ✓ Tabs: removeTab (2ms)
  ✓ Tabs: addTab(tab) - returns added and increases tab count (28ms)
  ✓ Tabs: addTab(tab) - add duplicate ignored (23ms)
  ✓ Tabs: addTabs(tabs) - returns added and increases tab count (29ms)
  ✓ Tabs: count (40ms)
  ✓ Tabs: contains - no such tab: false (2ms)
  ✓ Tabs: contains - has tab with id: true (3ms)
  ✓ Tabs: renameTab(id, label) - no such tab (2ms)
  ✓ Tabs: renameTab(id, label) - has such a tab (37ms)
  ✓ Tabs: ids (24ms)
  ✓ Tabs: existingTabOrder (24ms)
  ✓ Tabs: order (26ms)

Test Suites: 1 passed, 1 total
Tests:       32 passed, 32 total
```

Note: *2 tests skipped*

## Library

```bash
$ jest src/library/test/library.test.ts
 PASS  src/library/test/library.test.ts
  ✓ Library: create (102ms)
  ✓ Library: loadFlowLibrary (34ms)
  ✓ Library: createUI (138ms)
  ✓ Library: exportFlow (148ms)

Test Suites: 1 passed, 1 total
Tests:       4 passed, 4 total
```

## Main container

```bash
$ jest src/main-container/test/main.test.js

Test Suites: 1 failed, 1 total
```

```bash
TypeError: _1.History is not a constructor
  at Object.<anonymous> (node_modules/@tecla5/red-shared/src/red.ts:38:15)
  at Object.<anonymous> (node_modules/@tecla5/red-shared/src/index.ts:3:13)
```

## Node diff

```bash
$ jest src/node-diff/test/diff.test.ts
 FAIL  src/node-diff/test/diff.test.ts (9.795s)
  ✓ Diff: create (9ms)
  ✓ Diff: buildDiffPanel (119ms)
  ✓ Diff: buildDiffPanel (63ms)
  ✓ Diff: formatWireProperty (1ms)
  ✓ Diff: createNodeIcon (1ms)
  ✓ Diff: createNode (1ms)
  ✓ Diff: createNodeDiffRow (14ms)
  ✓ Diff: createNodePropertiesTable (5ms)
  ✓ Diff: getRemoteDiff (4ms)
  ✓ Diff: showRemoteDiff (1ms)
  ✓ Diff: showRemoteDiff
  ✓ Diff: parseNodes (1ms)
  ✓ Diff: generateDiff (1ms)
  ✓ Diff: resolveDiffs
  ✓ Diff: showDiff
  ✓ Diff: mergeDiff (3ms)
  ✓ Diff: buildDiffPanel with out contanier can not create panel (1ms)
  ✓ Diff: Tray options open
  ✓ Diff: Tray options close
  ✓ Diff: Tray options show
  ✓ Diff: Tray options resize
  ✓ Diff: can click tray options cancle button (1ms)
  ✓ Diff: showDiff
  ✓ Diff: can click tray options merge button
  ✕ Diff: mergeDiff (2ms)
  ✕ Diff: createNodeConflictRadioBoxes (5ms)
  ✕ Diff: createNodeConflictRadioBoxes (2ms)
  ✕ Diff: createNodeConflictRadioBoxes (2ms)
  ✓ Diff: can click diff selectbox (4ms)
  ✓ Diff:showRemoteDiff (2ms)

TypeError: Cannot read property 'toLowerCase' of undefined

Test Suites: 1 failed, 1 total
Tests:       4 failed, 26 passed, 30 total
```

## Palette

- palette
- palette editor

### Main Palette

```bash
$ jest src/palette/test/palette.test.ts
 PASS  src/palette/test/palette.test.ts
  ✓ Palette: created (294ms)
  ✓ Palette: createCategoryContainer (260ms)
  ✓ Palette: createCategoryContainer (290ms)
  ✓ Palette: setLabel(type, el, label, info) (251ms)
  ✓ Palette: escapeNodeType(nt) (273ms)
  ✓ Palette: addNodeType(nt, def) (268ms)
  ✓ Palette: removeNodeType(nt) (325ms)
  ✓ Palette: hideNodeType(nt) (247ms)
  ✓ Palette: showNodeType(nt) (245ms)
  ✓ Palette: refreshNodeTypes() (252ms)
  ✓ Palette: filterChange(val) (827ms)
  ✓ Palette: marked (258ms)

Test Suites: 1 passed, 1 total
Tests:       12 passed, 12 total
```

### Palette Editor

```
$ jest src/palette/test/palette-editor.test.ts
 PASS  src/palette/test/palette-editor.test.ts (5.902s)
  ✓ Editor: semVerCompare (299ms)
  ✓ Editor: delayCallback(start, callback) (246ms)
  ✓ Editor: changeNodeState(id, state, shade, callback) (252ms)
  ✓ Editor: installNodeModule(id, version, shade, callback) (247ms)
  ✓ Editor: removeNodeModule(id, callback) (247ms)
  ✓ Editor: refreshNodeModuleList() (249ms)
  ✓ Editor: refreshNodeModule(module) (242ms)
  ✓ Editor: getContrastingBorder(rgbColor) (252ms)
  ✓ Editor: formatUpdatedAt (241ms)
  ✓ Editor: _refreshNodeModule(module) (245ms)
  ✓ Editor: filterChange(val) (247ms)
  ✓ Editor: handleCatalogResponse(err, catalog, index, v) (249ms)
  ✓ Editor: initInstallTab() (253ms)
  ✓ Editor: refreshFilteredItems (250ms)
  ✓ Editor: sortModulesAZ(A, B) (243ms)
  ✓ Editor: sortModulesRecent(A, B) (243ms)
  ✓ Editor: getSettingsPane() - fails without createSettingsPane (233ms)
  ✓ Editor: createSettingsPane (493ms)
  ✓ Editor: getSettingsPane() - works after createSettingsPane (247ms)

Test Suites: 1 passed, 1 total
Tests:       19 passed, 19 total
```

## Node Editor

```bash
$ jest src/node-editor/test/editor.test.ts
 PASS  src/node-editor/test/editor.test.ts
  ✓ Editor: create (11ms)
  ✓ Editor: getCredentialsURL (2ms)
  ✓ Editor: validateNode (1ms)
  ✓ Editor: validateNodeProperties (1ms)
  ✓ Editor: validateNodeProperty (1ms)
  ✓ Editor: validateNodeEditorProperty
  ✓ Editor: validateNodeEditor (1ms)
  ✓ Editor: updateNodeProperties (1ms)
  ✓ Editor: prepareConfigNodeSelect (1ms)
  ✓ Editor: prepareConfigNodeButton (1ms)
  ✓ Editor: preparePropertyEditor
  ✓ Editor: attachPropertyChangeHandler (1ms)
  ✓ Editor: populateCredentialsInputs (1ms)
  ✓ Editor: updateNodeCredentials
  ✓ Editor: prepareEditDialog (7ms)
  ✓ Editor: getEditStackTitle (1ms)
  ✓ Editor: buildEditForm (6ms)
  ✓ Editor: refreshLabelForm (2ms)
  ✓ Editor: buildLabelRow (4ms)
  ✓ Editor: buildLabelForm (3ms)
  ✓ Editor: showEditDialog - subflow (298ms)
  ✓ Editor: showEditConfigNodeDialog (241ms)
  ✓ Editor: defaultConfigNodeSort
  ✓ Editor: updateConfigNodeSelect (1ms)
  ✓ Editor: showEditSubflowDialog (228ms)
  ✓ Editor: editExpression (237ms)
  ✓ Editor: editJSON (227ms)
  ✓ Editor: stringToUTF8Array - string (1ms)
  ✓ Editor: stringToUTF8Array - undefined
  ✓ Editor: editBuffer (221ms)
  ✓ Editor: createEditor (27ms)

Test Suites: 1 passed, 1 total
Tests:       31 passed, 31 total
```

```bash
    TypeError: Cannot read property 'searchBox' of undefined

      at PaletteEditor.handleCatalogResponse (src/palette/controllers/editor.ts:493:30)

    initInstallTab: packageList missing editableList

      at PaletteEditor.initInstallTab (src/palette/controllers/editor.ts:530:22)
```

`EditableList` jQuery Widget needs to be instantiated for `editableList` widget constructor to be available on jQuery element.

## Search

- search
- type search

### Main Search

```bash
$ jest src/search/test/search.test.ts
 PASS  src/search/test/search.test.ts
  ✓ Search: created (6ms)
  ✓ Search: disabled (1ms)
  ✓ Search: disable() (1ms)
  ✓ Search: enable()
  ✓ Search: indexNode (2ms)
  ✓ Search: indexWorkspace() (1ms)
  ✓ Search: search(val) - no searchResults, throws (1ms)
  ✓ Search: ensureSelectedIsVisible (118ms)
  ✓ Search: reveal (1ms)
  ✓ Search: hide - can hide when dialog is null (1ms)
  ✓ Search: show - can show when dialog is defined (102ms)
  ✓ Search: show - can show with disabled true
  ✓ Search: can show when visible true (90ms)
  ✓ Search: hide - can hide when visible true

Test Suites: 1 passed, 1 total
Tests:       14 passed, 14 total
```

### Type Search

```
$ jest src/search/test/type-search.test.ts
 PASS  src/search/test/type-search.test.ts
  ✓ TypeSearch: create (3ms)
  ✓ TypeSearch: search (1ms)
  ✓ TypeSearch: ensureSelectedIsVisible (121ms)
  ✓ TypeSearch: ensureSelectedIsVisible (54ms)
  ✓ TypeSearch: ensureSelectedIsVisible
  ✓ TypeSearch: createDialog (114ms)
  ✓ TypeSearch: createDialog (3ms)
  ✓ TypeSearch: confirm
  ✓ TypeSearch: handleMouseActivity (1ms)
  ✓ TypeSearch: handleMouseActivity (2ms)
  ✓ TypeSearch: handleMouseActivity (70ms)
  ✓ TypeSearch: handleMouseActivity (1ms)
  ✓ TypeSearch: show (22ms)
  ✓ TypeSearch: show (6ms)
  ✓ TypeSearch: show (7ms)
  ✓ TypeSearch: getTypeLabel
  ✓ TypeSearch: with paletteLabel undefine

Test Suites: 1 passed, 1 total
Tests:       17 passed, 17 total
```

## User settings

```bash
$ jest src/settings/test/user-settings.test.ts
 PASS  src/settings/test/user-settings.test.ts
  ✓ UserSettings: create (8ms)
  ✓ UserSettings: has viewSettings (1ms)
  ✓ UserSettings: can add pane (1ms)
  ✓ UserSettings: can show (1ms)
  ✓ UserSettings: can show with settingsVisible true
  ✓ UserSettings: createViewPane (8ms)
  ✓ UserSettings: can be selected (1ms)
  ✓ UserSettings: can be selected with option null (3ms)
  ✓ UserSettings: can toggle (1ms)
  ✓ UserSettings: can not able to toggle with invalid id
  ✓ UserSettings: with null action (1ms)

Test Suites: 1 passed, 1 total
Tests:       11 passed, 11 total
```

## Sidebar

- Main sidebar
- Tab config
- Tab info
- Tips

### Main Sidebar

```bash
$ jest src/sidebar/test/sidebar/sidebar.test.ts
 PASS  src/sidebar/test/sidebar/sidebar.test.ts
  ✓ Sidebar: create (20ms)
  ✓ Sidebar: sidebarSeparator (5ms)
  ✓ Sidebar: knownTabs (4ms)
  ✓ Sidebar: addTab - when not visible does not (really) add a tab (5ms)
  ✓ Sidebar: addTab - when visible really does add a tab (72ms)
  ✓ Sidebar: removeTab - if no such tab registered, ignore remove (18ms)
  ✓ Sidebar: removeTab - removes tab if registered (27ms)
  ✓ Sidebar: toggleSidebar (4ms)
  ✓ Sidebar: showSidebar (27ms)
  ✓ Sidebar: containsTab (15ms)

Test Suites: 1 passed, 1 total
Tests:       10 passed, 10 total
```

### Tab config

```bash
$ jest src/sidebar/test/sidebar/tab-config.test.ts
 PASS  src/sidebar/test/sidebar/tab-config.test.ts
  ✓ Sidebar TabConfig: create (25ms)
  ✓ Sidebar TabConfig: categories (10ms)
  ✓ TabConfig: getOrCreateCategory (14ms)
  ✓ TabConfig: createConfigNodeList (11ms)
  ✓ TabConfig: refreshConfigNodeList (15ms)
  ✓ TabConfig: show (13ms)

Test Suites: 1 passed, 1 total
Tests:       6 passed, 6 total
```

### Tab info

```bash
$ jest src/sidebar/test/sidebar/tab-info.test.ts
 FAIL  src/sidebar/test/sidebar/tab-info.test.ts
  ✓ Sidebar TabInfo: create (11ms)
  ✓ TabInfo: show (1ms)
  ✓ TabInfo: jsonFilter - empty key (1ms)
  ✓ TabInfo: jsonFilter (1ms)
  ✓ TabInfo: addTargetToExternalLinks (2ms)
  ✕ TabInfo: refresh (1ms)
  ✕ TabInfo: setInfoText (1ms)
  ✕ TabInfo: clear (1ms)
  ✕ TabInfo: set```

Test Suites: 1 failed, 1 total
Tests:       4 failed, 5 passed, 9 total
```

### Tip

```bash
$ jest src/sidebar/test/sidebar/tip.test.ts
 PASS  src/sidebar/test/sidebar/tip.test.ts
  ✓ Tips: create (8ms)
  ✓ Tips: setTip (39ms)
  ✓ Tips: cycleTips (17ms)
  ✓ Tips: startTips (3ms)
  ✓ Tips: stopTips (1ms)
  ✓ Tips: nextTip

Test Suites: 1 passed, 1 total
Tests:       6 passed, 6 total
```

## Tray

```bash
$ jest src/tray/test/tray.test.ts

 PASS  src/tray/test/tray.test.ts
  ✓ Tray: create (8ms)
  ✓ Tray: has stack (2ms)
  ✓ Tray: has editorStack
  ✓ Tray: create has openingTray to be false
  ✓ Tray: show (244ms)
  ✓ Tray: showTray (190ms)
  ✓ Tray: close (210ms)
  ✓ Tray: close (211ms)
  ✓ Tray: resize (1ms)
  ✓ Tray: handleWindowResize
  ✓ Tray: append element can be start dragging (213ms)
  ✓ Tray: append element can be draggable (251ms)
  ✓ Tray: append element can be stop dragging (203ms)

Test Suites: 1 passed, 1 total
Tests:       13 passed, 13 total
```

```bash
DeprecationWarning: Unhandled promise rejections are deprecated. In the future, promise rejections that are not handled will terminate the Node.js process with a non-zero exit code.
```

## Workspaces

```bash
$ jest src/workspaces/test/workspaces.test.ts
 PASS  src/workspaces/test/workspaces.test.ts
  ✓ Workspaces: create (16ms)
  ✓ tabs (4ms)
  ✓ tabs - when have tabs, not empty (221ms)
  ✓ tabIds - no tabs then no ids (4ms)
  ✓ tabIds (49ms)
  ✓ hasTabId - no tabs, has none matching on id (3ms)
  ✓ hasTabId - found when has tab with matching id (48ms)
  ✓ Workspaces: addWorkspace (49ms)
  ✓ Workspaces: deleteWorkspace (55ms)
  ✓ Workspaces: showRenameWorkspaceDialog (5ms)
  ✓ Workspaces: createWorkspaceTabs (8ms)
  ✓ Workspaces: editWorkspace (3ms)
  ✓ Workspaces: editWorkspace default: activeWorkspace (4ms)
  ✓ Workspaces: removeWorkspace (55ms)
  ✓ Workspaces: setWorkspaceOrder (98ms)
  ✓ Workspaces: contains - true when exists (54ms)
  ✓ Workspaces: contains - false when not (51ms)
  ✓ Workspaces: count - adds one after workspace added (105ms)
  ✓ Workspaces: active - with no workspace returns 0 (4ms)
  ✓ Workspaces: active - with activeWorkspace returns active workspace index (207ms)
  ✓ Workspaces: show - ignore if not exist (305ms)
  ✓ Workspaces: show - activate when exists (205ms)
  ✓ Workspaces: refresh (4ms)
  ✓ Workspaces: resize (62ms)

Test Suites: 1 passed, 1 total
Tests:       24 passed, 24 total
```
