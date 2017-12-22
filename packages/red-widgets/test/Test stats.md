# Test stats

## Canvas

```bash
Test Suites: 1 failed, 1 total
Tests:       1 failed, 6 passed, 7 total
```

## Canvas

```bash
Test Suites: 1 failed, 1 total
Tests:       1 failed, 6 passed, 7 total
```

`d3 missing event object { event: null }`

## Common

```bash
Test Suites: 1 failed, 21 passed, 22 total
Tests:       3 failed, 4 skipped, 361 passed, 368 total
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
  ✓ Tabs: is a class (10ms)
  ✓ Tabs: widget can NOT be created without id: or element: option (5ms)
  ✓ Tabs: widget can NOT be created without option type object (1ms)
  ✓ Tabs: widget can be created with element: option (2ms)
  ✓ Tabs: widget can set RED as 2nd option (3ms)
  ✓ Tabs: widget can be created from target elem (1ms)
  ✓ Tabs: widget can be created from different options (10ms)
  ✓ Tabs: handle add tab click event without options (2ms)
  ✓ Tabs: handle add tab click event without options add button (1ms)
  ✓ Tabs: scrollEventHandler (47ms)
  ✓ Tabs: onTabClick (13ms)
  ✓ Tabs: updateScroll (25ms)
  ✓ Tabs: updateScroll with blank div (6ms)
  ✓ Tabs: updateScroll with scroll left (33ms)
  ✓ Tabs: onTabDblClick (1ms)
  ✓ Tabs: activateTab (5ms)
  ✓ Tabs: activateTab (79ms)
  ✓ Tabs: activatePreviousTab (3ms)
  ✓ Tabs: activateNextTab (2ms)
  ✓ Tabs: updateTabWidths (11ms)
  ✓ Tabs: removeTab (10ms)
  ✓ Tabs: addTab(tab) (27ms)
  ✓ Tabs: count (2ms)
  ✓ Tabs: contains - no such tab: false (2ms)
  ✓ Tabs: renameTab(id, label) - no such tab (2ms)
  ✓ Tabs: count (2ms)
  ○ skipped 2 tests

Test Suites: 1 passed, 1 total
Tests:       2 skipped, 26 passed, 28 total
```

Note: *2 tests skipped*

## Library

## Main container



```bash
$ jest src/main-container/test/main.test.js

 FAIL  src/main-container/test/main.test.js
  ● Test suite failed to run

    ReferenceError: regeneratorRuntime is not defined

  ✓ main: create (4ms)
  ✕ main: loadNodeList (1ms)
  ✕ main: loadNodes
  ✕ main: loadFlows
  ✕ main: showAbout
  ✕ main: loadEditor (1ms)

Test Suites: 2 failed, 2 total
Tests:       5 failed, 1 passed, 6 total
```

`ReferenceError: regeneratorRuntime is not defined`

`regeneratorRuntime is not defined` is a problem with Babel missing polyfill and runtime transformation!

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

## Node Editor

```bash
$ jest src/node-editor/test/editor.test.ts
 FAIL  src/node-editor/test/editor.test.ts
  ✓ Editor: create (10ms)
  ✓ Editor: getCredentialsURL (1ms)
  ✓ Editor: validateNode (1ms)
  ✓ Editor: validateNodeProperties
  ✓ Editor: validateNodeProperty (1ms)
  ✓ Editor: validateNodeEditor (1ms)
  ✕ Editor: validateNodeEditorProperty (7ms)
  ✓ Editor: updateNodeProperties (1ms)
  ✕ Editor: prepareConfigNodeSelect
  ✕ Editor: prepareConfigNodeButton (1ms)
  ✕ Editor: preparePropertyEditor
  ✕ Editor: attachPropertyChangeHandler (1ms)
  ✓ Editor: populateCredentialsInputs (1ms)
  ✓ Editor: updateNodeCredentials
  ✕ Editor: prepareEditDialog (1ms)
  ✕ Editor: getEditStackTitle (2ms)
  ✓ Editor: buildEditForm (4ms)
  ✕ Editor: refreshLabelForm (1ms)
  ✓ Editor: buildLabelRow (3ms)
  ✕ Editor: buildLabelForm (1ms)
  ✕ Editor: showEditDialog (2ms)
  ✕ Editor: showEditConfigNodeDialog (2ms)
  ✓ Editor: defaultConfigNodeSort (1ms)
  ✕ Editor: updateConfigNodeSelect (1ms)
  ✕ Editor: showEditSubflowDialog (2ms)
  ✕ Editor: editExpression (1ms)
  ✕ Editor: editJSON
  ✓ Editor: stringToUTF8Array (1ms)
  ✕ Editor: editBuffer (1ms)
  ✓ Editor: createEditor (28ms)

Test Suites: 1 failed, 1 total
Tests:       16 failed, 14 passed, 30 total
```

