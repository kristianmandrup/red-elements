import {
  canvas,
  Canvas
} from './canvas'

import {
  common,
  Tabs,
  Stack,
  Menu,
  Popover,
  Searchbox,
  EditableList,
  CheckboxSet,
  TypedInput,
  CommonUtils,
} from './common'

import {
  Validators
} from './validators'

import {
  header
} from './header'

import {
  library,
  Library,
  LibraryUI
} from './library'

import {
  Main,
  IMain
} from './main'

import {
  User,
  IUser
} from './user'

import {
  TextFormat,
  Bidi
} from './text'

import {
  Actions,
  IActions
} from './actions'

import {
  Clipboard,
  IClipboard
} from './clipboard'

import {
  Deploy,
  IDeploy
} from './deploy'

import {
  Keyboard,
  IKeyboard
} from './keyboard'

import {
  Notifications,
  INotifications
} from './notifications'

import {
  STATE
} from './state'

import {
  IUtils,
  Utils
} from './utils'

import {
  diff,
  NodeDiff,
  INodeDiff
} from './node-diff'

import {
  editor,
  NodeEditor,
  INodeEditor
}
  from './node-editor'

import {
  Workspaces,
  workspaces,
  IWorkspaces
} from './workspaces'

import {
  palette,
  Palette,
  PaletteEditor,
  IPalette,
  IPaletteEditor
} from './palette'

import {
  sidebar,
  Sidebar,
  SidebarTab,
  SidebarTabInfo,
  TabInfoTips,
  ISidebar,
} from './sidebar'

import {
  settings,
  UserSettings,
  IUserSettings
} from './user-settings'

import {
  RadialMenu
} from './touch'

import {
  tray,
  Tray,
  ITray
} from './tray'

import {
  search,
  Search,
  TypeSearch,
  ISearch
} from './search'

export const libs = {
  canvas,
  common,
  library,
  editor,
  diff,
  palette,
  search,
  settings,
  sidebar,
  workspaces
}

export const widgets = {
  common,
  Tabs,
  Stack,
  Menu,
  Popover,
  Searchbox,
  EditableList,
  CheckboxSet,
  TypedInput,
  Main,
  User,
  Utils,
  Actions,
  Deploy,
  Keyboard,
  TextFormat,
  Bidi,
  Canvas,
  Notifications,
  Clipboard,
  RadialMenu,
  NodeEditor,
  Palette,
  PaletteEditor,
  NodeDiff,
  Library,
  LibraryUI,
  Tray,
  Sidebar,
  SidebarTab,
  SidebarTabInfo,
  TabInfoTips,
  Search,
  TypeSearch,
  UserSettings,
  Workspaces,
  Validators,
  CommonUtils,
}

export default libs

export {
  Main,
  User,
  Menu,
  Stack,
  Popover,
  Searchbox,
  EditableList,
  CheckboxSet,
  TypedInput,
  Utils,
  Canvas,
  Actions,
  Deploy,
  Keyboard,
  TextFormat,
  Bidi,
  Notifications,
  Clipboard,
  NodeEditor,
  Palette,
  PaletteEditor,
  NodeDiff,
  Library,
  LibraryUI,
  Tray,
  Sidebar,
  SidebarTab,
  SidebarTabInfo,
  TabInfoTips,
  Search,
  TypeSearch,
  UserSettings,
  Workspaces,
  Validators,
  RadialMenu,
  CommonUtils,
}

