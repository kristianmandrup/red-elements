export interface ISettingsPaneManager {
  getSettingsPane()
  createSettingsPane()
}

export class SettingsPaneManager implements ISettingsPaneManager {

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

    this.searchInput = searchInput

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

