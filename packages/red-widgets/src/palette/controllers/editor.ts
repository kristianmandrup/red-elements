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
import { Context, $ } from '../../common'

interface ISearchTerm extends JQuery<HTMLElement> {
}

interface IDialogWidget extends JQuery<HTMLElement> {
  dialog: Function
}
interface ISearchResults extends JQuery<HTMLElement> {
  editableList: Function
}

import { IRED, TYPES, container } from '../../setup/setup';
import getDecorators from 'inversify-inject-decorators';
import { Container, injectable, tagged, named } from 'inversify';
let { lazyInject } = getDecorators(container);
const {
  log
} = console
export class PaletteEditor extends Context {
  @lazyInject(TYPES.RED) RED: IRED;
  public disabled: Boolean = false
  public loadedList: Array<any> = [];
  public filteredList: Array<any> = [];
  public loadedIndex: Object = {};

  public typesInUse: Object = {};
  public nodeEntries: Object = {};
  public eventTimers: Object = {};
  public activeFilter: Object = '';

  public editorTabs: any;
  public filterInput: any;
  public searchInput: any;
  public nodeList: ISearchResults;
  public packageList: any;

  public settingsPane: any;
  public catalogueCount: any;

  public catalogueLoadStatus: Array<any> = [];
  public catalogueLoadStart: any
  public catalogueLoadErrors: Boolean = false;

  public activeSort: any = this.sortModulesAZ;

  constructor() {
    super()
    const RED = this.RED

    if (RED.settings.theme('palette.editable') === false) {
      return;
    }

    let {
      createSettingsPane,
      getSettingsPane
    } = this.rebind([
        'createSettingsPane',
        'getSettingsPane'
      ])

    let {
      settingsPane,
      editorTabs,
      filterInput,
      filteredList,
      refreshNodeModule,
      nodeEntries,
      nodeList,
      typesInUse,
    } = this.rebind([
        'refreshNodeModule',
      ])

    createSettingsPane();

    RED.userSettings.add({
      id: 'palette',
      title: RED._("palette.editor.palette"),
      get: getSettingsPane,
      close: function () {
        settingsPane.detach();
      },
      focus: function () {
        editorTabs.resize();
        setTimeout(function () {
          filterInput.focus();
        }, 200);
      }
    })

    RED.actions.add("core:manage-palette", function () {
      RED.userSettings.show('palette');
    });

    RED.events.on('registry:module-updated', function (ns) {
      refreshNodeModule(ns.module);
    });
    RED.events.on('registry:node-set-enabled', function (ns) {
      refreshNodeModule(ns.module);
    });
    RED.events.on('registry:node-set-disabled', function (ns) {
      refreshNodeModule(ns.module);
    });
    RED.events.on('registry:node-type-added', function (nodeType) {
      if (!/^subflow:/.test(nodeType)) {
        var ns = RED.nodes.registry.getNodeSetForType(nodeType);
        refreshNodeModule(ns.module);
      }
    });
    RED.events.on('registry:node-type-removed', function (nodeType) {
      if (!/^subflow:/.test(nodeType)) {
        var ns = RED.nodes.registry.getNodeSetForType(nodeType);
        refreshNodeModule(ns.module);
      }
    });
    RED.events.on('registry:node-set-added', function (ns) {
      refreshNodeModule(ns.module);
      for (var i = 0; i < filteredList.length; i++) {
        if (filteredList[i].info.id === ns.module) {
          var installButton = filteredList[i].elements.installButton;
          installButton.addClass('disabled');
          installButton.html(RED._('palette.editor.installed'));
          break;
        }
      }
    });
    RED.events.on('registry:node-set-removed', function (ns) {
      var module = RED.nodes.registry.getModule(ns.module);
      if (!module) {
        var entry = nodeEntries[ns.module];
        if (entry) {
          nodeList.editableList('removeItem', entry);
          delete nodeEntries[ns.module];
          for (var i = 0; i < filteredList.length; i++) {
            if (filteredList[i].info.id === ns.module) {
              var installButton = filteredList[i].elements.installButton;
              installButton.removeClass('disabled');
              installButton.html(RED._('palette.editor.install'));
              break;
            }
          }
        }
      }
    });
    RED.events.on('nodes:add', function (n) {
      if (!/^subflow:/.test(n.type)) {
        typesInUse[n.type] = (typesInUse[n.type] || 0) + 1;
        if (typesInUse[n.type] === 1) {
          var ns = RED.nodes.registry.getNodeSetForType(n.type);
          refreshNodeModule(ns.module);
        }
      }
    })
    RED.events.on('nodes:remove', function (n) {
      if (typesInUse.hasOwnProperty(n.type)) {
        typesInUse[n.type]--;
        if (typesInUse[n.type] === 0) {
          delete typesInUse[n.type];
          var ns = RED.nodes.registry.getNodeSetForType(n.type);
          refreshNodeModule(ns.module);
        }
      }
    })
  }

