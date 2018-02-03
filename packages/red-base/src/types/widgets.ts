export const widgets = {
  canvas: 'ICanvas',
  view: 'ICanvas', // alias
  clipboard: 'IClipboard',
  common: {
    checkboxSet: 'ICheckboxSet',
    editableList: 'IEditableList',
    menu: 'IMenu',
    panel: 'IPanel',
    popover: 'IPopover',
    searchbox: 'ISearchbox',
    stack: 'IStack',
    tabs: 'ITabs',
    typedInput: 'ITypedInput',
    utils: 'ICommonUtils'
    // ...
  },
  deploy: 'IDeploy',
  keyboard: 'IKeyboard',
  library: 'ILibrary',
  main: 'IMain',
  diff: 'INodeDiff', // alias
  nodeDiff: 'INodeDiff',
  editor: 'INodeEditor', // alias
  nodeEditor: 'INodeEditor',
  notifications: 'INotifications',
  palette: 'IPalette',
  paletteEditor: 'IPaletteEditor',
  search: 'ISearch',
  sidebar: {
    main: 'ISidebar',
    info: 'ISidebarTabsInfo',
    tabs: 'ISidebarTabs',
  },
  subflow: 'ISublflow',
  state: 'IState',
  text: 'ITextFormat',
  touch: {
    main: 'ITouch', // ??
    radialMenu: 'IRadialMenu'
  },
  bidi: 'IBidi',
  tray: 'ITray',
  user: 'IUser',
  userSettings: 'IUserSettings',
  utils: 'IUtils',
  workspaces: 'IWorkspaces',
  // .. TODO: more const to type name bindings, one for each class to be bound
}

