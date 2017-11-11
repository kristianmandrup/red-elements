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
    Context
} from '../context'

export class Library extends Context {
    constructor(ctx) {
        super(ctx)

        ctx.actions.add("core:library-export", exportFlow);

        ctx.events.on("view:selection-changed", function (selection) {
            if (!selection.nodes) {
                ctx.menu.setDisabled("menu-item-export", true);
                ctx.menu.setDisabled("menu-item-export-clipboard", true);
                ctx.menu.setDisabled("menu-item-export-library", true);
            } else {
                ctx.menu.setDisabled("menu-item-export", false);
                ctx.menu.setDisabled("menu-item-export-clipboard", false);
                ctx.menu.setDisabled("menu-item-export-library", false);
            }
        });

        if (ctx.settings.theme("menu.menu-item-import-library") !== false) {
            loadFlowLibrary();
        }

        this.exportToLibraryDialog = $('<div id="library-dialog" class="hide"><form class="dialog-form form-horizontal"></form></div>')
            .appendTo("body")
            .dialog({
                modal: true,
                autoOpen: false,
                width: 500,
                resizable: false,
                title: ctx._("library.exportToLibrary"),
                buttons: [{
                        id: "library-dialog-cancel",
                        text: ctx._("common.label.cancel"),
                        click: function () {
                            $(this).dialog("close");
                        }
                    },
                    {
                        id: "library-dialog-ok",
                        class: "primary",
                        text: ctx._("common.label.export"),
                        click: function () {
                            //TODO: move this to ctx.library
                            var flowName = $("#node-input-library-filename").val();
                            if (!/^\s*$/.test(flowName)) {
                                $.ajax({
                                    url: 'library/flows/' + flowName,
                                    type: "POST",
                                    data: $("#node-input-library-filename").attr('nodes'),
                                    contentType: "application/json; charset=utf-8"
                                }).done(function () {
                                    ctx.library.loadFlowLibrary();
                                    ctx.notify(ctx._("library.savedNodes"), "success");
                                }).fail(function (xhr, textStatus, err) {
                                    if (xhr.status === 401) {
                                        ctx.notify(ctx._("library.saveFailed", {
                                            message: ctx._("user.notAuthorized")
                                        }), "error");
                                    } else {
                                        ctx.notify(ctx._("library.saveFailed", {
                                            message: xhr.responseText
                                        }), "error");
                                    }
                                });
                            }
                            $(this).dialog("close");
                        }
                    }
                ],
                open: function (e) {
                    $(this).parent().find(".ui-dialog-titlebar-close").hide();
                },
                close: function (e) {}
            });
        this.exportToLibraryDialog.children(".dialog-form").append($(
            '<div class="form-row">' +
            '<label for="node-input-library-filename" data-i18n="[append]editor:library.filename"><i class="fa fa-file"></i> </label>' +
            '<input type="text" id="node-input-library-filename" data-i18n="[placeholder]editor:library.fullFilenamePlaceholder">' +
            '<input type="text" style="display: none;" />' + // Second hidden input to prevent submit on Enter
            '</div>'
        ));
    }

    loadFlowLibrary() {
        $.getJSON("library/flows", function (data) {
            //console.log(data);

            var buildMenu = function (data, root) {
                var i;
                var li;
                var a;
                var ul = document.createElement("ul");
                if (root === "") {
                    ul.id = "menu-item-import-library-submenu";
                }
                ul.className = "dropdown-menu";
                if (data.d) {
                    for (i in data.d) {
                        if (data.d.hasOwnProperty(i)) {
                            li = document.createElement("li");
                            li.className = "dropdown-submenu pull-left";
                            a = document.createElement("a");
                            a.href = "#";
                            var label = i.replace(/^node-red-contrib-/, "").replace(/^node-red-node-/, "").replace(/-/, " ").replace(/_/, " ");
                            a.innerHTML = label;
                            li.appendChild(a);
                            li.appendChild(buildMenu(data.d[i], root + (root !== "" ? "/" : "") + i));
                            ul.appendChild(li);
                        }
                    }
                }
                if (data.f) {
                    for (i in data.f) {
                        if (data.f.hasOwnProperty(i)) {
                            li = document.createElement("li");
                            a = document.createElement("a");
                            a.href = "#";
                            a.innerHTML = data.f[i];
                            a.flowName = root + (root !== "" ? "/" : "") + data.f[i];
                            a.onclick = function () {
                                $.get('library/flows/' + this.flowName, function (data) {
                                    ctx.view.importNodes(data);
                                });
                            };
                            li.appendChild(a);
                            ul.appendChild(li);
                        }
                    }
                }
                return ul;
            };
            var examples;
            if (data.d && data.d._examples_) {
                examples = data.d._examples_;
                delete data.d._examples_;
            }
            var menu = buildMenu(data, "");
            $("#menu-item-import-examples").remove();
            if (examples) {
                ctx.menu.addItem("menu-item-import", {
                    id: "menu-item-import-examples",
                    label: ctx._("menu.label.examples"),
                    options: []
                })
                $("#menu-item-import-examples-submenu").replaceWith(buildMenu(examples, "_examples_"));
            }
            //TODO: need an api in ctx.menu for this
            $("#menu-item-import-library-submenu").replaceWith(menu);
        });
    }

    createUI(options) {
        var libraryData = {};
        var selectedLibraryItem = null;
        var libraryEditor = null;

        // Orion editor has set/getText
        // ACE editor has set/getValue
        // normalise to set/getValue
        if (options.editor.setText) {
            // Orion doesn't like having pos passed in, so proxy the call to drop it
            options.editor.setValue = function (text, pos) {
                options.editor.setText.call(options.editor, text);
            }
        }
        if (options.editor.getText) {
            options.editor.getValue = options.editor.getText;
        }

        this.ui = new LibraryUI(options)
    }

    exportFlow() {
        let ctx = this.ctx
        //TODO: don't rely on the main dialog
        var nns = ctx.nodes.createExportableNodeSet(ctx.view.selection().nodes);
        $("#node-input-library-filename").attr('nodes', JSON.stringify(nns));
        this.exportToLibraryDialog.dialog("open");
    }
}