  semVerCompare(A, B) {
    var aParts = A.split(".").map(function (m) {
      return parseInt(m);
    });
    var bParts = B.split(".").map(function (m) {
      return parseInt(m);
    });
    for (var i = 0; i < 3; i++) {
      var j = aParts[i] - bParts[i];
      if (j < 0) {
        return -1
      }
      if (j > 0) {
        return 1
      }
    }
    return 0;
  }

  delayCallback(start, callback) {
    var delta = Date.now() - start;
    if (delta < 300) {
      delta = 300;
    } else {
      delta = 0;
    }
    setTimeout(function () {
      callback();
    }, delta);
  }

  changeNodeState(id, state, shade, callback) {
    const {
      delayCallback
    } = this.rebind([
        'delayCallback'
      ])


    shade.show();
    var start = Date.now();
    $.ajax({
      url: "nodes/" + id,
      type: "PUT",
      data: JSON.stringify({
        enabled: state
      }),
      contentType: "application/json; charset=utf-8"
    }).done(function (data, textStatus, xhr) {
      delayCallback(start, function () {
        shade.hide();
        callback();
      });
    }).fail(function (xhr, textStatus, err) {
      delayCallback(start, function () {
        shade.hide();
        callback(xhr);
      });
    })
  }

  installNodeModule(id, callback: Function, version?, shade?) {
    var requestBody = {
      module: id,
      version: null
    };
    if (callback === undefined) {
      callback = shade;
      shade = version;
    } else {
      requestBody.version = version;
    }
    shade.show();
    $.ajax({
      url: "nodes",
      type: "POST",
      data: JSON.stringify(requestBody),
      contentType: "application/json; charset=utf-8"
    }).done(function (data, textStatus, xhr) {
      shade.hide();
      callback();
    }).fail(function (xhr, textStatus, err) {
      shade.hide();
      callback(xhr);
    });
  }

  removeNodeModule(id, callback) {
    $.ajax({
      url: "nodes/" + id,
      type: "DELETE"
    }).done(function (data, textStatus, xhr) {
      callback();
    }).fail(function (xhr, textStatus, err) {
      callback(xhr);
    })
  }

  refreshNodeModuleList() {
    const {
      nodeEntries
    } = this

    for (var id in nodeEntries) {
      if (nodeEntries.hasOwnProperty(id)) {
        this._refreshNodeModule(id);
      }
    }
  }

  refreshNodeModule(module) {
    const {
      eventTimers
    } = this

    if (!eventTimers.hasOwnProperty(module)) {
      eventTimers[module] = setTimeout(() => {
        delete eventTimers[module];
        this._refreshNodeModule(module);
      }, 100);
    }
  }


  getContrastingBorder(rgbColor) {
    var parts = /^rgba?\(\s*(\d+),\s*(\d+),\s*(\d+)[,)]/.exec(rgbColor);
    if (parts) {
      var r = parseInt(parts[1]);
      var g = parseInt(parts[2]);
      var b = parseInt(parts[3]);
      var yiq = ((r * 299) + (g * 587) + (b * 114)) / 1000;
      if (yiq > 160) {
        r = Math.floor(r * 0.8);
        g = Math.floor(g * 0.8);
        b = Math.floor(b * 0.8);
        return "rgb(" + r + "," + g + "," + b + ")";
      }
    }
    return rgbColor;
  }

  formatUpdatedAt(dateString) {
    const {
      RED
    } = this

    var now = new Date();
    var d = new Date(dateString);
    var delta = (Date.now() - new Date(dateString).getTime()) / 1000;
    if (delta < 60) {
      return RED._('palette.editor.times.seconds');
    }
    delta = Math.floor(delta / 60);
    if (delta < 10) {
      return RED._('palette.editor.times.minutes');
    }
    if (delta < 60) {
      return RED._('palette.editor.times.minutesV', {
        count: delta
      });
    }

    delta = Math.floor(delta / 60);

    if (delta < 24) {
      return RED._('palette.editor.times.hoursV', {
        count: delta
      });
    }

    delta = Math.floor(delta / 24);

    if (delta < 7) {
      return RED._('palette.editor.times.daysV', {
        count: delta
      })
    }
    var weeks = Math.floor(delta / 7);
    var days = delta % 7;

    if (weeks < 4) {
      return RED._('palette.editor.times.weeksV', {
        count: weeks
      })
    }

    var months = Math.floor(weeks / 4);
    weeks = weeks % 4;

    if (months < 12) {
      return RED._('palette.editor.times.monthsV', {
        count: months
      })
    }
    var years = Math.floor(months / 12);
    months = months % 12;

    if (months === 0) {
      return RED._('palette.editor.times.yearsV', {
        count: years
      })
    } else {
      return RED._('palette.editor.times.year' + (years > 1 ? 's' : '') + 'MonthsV', {
        y: years,
        count: months
      })
    }
  }


