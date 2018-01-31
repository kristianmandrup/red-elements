import {
  IHistory,
  History,

  Undo,
  IUndo
} from './history'

export {
  runtimeContainer,
  TYPES
} from './_container'


import {
  INode,
  IEvents
} from './interfaces'

import {
  JQueryAjaxAdapter,
  IBaseAdapter,
  BaseAdapter,
  IAjaxConfig,

  IBaseApi,
  DeploymentsApi,
  FlowsApi,
  I18nCatalogApi,
  LibrariesApi,
  NodesApi,
  SettingsApi,
  SessionsApi
} from './api'

export const api = {
  DeploymentsApi,
  FlowsApi,
  I18nCatalogApi,
  LibrariesApi,
  NodesApi,
  SettingsApi,
  SessionsApi
}

export {
  JQueryAjaxAdapter,
  IBaseAdapter,
  BaseAdapter,
  IAjaxConfig,

  IBaseApi,
  DeploymentsApi,
  FlowsApi,
  I18nCatalogApi,
  LibrariesApi,
  NodesApi,
  SettingsApi,
  SessionsApi
}


import {
  Node,
} from './node'

import {
  Nodes,
  INodes,

  NodesContext,
  INodesContext,

  INodeCredentials,
  NodeCredentials,

  // registry
  NodesRegistry,
  INodesRegistry,

  IInstaller,
  Installer,

  ILoader,
  Loader,

  ILocalFilesystem,
  LocalFilesystem,

  IRegistry,
  Registry,

  Flow,
  IFlow,

  Flows,
  IFlows,

  FlowUtils,
  IFlowUtils,

} from './nodes'

export {
  Node,

  Nodes,
  INodes,

  NodesContext,
  INodesContext,

  INodeCredentials,
  NodeCredentials,

  // registry
  NodesRegistry,
  INodesRegistry,

  IInstaller,
  Installer,

  ILoader,
  Loader,

  ILocalFilesystem,
  LocalFilesystem,

  IRegistry,
  Registry,

  Flow,
  IFlow,

  Flows,
  IFlows,

  FlowUtils,
  IFlowUtils,
}

export const nodes = {
  Node,

  Nodes,
  NodesContext,
  NodeCredentials,

  // registry
  NodesRegistry,
  Installer,
  Loader,
  LocalFilesystem,
  Registry,
}

export const flows = {
  // flows
  Flow,
  Flows,
  FlowUtils,
}

import {
  Communications,
  ICommunications
} from './comms'

import {
  Events
} from './events'

import {
  I18n,
  II18n
} from './i18n'

import {
  Settings,
  ISettings
} from './settings'

export {
  INode,
  IEvents,

  IHistory,
  History,

  Undo,
  IUndo,

  Communications,
  ICommunications,
  Events,
  I18n,
  II18n,
  Settings,
  ISettings
}

export const clazzes = {
  Communications,
  Events,
  I18n,
  Settings,

  Flow,
  Flows,
  FlowUtils,

  Node,

  Nodes,
  NodesContext,
  NodeCredentials,

  // registry
  NodesRegistry,
  Installer,
  Loader,
  LocalFilesystem,
  Registry,
}
