/**
 * Copyright JS Foundation and other contributors, http://js.foundation
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 **/
import {
  Context,
  $,
  Tabs,
  container,
  delegator,
  delegateTo
} from './_base'

import {
  SidebarTab
} from './tab'
import {
  SidebarTabInfo,
  ISidebarTabInfo
} from './tab-info'

export {
  SidebarTab
} from './tab'

export {
  SidebarTabInfo,
  TabInfoTips,
  ISidebarTabInfo
} from './tab-info'

// import 'jquery-ui-dist/jquery-ui'

import {
  Actions,
} from '../../..'

import {
  IActions,
  ITabs
} from '../../../_interfaces'

import { SidebarConfiguration } from './configuration';

@delegator({
  container,
  map: {
    configuration: SidebarConfiguration
  }
})
export class Sidebar extends Context {
  sidebarSeparator: any = {}
  knownTabs: any = {}
  tabs: any
  sidebar_tabs: any

  configuration: SidebarConfiguration = new SidebarConfiguration(this)

  constructor() {
    super()
    this.configure()
  }

  // Widget factorius

  /**
   * Create new Tabs
   * @param options
   */
  createTabs(options?) {
    // legacy: RED.tabs.create
    return new Tabs(options)
  }

  /**
   * Create new Actions
   * @param options
   */
  createActions(options) {
    return new Actions()
  }

  /**
   * Configure display of sidebar
   */
  @delegateTo('configuration')
  configure() {
    this.configuration.configure()
  }

  /**
   * Toggle sidebar open/closed
   * @param state
   */
  toggleSidebar(state: any) {
    let sidebar_tabs = this.sidebar_tabs
    let RED = this.RED

    if (!state) {
      $("#main-container").addClass("sidebar-closed");
    } else {
      $("#main-container").removeClass("sidebar-closed");
      sidebar_tabs.resize();
    }
    RED.events.emit("sidebar:resize");
  }

  /**
   * Show sidebar tab
   * @param id { string } Tab id
   */
  showSidebarTab(id?: string) {
    let {
      sidebar_tabs,
      RED
    } = this
    if (id) {
      if (!this.containsTab(id)) {
        sidebar_tabs.addTab(this.knownTabs[id]);
      }
      sidebar_tabs.activateTab(id);
      if (!RED.menu.isSelected("menu-item-sidebar")) {
        RED.menu.setSelected("menu-item-sidebar", true);
      }
    }
  }

  /**
   * Test if sidebar contains specific tab
   * @param id { string} Tab id
   */
  containsTab(id: string) {
    let sidebar_tabs = this.sidebar_tabs
    return sidebar_tabs.contains(id);
  }
}