  _refreshNodeModule(module) {
    const {
      nodeEntries,
      nodeList,
      typesInUse,
      getContrastingBorder,
      loadedIndex,
      semVerCompare,
    } = this

    if (!nodeEntries.hasOwnProperty(module)) {
      nodeEntries[module] = {
        info: this.RED.nodes.registry.getModule(module)
      };
      var index = [module];
      for (var s in nodeEntries[module].info.sets) {
        if (nodeEntries[module].info.sets.hasOwnProperty(s)) {
          index.push(s);
          index = index.concat(nodeEntries[module].info.sets[s].types)
        }
      }
      nodeEntries[module].index = index.join(",").toLowerCase();
      nodeList.editableList('addItem', nodeEntries[module]);
    } else {
      var moduleInfo = nodeEntries[module].info;
      var nodeEntry = nodeEntries[module].elements;
      if (nodeEntry) {
        var activeTypeCount = 0;
        var typeCount = 0;
        nodeEntries[module].totalUseCount = 0;
        nodeEntries[module].setUseCount = {};

        for (var setName in moduleInfo.sets) {
          if (moduleInfo.sets.hasOwnProperty(setName)) {
            var inUseCount = 0;
            var set = moduleInfo.sets[setName];
            var setElements = nodeEntry.sets[setName];

            if (set.enabled) {
              activeTypeCount += set.types.length;
            }
            typeCount += set.types.length;
            for (var i = 0; i < moduleInfo.sets[setName].types.length; i++) {
              var t = moduleInfo.sets[setName].types[i];
              inUseCount += (typesInUse[t] || 0);
              var swatch = setElements.swatches[t];
              if (set.enabled) {
                var def = this.RED.nodes.getType(t);
                if (def && def.color) {
                  swatch.css({
                    background: def.color
                  });
                  swatch.css({
                    border: "1px solid " + getContrastingBorder(swatch.css('backgroundColor'))
                  })

                } else {
                  swatch.css({
                    background: "#eee",
                    border: "1px dashed #999"
                  })
                }
              } else {
                swatch.css({
                  background: "#eee",
                  border: "1px dashed #999"
                })
              }
            }
            nodeEntries[module].setUseCount[setName] = inUseCount;
            nodeEntries[module].totalUseCount += inUseCount;

            if (inUseCount > 0) {
              setElements.enableButton.html(this.RED._('palette.editor.inuse'));
              setElements.enableButton.addClass('disabled');
            } else {
              setElements.enableButton.removeClass('disabled');
              if (set.enabled) {
                setElements.enableButton.html(this.RED._('palette.editor.disable'));
              } else {
                setElements.enableButton.html(this.RED._('palette.editor.enable'));
              }
            }
            setElements.setRow.toggleClass("palette-module-set-disabled", !set.enabled);
          }
        }
        var nodeCount = (activeTypeCount === typeCount) ? typeCount : activeTypeCount + " / " + typeCount;
        nodeEntry.setCount.html(this.RED._('palette.editor.nodeCount', {
          count: typeCount,
          label: nodeCount
        }));

        if (nodeEntries[module].totalUseCount > 0) {
          nodeEntry.enableButton.html(this.RED._('palette.editor.inuse'));
          nodeEntry.enableButton.addClass('disabled');
          nodeEntry.removeButton.hide();
        } else {
          nodeEntry.enableButton.removeClass('disabled');
          if (moduleInfo.local) {
            nodeEntry.removeButton.css('display', 'inline-block');
          }
          if (activeTypeCount === 0) {
            nodeEntry.enableButton.html(this.RED._('palette.editor.enableall'));
          } else {
            nodeEntry.enableButton.html(this.RED._('palette.editor.disableall'));
          }
          nodeEntry.container.toggleClass("disabled", (activeTypeCount === 0));
        }
      }
      if (moduleInfo.pending_version) {
        nodeEntry.versionSpan.html(moduleInfo.version + ' <i class="fa fa-long-arrow-right"></i> ' + moduleInfo.pending_version).appendTo(nodeEntry.metaRow)
        nodeEntry.updateButton.html(this.RED._('palette.editor.updated')).addClass('disabled').show();
      } else if (loadedIndex.hasOwnProperty(module)) {
        if (semVerCompare(loadedIndex[module].version, moduleInfo.version) === 1) {
          nodeEntry.updateButton.show();
          nodeEntry.updateButton.html(this.RED._('palette.editor.update', {
            version: loadedIndex[module].version
          }));
        } else {
          nodeEntry.updateButton.hide();
        }
      } else {
        nodeEntry.updateButton.hide();
      }
    }

  }

  filterChange(val) {
    let {
      activeFilter,
      nodeList,
      filterInput
    } = this

    activeFilter = val.toLowerCase();
    var visible = nodeList.editableList('filter');
    var size = nodeList.editableList('length');
    if (val === "") {
      filterInput.searchBox('count');
    } else {
      filterInput.searchBox('count', visible + " / " + size);
    }
  }


