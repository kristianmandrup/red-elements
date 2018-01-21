import {
  Context,
  $
} from '../../context'

import { LibraryApi } from '@tecla5/red-runtime/src/api/library-api'

var ace = require('brace');
require('brace/mode/javascript');
require('brace/theme/monokai');

const { log } = console

export class LibraryUI extends Context {
  libraryEditor: any;
  selectedLibraryItem: any;
  protected libraryApi: LibraryApi

  constructor(public options) {
    super();
    this.selectedLibraryItem = options.selectedLibraryItem || {};
    const { ctx } = this

    $('#node-input-name').css("width", "66%").after(
      '<div class="btn-group" style="margin-left: 5px;">' +
      '<a id="node-input-' + options.type + '-lookup" class="editor-button" data-toggle="dropdown"><i class="fa fa-book"></i> <i class="fa fa-caret-down"></i></a>' +
      '<ul class="dropdown-menu pull-right" role="menu">' +
      '<li><a id="node-input-' + options.type + '-menu-open-library" tabindex="-1" href="#">' + ctx._("library.openLibrary") + '</a></li>' +
      '<li><a id="node-input-' + options.type + '-menu-save-library" tabindex="-1" href="#">' + ctx._("library.saveToLibrary") + '</a></li>' +
      '</ul></div>'
    );
    let {
      buildFileList,
      saveToLibrary
      } = this.rebind([
        'buildFileList',
        'saveToLibrary'
      ])
    $('#node-input-' + options.type + '-menu-open-library').click((e) => {
      $("#node-select-library").children().remove();
      var bc = $("#node-dialog-library-breadcrumbs");
      bc.children().first().nextAll().remove();
      this.libraryEditor.setValue('', -1);

      $.getJSON("library/" + options.url, (data) => {
        $("#node-select-library").append(buildFileList("/", data));
        $("#node-dialog-library-breadcrumbs a").click((e) => {
          $(this).parent().nextAll().remove();
          $("#node-select-library").children().first().replaceWith(buildFileList("/", data));
          e.stopPropagation();
        });
        (<any>$("#node-dialog-library-lookup")).dialog("open");
      });

      e.preventDefault();
    });

    $('#node-input-' + options.type + '-menu-save-library').click((e) => {
      //var found = false;
      var name = $("#node-input-name").val().toString().replace(/(^\s*)|(\s*$)/g, "");

      //var buildPathList = function(data,root) {
      //    var paths = [];
      //    if (data.d) {
      //        for (var i in data.d) {
      //            var dn = root+(root==""?"":"/")+i;
      //            var d = {
      //                label:dn,
      //                files:[]
      //            };
      //            for (var f in data.d[i].f) {
      //                d.files.push(data.d[i].f[f].fn.split("/").slice(-1)[0]);
      //            }
      //            paths.push(d);
      //            paths = paths.concat(buildPathList(data.d[i],root+(root==""?"":"/")+i));
      //        }
      //    }
      //    return paths;
      //};
      $("#node-dialog-library-save-folder").attr("value", "");

      var filename = name.replace(/[^\w-]/g, "-");
      if (filename === "") {
        filename = "unnamed-" + options.type;
      }
      $("#node-dialog-library-save-filename").attr("value", filename + ".js");

      //var paths = buildPathList(libraryData,"");
      //$("#node-dialog-library-save-folder").autocomplete({
      //        minLength: 0,
      //        source: paths,
      //        select: function( event, ui ) {
      //            $("#node-dialog-library-save-filename").autocomplete({
      //                    minLength: 0,
      //                    source: ui.item.files
      //            });
      //        }
      //});

      (<any>$("#node-dialog-library-save")).dialog("open");
      e.preventDefault();
    });
    this.libraryEditor = ace.edit('node-select-library-text');
    this.libraryEditor.setTheme("ace/theme/tomorrow");
    if (options.mode) {
      this.libraryEditor.getSession().setMode(options.mode);
    }
    this.libraryEditor.setOptions({
      readOnly: true,
      highlightActiveLine: false,
      highlightGutterLine: false
    });
    this.libraryEditor.renderer.$cursorLayer.element.style.opacity = 0;
    this.libraryEditor.$blockScrolling = Infinity;

    (<any>$("#node-dialog-library-lookup")).dialog({
      title: ctx._("library.typeLibrary", {
        type: options.type
      }),
      modal: true,
      autoOpen: false,
      width: 800,
      height: 450,
      buttons: [{
        text: ctx._("common.label.cancel"),
        click: function () {
          (<any>$(this)).dialog("close");
        }
      },
      {
        text: ctx._("common.label.load"),
        class: "primary",
        click: function () {
          if (this.selectedLibraryItem) {
            for (var i = 0; i < options.fields.length; i++) {
              var field = options.fields[i];
              $("#node-input-" + field).val(this.selectedLibraryItem[field]);
            }
            options.editor.setValue(this.libraryEditor.getValue(), -1);
          }
          (<any>$(this)).dialog("close");
        }
      }
      ],
      open: function (e) {
        var form = $("form", this);
        form.height(form.parent().height() - 30);
        $("#node-select-library-text").height("100%");
        $(".form-row:last-child", form).children().height(form.height() - 60);
      },
      resize: function (e) {
        var form = $("form", this);
        form.height(form.parent().height() - 30);
        $(".form-row:last-child", form).children().height(form.height() - 60);
      }
    });


    (<any>$("#node-dialog-library-save-confirm")).dialog({
      title: ctx._("library.saveToLibrary"),
      modal: true,
      autoOpen: false,
      width: 530,
      height: 230,
      buttons: [{
        text: ctx._("common.label.cancel"),
        click: function () {
          (<any>$(this)).dialog("close");
        }
      },
      {
        text: ctx._("common.label.save"),
        class: "primary",
        click: function () {
          saveToLibrary(true, {});
          (<any>$(this)).dialog("close");
        }
      }
      ]
    });
    (<any>$("#node-dialog-library-save")).dialog({
      title: ctx._("library.saveToLibrary"),
      modal: true,
      autoOpen: false,
      width: 530,
      height: 230,
      buttons: [{
        text: ctx._("common.label.cancel"),
        click: function () {
          (<any>$(this)).dialog("close");
        }
      },
      {
        text: ctx._("common.label.save"),
        class: "primary",
        click: function () {
          saveToLibrary(false, {});
          (<any>$(this)).dialog("close");
        }
      }
      ]
    });
  }