Some string concatenation gone wrong :P

```bash
Syntax error, unrecognized expression: #a-[object Object]

at Editor.validateNodeEditorProperty (src/node-editor/controllers/editor.ts:200:73)

at Editor.prepareConfigNodeSelect (src/node-editor/controllers/editor.ts:277:73)

at Editor.prepareConfigNodeButton (src/node-editor/controllers/editor.ts:337:73)

at Editor.preparePropertyEditor (src/node-editor/controllers/editor.ts:365:73)

at Editor.attachPropertyChangeHandler (src/node-editor/controllers/editor.ts:400:73)
```

`undefined` errors

```bash
   TypeError: Cannot read property 'defaults' of undefined

      at Editor.validateNodeEditor (src/node-editor/controllers/editor.ts:184:36)

    TypeError: Cannot read property 'inputLabels' of undefined

      at Editor.refreshLabelForm (src/node-editor/controllers/editor.ts:652:94)

    TypeError: Cannot read property 'inputs' of undefined

      at Editor.buildLabelForm (src/node-editor/controllers/editor.ts:787:214)

    TypeError: Cannot read property 'nodes' of undefined

      at Editor.showEditConfigNodeDialog (src/node-editor/controllers/editor.ts:1234:80)

    TypeError: Cannot read property 'length' of undefined

      at Editor.editExpression (src/node-editor/controllers/editor.ts:1789:23)

    TypeError: Cannot read property 'push' of undefined

      at Editor.editJSON (src/node-editor/controllers/editor.ts:2115:19)
```

## Palette

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

```bash
$ jest src/palette/test/palette-editor.test.ts
 FAIL  src/palette/test/palette-editor.test.ts (6.611s)
  ✓ Editor: semVerCompare (302ms)
  ✓ Editor: delayCallback(start, callback) (239ms)
  ✓ Editor: changeNodeState(id, state, shade, callback) (250ms)
  ✓ Editor: installNodeModule(id, version, shade, callback) (244ms)
  ✓ Editor: removeNodeModule(id, callback) (272ms)
  ✓ Editor: refreshNodeModuleList() (259ms)
  ✓ Editor: refreshNodeModule(module) (240ms)
  ✓ Editor: getContrastingBorder(rgbColor) (241ms)
  ✓ Editor: formatUpdatedAt (258ms)
  ✓ Editor: _refreshNodeModule(module) (295ms)
  ✓ Editor: filterChange(val) (264ms)
  ✕ Editor: handleCatalogResponse(err, catalog, index, v) (244ms)
  ✓ Editor: initInstallTab() (264ms)
  ✕ Editor: initInstallTab() (293ms)
  ✓ Editor: refreshFilteredItems (259ms)
  ✓ Editor: sortModulesAZ(A, B) (271ms)
  ✓ Editor: sortModulesRecent(A, B) (253ms)
  ✓ Editor: getSettingsPane() - fails without createSettingsPane (261ms)
  ✓ Editor: createSettingsPane (505ms)
  ✓ Editor: getSettingsPane() - works after createSettingsPane (267ms)

Test Suites: 1 failed, 1 total
Tests:       2 failed, 18 passed, 20 total
```

```bash
    TypeError: Cannot read property 'searchBox' of undefined

      at PaletteEditor.handleCatalogResponse (src/palette/controllers/editor.ts:493:30)

    initInstallTab: packageList missing editableList

      at PaletteEditor.initInstallTab (src/palette/controllers/editor.ts:530:22)
```

`EditableList` jQuery Widget needs to be instantiated for `editableList` widget constructor to be available on jQuery element.

## Search