  handleCatalogResponse(err, catalog, index, v) {
    let {
      catalogueLoadStatus,
      catalogueLoadStart,
      catalogueCount,
      catalogueLoadErrors,
      loadedIndex,
      loadedList,
      searchInput
    } = this.rebind([
        'catalogueLoadStatus',
        'loadedIndex',
        'loadedList',
        'searchInput'
      ])

    catalogueLoadStatus.push(err || v);
    if (!err) {
      if (!v.modules) {
        this.handleError('handleCatalogResponse: v missing modules property', {
          v
        })
      }

      if (v.modules) {
        v.modules.forEach((m) => {
          loadedIndex[m.id] = m;
          m.index = [m.id];
          if (m.keywords) {
            m.index = m.index.concat(m.keywords);
          }
          if (m.updated_at) {
            m.timestamp = new Date(m.updated_at).getTime();
          } else {
            m.timestamp = 0;
          }
          m.index = m.index.join(",").toLowerCase();
        })
        loadedList = loadedList.concat(v.modules);
      }
      console.log("SEARCH INPUT", this.searchInput)
      this.searchInput.searchBox('count', loadedList.length);
    } else {
      catalogueLoadErrors = true;
    }
    if (catalogueCount > 1) {
      $(".palette-module-shade-status").html(this.RED._('palette.editor.loading') + "<br>" + catalogueLoadStatus.length + "/" + catalogueCount);
    }
    if (catalogueLoadStatus.length === catalogueCount) {
      if (catalogueLoadErrors) {
        this.RED.notify.call(this.RED._('palette.editor.errors.catalogLoadFailed', {
          url: catalog
        }), "error", false, 8000);
      }
      var delta = 250 - (Date.now() - catalogueLoadStart);
      setTimeout(() => {
        $("#palette-module-install-shade").hide();
      }, Math.max(delta, 0));

    }
  }


  initInstallTab() {
    let {
      searchInput,
      loadedList,
      loadedIndex,
      packageList,
      catalogueLoadStatus,
      catalogueLoadErrors,
      catalogueLoadStart,
      catalogueCount,
      handleCatalogResponse,
      refreshNodeModuleList,
    } = this.rebind([
        'handleCatalogResponse',
        'refreshNodeModuleList',
        'loadedList',
        'packageList'
      ])

    if (loadedList.length === 0) {
      loadedList = [];
      loadedIndex = {};
      if (!packageList) {
        // TODO: perhaps call createSettingsPane if packageList is not defined

        this.handleError('initInstallTab: packageList missing. Created in createSettingsPane', {
          instance: this
        })
      }

      if (!packageList.editableList) {
        this.handleError('initInstallTab: packageList missing editableList', {
          packageList
        })
      }

      packageList.editableList('empty');

      $(".palette-module-shade-status").html(this.RED._('palette.editor.loading'));
      var catalogues = this.RED.settings.theme('palette.catalogues') || ['https://catalogue.nodered.org/catalogue.json'];
      catalogueLoadStatus = [];
      catalogueLoadErrors = false;
      catalogueCount = catalogues.length;
      if (catalogues.length > 1) {
        $(".palette-module-shade-status").html(this.RED._('palette.editor.loading') + "<br>0/" + catalogues.length);
      }
      $("#palette-module-install-shade").show();
      catalogueLoadStart = Date.now();
      var handled = 0;
      catalogues.forEach((catalog, index) => {
        $.getJSON(catalog, {
          _: new Date().getTime()
        }, (v) => {
          handleCatalogResponse(null, catalog, index, v);
          refreshNodeModuleList();
        }).fail((jqxhr, textStatus, error) => {
          handleCatalogResponse(jqxhr, catalog, index);
        }).always(() => {
          handled++;
          if (handled === catalogueCount) {
            searchInput.searchBox('change');
          }
        })
      });
    }
    return this
  }

  refreshFilteredItems() {
    const {
      packageList,
      loadedList,
      filteredList,
      searchInput,
      activeSort
    } = this

    packageList.editableList('empty');

    if (!(searchInput && searchInput.searchBox)) {
      this.handleError('refreshFilteredItems: missing searchInput.searchBox', {
        searchInput
      })
    }

    var currentFilter = searchInput.searchBox('value').trim();
    if (currentFilter === "") {
      packageList.editableList('addItem', {
        count: loadedList.length
      })
      return;
    }
    filteredList.sort(activeSort);
    for (var i = 0; i < Math.min(10, filteredList.length); i++) {
      packageList.editableList('addItem', filteredList[i]);
    }
    if (filteredList.length === 0) {
      packageList.editableList('addItem', {});
    }

    if (filteredList.length > 10) {
      packageList.editableList('addItem', {
        start: 10,
        more: filteredList.length - 10
      })
    }
    return this
  }

  sortModulesAZ(A, B) {
    return A.info.id.localeCompare(B.info.id);
  }