  buildFileListItem(item) {
    var li = document.createElement("li");
    li.onmouseover = function (e) {
      $(this).addClass("list-hover");
    };
    li.onmouseout = function (e) {
      $(this).removeClass("list-hover");
    };
    return li;
  }

  buildFileList(root, data) {
    var ul = document.createElement("ul");
    var li;
    for (var i = 0; i < data.length; i++) {
      var v = data[i];
      if (typeof v === "string") {
        // directory
        li = this.buildFileListItem(v);
        li.onclick = (() => {
          var dirName = v;
          return (e) => {
            var bcli = $('<li class="active"><span class="divider">/</span> <a href="#">' + dirName + '</a></li>');
            $("a", bcli).click((e) => {
              $(this).parent().nextAll().remove();
              $.getJSON("library/" + this.options.url + root + dirName, (data) => {
                $("#node-select-library").children().first().replaceWith(this.buildFileList(root + dirName + "/", data));
              });
              e.stopPropagation();
            });
            var bc = $("#node-dialog-library-breadcrumbs");
            $(".active", bc).removeClass("active");
            bc.append(bcli);
            $.getJSON("library/" + this.options.url + root + dirName, (data) => {
              $("#node-select-library").children().first().replaceWith(this.buildFileList(root + dirName + "/", data));
            });
          }
        })();
        li.innerHTML = '<i class="fa fa-folder"></i> ' + v + "</i>";
        ul.appendChild(li);
      } else {
        // file
        li = this.buildFileListItem(v);
        li.innerHTML = v.name;
        li.onclick = (() => {
          var item = v;
          return (e) => {
            $(".list-selected", ul).removeClass("list-selected");
            $(this).addClass("list-selected");
            $.get("library/" + this.options.url + root + item.fn, (data) => {
              this.selectedLibraryItem = item;
              this.libraryEditor.setValue(data, -1);
            });
          }
        })();
        ul.appendChild(li);
      }
    }
    return ul;
  }

  async saveToLibrary(overwrite, options) {
    var name = $("#node-input-name").val().toString().replace(/(^\s*)|(\s*$)/g, "");
    var ctx = options.ctx;
    if (name === "") {
      name = ctx._("library.unnamedType", {
        type: options.type
      });
    }
    var filename = $("#node-dialog-library-save-filename").val().toString().replace(/(^\s*)|(\s*$)/g, "");
    var pathname = $("#node-dialog-library-save-folder").val().toString().replace(/(^\s*)|(\s*$)/g, "");
    if (filename === "" || !/.+\.js$/.test(filename)) {
      ctx.notify(ctx._("library.invalidFilename"), "warning");
      return;
    }
    var fullpath = pathname + (pathname === "" ? "" : "/") + filename;
    if (!overwrite) {
      //var pathnameParts = pathname.split("/");
      //var exists = false;
      //var ds = libraryData;
      //for (var pnp in pathnameParts) {
      //    if (ds.d && pathnameParts[pnp] in ds.d) {
      //        ds = ds.d[pathnameParts[pnp]];
      //    } else {
      //        ds = null;
      //        break;
      //    }
      //}
      //if (ds && ds.f) {
      //    for (var f in ds.f) {
      //        if (ds.f[f].fn == fullpath) {
      //            exists = true;
      //            break;
      //        }
      //    }
      //}
      //if (exists) {
      //    $("#node-dialog-library-save-content").html(ctx._("library.dialogSaveOverwrite",{libraryType:options.type,libraryName:fullpath}));
      //    $("#node-dialog-library-save-confirm").dialog( "open" );
      //    return;
      //}
    }
    var queryArgs = [];
    var data: any = {};
    for (var i = 0; i < options.fields.length; i++) {
      var field = options.fields[i];
      if (field == "name") {
        data.name = name;
      } else {
        data[field] = $("#node-input-" + field).val();
      }
    }

    data.text = options.editor.getValue();

    const url = 'library/' + options.url + '/' + fullpath

    const {
      libraryApi,
      onPostSuccess,
      onPostError
    } = this

    this.libraryApi = new LibraryApi().configure({
      url
    })

    try {
      const result = await libraryApi.post(data)
      onPostSuccess(result, options)
    } catch (error) {
      onPostError(error)
    }
  }

  onPostSuccess(data, options: any = {}) {
    const {
      ctx
    } = this
    ctx.notify(ctx._("library.savedType", {
      type: options.type
    }), "success");
  }

  onPostError(error) {
    const {
      ctx
    } = this
    const {
      jqXHR
    } = error

    if (jqXHR.status === 401) {
      ctx.notify(ctx._("library.saveFailed", {
        message: ctx._("user.notAuthorized")
      }), "error");
    } else {
      ctx.notify(ctx._("library.saveFailed", {
        message: jqXHR.responseText
      }), "error");
    }
  }
}