```bash
$ jest src/search/test/search.test.ts
 FAIL  src/search/test/search.test.ts
  ✓ Search: created (5ms)
  ✓ Search: disabled (1ms)
  ✓ Search: disable()
  ✓ Search: enable() (1ms)
  ✕ Search: indexNode (6ms)
  ✕ Search: indexWorkspace()
  ✓ Search: search(val) - no searchResults, throws (1ms)
  ✓ Search: ensureSelectedIsVisible (116ms)
  ✕ Search: reveal (1ms)
  ✓ Search: can hide when dialog is null
  ✕ Search: can show when dialog is defined (1ms)
  ✓ Search: can show with disabled true
  ✕ Search: can show when visible true
  ✓ Search: can hide when visible true

Test Suites: 1 failed, 1 total
Tests:       5 failed, 9 passed, 14 total
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
 FAIL  src/sidebar/test/sidebar/sidebar.test.ts
  ✓ Sidebar: create (17ms)
  ✓ Sidebar: sidebarSeparator (4ms)
  ✓ Sidebar: knownTabs (3ms)
  ✓ Sidebar: addTab - adds a tab (4ms)
  ✓ Sidebar: toggleSidebar (4ms)
  ✕ Sidebar: showSidebar (4ms)

Test Suites: 1 failed, 1 total
Tests:       1 failed, 5 passed, 6 total
```

```bash
    TypeError: Cannot read property 'id' of undefined

      at Tabs.addTab (src/common/controllers/tabs/index.ts:300:18)
```

### Tab config

```bash
$ jest src/sidebar/test/sidebar/tab-config.test.ts

Test Suites: 1 failed, 1 total
```

```bash
    TypeError: Cannot set property 'info' of undefined

      at new Sidebar (src/sidebar/controllers/sidebar.ts:144:26)
```

### Tab info

```bash
$ jest src/sidebar/test/sidebar/tab-info.test.ts
 PASS  src/sidebar/test/sidebar/tab-info.test.ts
  ✓ Sidebar TabInfo: create (13ms)

Test Suites: 1 passed, 1 total
Tests:       1 passed, 1 total
```

### Tip

```bash
$ jest src/sidebar/test/sidebar/tip.test.ts
 PASS  src/sidebar/test/sidebar/tip.test.ts
  ✓ Tip: create (7ms)
  ✓ Tip: setTip (47ms)
  ✓ Tip: cycleTips (24ms)
  ✓ Tip: stopTips (2ms)
  ✓ Tip: nextTip

Test Suites: 1 passed, 1 total
Tests:       5 passed, 5 total
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
jest src/workspaces/test/workspaces.test.ts
 FAIL  src/workspaces/test/workspaces.test.ts
  ✓ Workspaces: create (14ms)
  ✕ Workspaces: addWorkspace (3ms)
  ✕ Workspaces: deleteWorkspace (2ms)
  ✕ Workspaces: showRenameWorkspaceDialog (4ms)
  ✕ Workspaces: createWorkspaceTabs (11ms)
  ✕ Workspaces: editWorkspace (8ms)
  ✕ Workspaces: removeWorkspace (4ms)
  ✕ Workspaces: setWorkspaceOrder (2ms)
  ✕ Workspaces: contains - true when exists (3ms)
  ✓ Workspaces: contains - false when not (3ms)
  ✓ Workspaces: count (2ms)
  ✓ Workspaces: active (3ms)
  ✕ Workspaces: show (2ms)
  ✕ Workspaces: refresh (2ms)
  ✕ Workspaces: resize (2ms)

Test Suites: 1 failed, 1 total
Tests:       11 failed, 4 passed, 15 total
```

```bash
   TypeError: Cannot set property 'tabs' of undefined

      at Workspaces.createWorkspaceTabs (src/workspaces/controllers/workspaces.ts:291:85)

    TypeError: Cannot read property 'deleteWorkspace' of undefined

      at Object.<anonymous>.test (src/workspaces/test/workspaces.test.ts:27:8)

    TypeError: Cannot read property 'showRenameWorkspaceDialog' of undefined

      at Object.<anonymous>.test (src/workspaces/test/workspaces.test.ts:32:8)

    TypeError: Cannot read property 'createWorkspaceTabs' of undefined

      at Object.<anonymous>.test (src/workspaces/test/workspaces.test.ts:36:8)

   TypeError: Cannot read property 'editWorkspace' of undefined

      at Object.<anonymous>.test (src/workspaces/test/workspaces.test.ts:41:8)

    TypeError: Cannot read property 'removeWorkspace' of undefined

      at Object.<anonymous>.test (src/workspaces/test/workspaces.test.ts:46:8)

    TypeError: Cannot read property 'setWorkspaceOrder' of undefined

      at Object.<anonymous>.test (src/workspaces/test/workspaces.test.ts:51:8)

    TypeError: Cannot read property 'contains' of undefined

      at Object.<anonymous>.test (src/workspaces/test/workspaces.test.ts:56:24)

  ....
```