  sortModulesRecent(A, B) {
    return -1 * (A.info.timestamp - B.info.timestamp);
  }

  getSettingsPane() {
    let {
      settingsPane,
      editorTabs,
      initInstallTab
    } = this.rebind([
        'editorTabs',
        'initInstallTab',
        'settingsPane'
      ])
    console.log("EDITORS", editorTabs);
    initInstallTab = initInstallTab.bind(this)

    initInstallTab();
    editorTabs.activateTab('nodes');
    return settingsPane;
  }

  createSettingsPane() {
    let {
      id,
      activeFilter,
      settingsPane,
      editorTabs,
      filterInput,
      filterChange,
      searchInput,
      nodeList,
      packageList,
      initInstallTab,
      loadedIndex,
      changeNodeState,
      refreshNodeModule,
      filteredList,
      loadedList,
      refreshFilteredItems,
      activeSort,
      sortModulesAZ,
      sortModulesRecent,
      nodeEntries,
      installNodeModule,
      formatUpdatedAt,
      removeNodeModule
    } = this.rebind([
        'changeNodeState',
        'refreshNodeModule',
        'refreshFilteredItems',
        'installNodeModule',
        "initInstallTab",
        "editorTabs",
        "nodeList"
      ])

    settingsPane = $('<div id="user-settings-tab-palette"></div>');
    var content = $('<div id="palette-editor">' +
      '<ul id="palette-editor-tabs"></ul>' +
      '</div>').appendTo(settingsPane);

    this.settingsPane = settingsPane

    let options = {
      element: settingsPane.find('#palette-editor-tabs'),
      onchange: (tab) => {
        content.find(".palette-editor-tab").hide();
        tab.content.show();
        if (filterInput) {
          filterInput.searchBox('value', "");
        }
        if (searchInput) {
          searchInput.searchBox('value', "");
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
    }
    editorTabs = this.RED.tabs.create(options, this.RED);
    this.editorTabs = editorTabs

    var modulesTab = $('<div>', {
      class: "palette-editor-tab"
    }).appendTo(content);

    editorTabs.addTab({
      id: 'nodes',
      label: this.RED._('palette.editor.tab-nodes'),
      content: modulesTab
    })

    var filterDiv = $('<div>', {
      class: "palette-search"
    }).appendTo(modulesTab);
    filterInput = $('<input type="text" data-i18n="[placeholder]palette.filter"></input>')
      .appendTo(filterDiv)

    filterInput.searchBox({
      delay: 200,
      change: () => {
        filterChange($(this).val());
      }
    });
    this.filterInput = filterInput

    nodeList = <ISearchResults>$('<ol>', {
      id: "palette-module-list",
      style: "position: absolute;top: 35px;bottom: 0;left: 0;right: 0px;"
    }).appendTo(modulesTab)

    nodeList.editableList({
      addButton: false,
      scrollOnAdd: false,
      sort: (A, B) => {
        return A.info.name.localeCompare(B.info.name);
      },
      filter: (data) => {
        if (activeFilter === "") {
          return true;
        }

        return (activeFilter === "") || (data.index.indexOf(activeFilter) > -1);
      },
      addItem: (container, i, object) => {
        var entry = object.info;
        if (entry) {
          var headerRow = $('<div>', {
            class: "palette-module-header"
          }).appendTo(container);
          var titleRow = $('<div class="palette-module-meta palette-module-name"><i class="fa fa-cube"></i></div>').appendTo(headerRow);
          $('<span>').html(entry.name).appendTo(titleRow);
          var metaRow = $('<div class="palette-module-meta palette-module-version"><i class="fa fa-tag"></i></div>').appendTo(headerRow);
          var versionSpan = $('<span>').html(entry.version).appendTo(metaRow);
          var buttonRow = $('<div>', {
            class: "palette-module-meta"
          }).appendTo(headerRow);
          var setButton = $('<a href="#" class="editor-button editor-button-small palette-module-set-button"><i class="fa fa-angle-right palette-module-node-chevron"></i> </a>').appendTo(buttonRow);
          var setCount = $('<span>').appendTo(setButton);
          var buttonGroup = $('<div>', {
            class: "palette-module-button-group"
          }).appendTo(buttonRow);

          var updateButton = $('<a href="#" class="editor-button editor-button-small"></a>').html(this.RED._('palette.editor.update')).appendTo(buttonGroup);
          updateButton.attr('id', 'up_' + Math.floor(Math.random() * 1000000000));
          updateButton.click((evt) => {
            evt.preventDefault();
            if ($(this).hasClass('disabled')) {
              return;
            }
            $("#palette-module-install-confirm").data('module', entry.name);
            $("#palette-module-install-confirm").data('version', loadedIndex[entry.name].version);
            $("#palette-module-install-confirm").data('shade', shade);

            $("#palette-module-install-confirm-body").html(entry.local ?
              this.RED._("palette.editor.confirm.update.body") :
              this.RED._("palette.editor.confirm.cannotUpdate.body")
            );
            $(".palette-module-install-confirm-button-install").hide();
            $(".palette-module-install-confirm-button-remove").hide();
            if (entry.local) {
              $(".palette-module-install-confirm-button-update").show();
            } else {
              $(".palette-module-install-confirm-button-update").hide();
            }

            const dialogWidget = <IDialogWidget>$("#palette-module-install-confirm")

            dialogWidget.dialog('option', 'title', this.RED._("palette.editor.confirm.update.title"))
            dialogWidget.dialog('open');
          })


          var removeButton = $('<a href="#" class="editor-button editor-button-small"></a>').html(this.RED._('palette.editor.remove')).appendTo(buttonGroup);
          removeButton.attr('id', 'up_' + Math.floor(Math.random() * 1000000000));
          removeButton.click((evt) => {
            evt.preventDefault();

            $("#palette-module-install-confirm").data('module', entry.name);
            $("#palette-module-install-confirm").data('shade', shade);
            $("#palette-module-install-confirm-body").html(this.RED._("palette.editor.confirm.remove.body"));
            $(".palette-module-install-confirm-button-install").hide();
            $(".palette-module-install-confirm-button-remove").show();
            $(".palette-module-install-confirm-button-update").hide();
            const dialogWidget = <IDialogWidget>$("#palette-module-install-confirm")

            dialogWidget
              .dialog('option', 'title', this.RED._("palette.editor.confirm.remove.title"))
              .dialog('open');
          })
          if (!entry.local) {
            removeButton.hide();
          }
          var enableButton = $('<a href="#" class="editor-button editor-button-small"></a>').html(this.RED._('palette.editor.disableall')).appendTo(buttonGroup);

          var contentRow = $('<div>', {
            class: "palette-module-content"
          }).appendTo(container);
          var shade = $('<div class="palette-module-shade hide"><img src="red/images/spin.svg" class="palette-spinner"/></div>').appendTo(container);

          object.elements = {
            updateButton: updateButton,
            removeButton: removeButton,
            enableButton: enableButton,
            setCount: setCount,
            container: container,
            shade: shade,
            versionSpan: versionSpan,
            sets: {}
          }
          setButton.click((evt) => {
            evt.preventDefault();
            if (container.hasClass('expanded')) {
              container.removeClass('expanded');
              contentRow.slideUp();
            } else {
              container.addClass('expanded');
              contentRow.slideDown();
            }
          })

          var setList = Object.keys(entry.sets)
          setList.sort((A, B) => {
            return A.toLowerCase().localeCompare(B.toLowerCase());
          });
          setList.forEach((setName) => {
            var set = entry.sets[setName];
            var setRow = $('<div>', {
              class: "palette-module-set"
            }).appendTo(contentRow);
            var buttonGroup = $('<div>', {
              class: "palette-module-set-button-group"
            }).appendTo(setRow);
            var typeSwatches = {};
            set.types.forEach(function (t) {
              var typeDiv = $('<div>', {
                class: "palette-module-type"
              }).appendTo(setRow);
              typeSwatches[t] = $('<span>', {
                class: "palette-module-type-swatch"
              }).appendTo(typeDiv);
              $('<span>', {
                class: "palette-module-type-node"
              }).html(t).appendTo(typeDiv);
            })

            var enableButton = $('<a href="#" class="editor-button editor-button-small"></a>').appendTo(buttonGroup);
            enableButton.click((evt) => {
              evt.preventDefault();
              if (object.setUseCount[setName] === 0) {
                var currentSet = this.RED.nodes.registry.getNodeSet(set.id);
                shade.show();
                var newState = !currentSet.enabled
                changeNodeState(set.id, newState, shade, function (xhr) {
                  if (xhr) {
                    if (xhr.responseJSON) {
                      this.RED.notify(this.RED._('palette.editor.errors.' + (newState ? 'enable' : 'disable') + 'Failed', {
                        module: id,
                        message: xhr.responseJSON.message
                      }));
                    }
                  }
                });
              }
            })

            object.elements.sets[set.name] = {
              setRow: setRow,
              enableButton: enableButton,
              swatches: typeSwatches
            };
          });
          enableButton.click(function (evt) {
            evt.preventDefault();
            if (object.totalUseCount === 0) {
              changeNodeState(entry.name, (container.hasClass('disabled')), shade, function (xhr) {
                if (xhr) {
                  if (xhr.responseJSON) {
                    this.RED.notify(this.RED._('palette.editor.errors.installFailed', {
                      module: id,
                      message: xhr.responseJSON.message
                    }));
                  }
                }
              });
            }
          })
          refreshNodeModule(entry.name);
        } else {
          $('<div>', {
            class: "red-ui-search-empty"
          }).html(this.RED._('search.empty')).appendTo(container);
        }
      }
    });

    this.nodeList = nodeList

    var installTab = $('<div>', {
      class: "palette-editor-tab hide"
    }).appendTo(content);

    editorTabs.addTab({
      id: 'install',
      label: this.RED._('palette.editor.tab-install'),
      content: installTab
    })

    var toolBar = $('<div>', {
      class: "palette-editor-toolbar"
    }).appendTo(installTab);

    var searchDiv = $('<div>', {
      class: "palette-search"
    }).appendTo(installTab);
    searchInput = $('<input type="text" data-i18n="[placeholder]palette.search"></input>')
      .appendTo(searchDiv)

    searchInput.searchBox({
      delay: 300,
      change: () => {
        var searchTerm = <ISearchTerm>$(this)
        var term: String = <String>searchTerm.val()
        term.trim().toLowerCase();
        if (searchTerm.length > 0) {
          filteredList = loadedList.filter(function (m) {
            return (m.index.indexOf(searchTerm) > -1);
          }).map(function (f) {
            return {
              info: f
            }
          });
          refreshFilteredItems();
          searchInput.searchBox('count', filteredList.length + " / " + loadedList.length);
        } else {
          searchInput.searchBox('count', loadedList.length);
          packageList.editableList('empty');
          packageList.editableList('addItem', {
            count: loadedList.length
          });

        }
      }
    });


    $('<span>').html(this.RED._("palette.editor.sort") + ' ').appendTo(toolBar);
    var sortGroup = $('<span class="button-group"></span>').appendTo(toolBar);
    var sortAZ = $('<a href="#" class="sidebar-header-button-toggle selected" data-i18n="palette.editor.sortAZ"></a>').appendTo(sortGroup);
    var sortRecent = $('<a href="#" class="sidebar-header-button-toggle" data-i18n="palette.editor.sortRecent"></a>').appendTo(sortGroup);

    sortAZ.click((e) => {
      e.preventDefault();
      if ($(this).hasClass("selected")) {
        return;
      }
      $(this).addClass("selected");
      sortRecent.removeClass("selected");
      activeSort = sortModulesAZ;
      refreshFilteredItems();
    });

    sortRecent.click((e) => {
      e.preventDefault();
      if ($(this).hasClass("selected")) {
        return;
      }
      $(this).addClass("selected");
      sortAZ.removeClass("selected");
      activeSort = sortModulesRecent;
      refreshFilteredItems();
    });


    var refreshSpan = $('<span>').appendTo(toolBar);
    var refreshButton = $('<a href="#" class="sidebar-header-button"><i class="fa fa-refresh"></i></a>').appendTo(refreshSpan);
    refreshButton.click((e) => {
      e.preventDefault();
      loadedList = [];
      loadedIndex = {};
      initInstallTab();
    })

    packageList = $('<ol>', {
      style: "position: absolute;top: 78px;bottom: 0;left: 0;right: 0px;"
    }).appendTo(installTab)

    packageList.editableList({
      addButton: false,
      scrollOnAdd: false,
      addItem: (container, i, object) => {
        if (object.count) {
          $('<div>', {
            class: "red-ui-search-empty"
          }).html(this.RED._('palette.editor.moduleCount', {
            count: object.count
          })).appendTo(container);
          return
        }
        if (object.more) {
          container.addClass('palette-module-more');
          var moreRow = $('<div>', {
            class: "palette-module-header palette-module"
          }).appendTo(container);
          var moreLink = $('<a href="#"></a>').html(this.RED._('palette.editor.more', {
            count: object.more
          })).appendTo(moreRow);
          moreLink.click(function (e) {
            e.preventDefault();
            packageList.editableList('removeItem', object);
            for (var i = object.start; i < Math.min(object.start + 10, object.start + object.more); i++) {
              packageList.editableList('addItem', filteredList[i]);
            }
            if (object.more > 10) {
              packageList.editableList('addItem', {
                start: object.start + 10,
                more: object.more - 10
              })
            }
          })
          return;
        }
        if (object.info) {
          var entry = object.info;
          var headerRow = $('<div>', {
            class: "palette-module-header"
          }).appendTo(container);
          var titleRow = $('<div class="palette-module-meta"><i class="fa fa-cube"></i></div>').appendTo(headerRow);
          $('<span>', {
            class: "palette-module-name"
          }).html(entry.name || entry.id).appendTo(titleRow);
          $('<a target="_blank" class="palette-module-link"><i class="fa fa-external-link"></i></a>').attr('href', entry.url).appendTo(titleRow);
          var descRow = $('<div class="palette-module-meta"></div>').appendTo(headerRow);
          $('<div>', {
            class: "palette-module-description"
          }).html(entry.description).appendTo(descRow);

          var metaRow = $('<div class="palette-module-meta"></div>').appendTo(headerRow);
          $('<span class="palette-module-version"><i class="fa fa-tag"></i> ' + entry.version + '</span>').appendTo(metaRow);
          $('<span class="palette-module-updated"><i class="fa fa-calendar"></i> ' + formatUpdatedAt(entry.updated_at) + '</span>').appendTo(metaRow);
          var buttonRow = $('<div>', {
            class: "palette-module-meta"
          }).appendTo(headerRow);
          var buttonGroup = $('<div>', {
            class: "palette-module-button-group"
          }).appendTo(buttonRow);
          var shade = $('<div class="palette-module-shade hide"><img src="red/images/spin.svg" class="palette-spinner"/></div>').appendTo(container);
          var installButton = $('<a href="#" class="editor-button editor-button-small"></a>').html(this.RED._('palette.editor.install')).appendTo(buttonGroup);
          installButton.click((e) => {
            e.preventDefault();
            if (!$(this).hasClass('disabled')) {
              $("#palette-module-install-confirm").data('module', entry.id);
              $("#palette-module-install-confirm").data('version', entry.version);
              $("#palette-module-install-confirm").data('url', entry.url);
              $("#palette-module-install-confirm").data('shade', shade);
              $("#palette-module-install-confirm-body").html(this.RED._("palette.editor.confirm.install.body"));
              $(".palette-module-install-confirm-button-install").show();
              $(".palette-module-install-confirm-button-remove").hide();
              $(".palette-module-install-confirm-button-update").hide();
              const dialogWidget = <IDialogWidget>$("#palette-module-install-confirm")
              dialogWidget
                .dialog('option', 'title', this.RED._("palette.editor.confirm.install.title"))
                .dialog('open');
            }
          })
          if (nodeEntries.hasOwnProperty(entry.id)) {
            installButton.addClass('disabled');
            installButton.html(this.RED._('palette.editor.installed'));
          }

          object.elements = {
            installButton: installButton
          }
        } else {
          $('<div>', {
            class: "red-ui-search-empty"
          }).html(this.RED._('search.empty')).appendTo(container);
        }
      }
    });

    this.packageList = packageList

    $('<div id="palette-module-install-shade" class="palette-module-shade hide"><div class="palette-module-shade-status"></div><img src="red/images/spin.svg" class="palette-spinner"/></div>').appendTo(installTab);

    $('<div id="palette-module-install-confirm" class="hide"><form class="form-horizontal"><div id="palette-module-install-confirm-body" class="node-dialog-confirm-row"></div></form></div>').appendTo(document.body);
    const dialogWidget = <IDialogWidget>$("#palette-module-install-confirm")
    dialogWidget.dialog({
      title: this.RED._('palette.editor.confirm.title'),
      modal: true,
      autoOpen: false,
      width: 550,
      height: "auto",
      buttons: [{
        text: this.RED._("common.label.cancel"),
        click: () => {
          const dialogWidget = <IDialogWidget>$(this)
          dialogWidget.dialog("close");
        }
      },
      {
        text: this.RED._("palette.editor.confirm.button.review"),
        class: "primary palette-module-install-confirm-button-install",
        click: () => {
          var url = $(this).data('url');
          window.open(url);
        }
      },
      {
        text: this.RED._("palette.editor.confirm.button.install"),
        class: "primary palette-module-install-confirm-button-install",
        click: () => {
          var id = $(this).data('module');
          var version = $(this).data('version');
          var shade = $(this).data('shade');
          installNodeModule(id, version, shade, function (xhr) {
            if (xhr) {
              if (xhr.responseJSON) {
                this.RED.notify(this.RED._('palette.editor.errors.installFailed', {
                  module: id,
                  message: xhr.responseJSON.message
                }));
              }
            }
          });
          const dialogWidget = <IDialogWidget>$(this)
          dialogWidget.dialog("close");
        }
      },
      {
        text: this.RED._("palette.editor.confirm.button.remove"),
        class: "primary palette-module-install-confirm-button-remove",
        click: () => {
          var id = $(this).data('module');
          var shade = $(this).data('shade');
          shade.show();
          removeNodeModule(id, function (xhr) {
            shade.hide();
            if (xhr) {
              if (xhr.responseJSON) {
                this.RED.notify(this.RED._('palette.editor.errors.removeFailed', {
                  module: id,
                  message: xhr.responseJSON.message
                }));
              }
            }
          })
          const dialogWidget = <IDialogWidget>$(this)
          dialogWidget.dialog("close");
        }
      },
      {
        text: this.RED._("palette.editor.confirm.button.update"),
        class: "primary palette-module-install-confirm-button-update",
        click: () => {
          var id = $(this).data('module');
          var version = $(this).data('version');
          var shade = $(this).data('shade');
          shade.show();
          installNodeModule(id, version, shade, (xhr) => {
            if (xhr) {
              if (xhr.responseJSON) {
                this.RED.notify(this.RED._('palette.editor.errors.updateFailed', {
                  module: id,
                  message: xhr.responseJSON.message
                }));
              }
            }
          });
          const dialogWidget = <IDialogWidget>$(this)
          dialogWidget.dialog("close");
        }
      }
      ]
    })
    return this
  }
}
