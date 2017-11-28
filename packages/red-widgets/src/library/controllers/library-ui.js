import {
  Context
} from './context'

import {
  default as $
} from 'jquery'

var ace = require('brace');
require('brace/mode/javascript');
require('brace/theme/monokai');

export class LibraryUI extends Context {
  constructor(options) {
    super(options.ctx)
    const ctx = options.ctx || options
    var libraryEditor;
    $('#node-input-name').css("width", "66%").after(
      '<div class="btn-group" style="margin-left: 5px;">' +
      '<a id="node-input-' + options.type + '-lookup" class="editor-button" data-toggle="dropdown"><i class="fa fa-book"></i> <i class="fa fa-caret-down"></i></a>' +
      '<ul class="dropdown-menu pull-right" role="menu">' +
      '<li><a id="node-input-' + options.type + '-menu-open-library" tabindex="-1" href="#">' + ctx._("library.openLibrary") + '</a></li>' +
      '<li><a id="node-input-' + options.type + '-menu-save-library" tabindex="-1" href="#">' + ctx._("library.saveToLibrary") + '</a></li>' +
      '</ul></div>'
    );
    $('#node-input-' + options.type + '-menu-open-library').click(function (e) {
      $("#node-select-library").children().remove();
      var bc = $("#node-dialog-library-breadcrumbs");
      bc.children().first().nextAll().remove();
      libraryEditor.setValue('', -1);

      $.getJSON("library/" + options.url, function (data) {
        $("#node-select-library").append(buildFileList("/", data));
        $("#node-dialog-library-breadcrumbs a").click(function (e) {
          $(this).parent().nextAll().remove();
          $("#node-select-library").children().first().replaceWith(buildFileList("/", data));
          e.stopPropagation();
        });
        $("#node-dialog-library-lookup").dialog("open");
      });

      e.preventDefault();
    });

    $('#node-input-' + options.type + '-menu-save-library').click(function (e) {
      //var found = false;
      var name = $("#node-input-name").val().replace(/(^\s*)|(\s*$)/g, "");

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

      $("#node-dialog-library-save").dialog("open");
      e.preventDefault();
    });
    libraryEditor = ace.edit('node-select-library-text');
    libraryEditor.setTheme("ace/theme/tomorrow");
    if (options.mode) {
      libraryEditor.getSession().setMode(options.mode);
    }
    libraryEditor.setOptions({
      readOnly: true,
      highlightActiveLine: false,
      highlightGutterLine: false
    });
    libraryEditor.renderer.$cursorLayer.element.style.opacity = 0;
    libraryEditor.$blockScrolling = Infinity;

    $("#node-dialog-library-lookup").dialog({
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
            $(this).dialog("close");
          }
        },
        {
          text: ctx._("common.label.load"),
          class: "primary",
          click: function () {
            if (selectedLibraryItem) {
              for (var i = 0; i < options.fields.length; i++) {
                var field = options.fields[i];
                $("#node-input-" + field).val(selectedLibraryItem[field]);
              }
              options.editor.setValue(libraryEditor.getValue(), -1);
            }
            $(this).dialog("close");
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


    $("#node-dialog-library-save-confirm").dialog({
      title: ctx._("library.saveToLibrary"),
      modal: true,
      autoOpen: false,
      width: 530,
      height: 230,
      buttons: [{
          text: ctx._("common.label.cancel"),
          click: function () {
            $(this).dialog("close");
          }
        },
        {
          text: ctx._("common.label.save"),
          class: "primary",
          click: function () {
            saveToLibrary(true);
            $(this).dialog("close");
          }
        }
      ]
    });
    $("#node-dialog-library-save").dialog({
      title: ctx._("library.saveToLibrary"),
      modal: true,
      autoOpen: false,
      width: 530,
      height: 230,
      buttons: [{
          text: ctx._("common.label.cancel"),
          click: function () {
            $(this).dialog("close");
          }
        },
        {
          text: ctx._("common.label.save"),
          class: "primary",
          click: function () {
            saveToLibrary(false);
            $(this).dialog("close");
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
        li.onclick = (function () {
          var dirName = v;
          return function (e) {
            var bcli = $('<li class="active"><span class="divider">/</span> <a href="#">' + dirName + '</a></li>');
            $("a", bcli).click(function (e) {
              $(this).parent().nextAll().remove();
              $.getJSON("library/" + options.url + root + dirName, function (data) {
                $("#node-select-library").children().first().replaceWith(buildFileList(root + dirName + "/", data));
              });
              e.stopPropagation();
            });
            var bc = $("#node-dialog-library-breadcrumbs");
            $(".active", bc).removeClass("active");
            bc.append(bcli);
            $.getJSON("library/" + options.url + root + dirName, function (data) {
              $("#node-select-library").children().first().replaceWith(buildFileList(root + dirName + "/", data));
            });
          }
        })();
        li.innerHTML = '<i class="fa fa-folder"></i> ' + v + "</i>";
        ul.appendChild(li);
      } else {
        // file
        li = this.buildFileListItem(v);
        li.innerHTML = v.name;
        li.onclick = (function () {
          var item = v;
          return function (e) {
            $(".list-selected", ul).removeClass("list-selected");
            $(this).addClass("list-selected");
            $.get("library/" + options.url + root + item.fn, function (data) {
              selectedLibraryItem = item;
              libraryEditor.setValue(data, -1);
            });
          }
        })();
        ul.appendChild(li);
      }
    }
    return ul;
  }

  saveToLibrary(overwrite,options) {
    var name = $("#node-input-name").val().replace(/(^\s*)|(\s*$)/g, "");
    var ctx=options.ctx;
    if (name === "") {
      name = ctx._("library.unnamedType", {
        type: options.type
      });
    }
    var filename = $("#node-dialog-library-save-filename").val().replace(/(^\s*)|(\s*$)/g, "");
    var pathname = $("#node-dialog-library-save-folder").val().replace(/(^\s*)|(\s*$)/g, "");
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
    var data = {};
    for (var i = 0; i < options.fields.length; i++) {
      var field = options.fields[i];
      if (field == "name") {
        data.name = name;
      } else {
        data[field] = $("#node-input-" + field).val();
      }
    }

    data.text = options.editor.getValue();
    $.ajax({
      url: "library/" + options.url + '/' + fullpath,
      type: "POST",
      data: JSON.stringify(data),
      contentType: "application/json; charset=utf-8"
    }).done(function (data, textStatus, xhr) {
      ctx.notify(ctx._("library.savedType", {
        type: options.type
      }), "success");
    }).fail(function (xhr, textStatus, err) {
      if (xhr.status === 401) {
        ctx.notify(ctx._("library.saveFailed", {
          message: ctx._("user.notAuthorized")
        }), "error");
      } else {
        // ctx.notify(ctx._("library.saveFailed", {
        //   message: xhr.responseText
        // }), "error");
      }
    });
  }
}
