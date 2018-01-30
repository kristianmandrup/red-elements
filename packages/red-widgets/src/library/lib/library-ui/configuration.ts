import {
  LibraryUI
} from './'

import {
  log,
  Context,
  container,
  delegateTarget,
} from './_base'

import {
  ace
} from '../../../_libs'

interface IDialog extends JQuery<HTMLElement> {
  dialog: Function
}

@delegateTarget({
  container,
})
export class LibraryConfiguration extends Context {
  constructor(public ui: LibraryUI) {
    super()
  }

  set libraryEditor(editor) {
    this.ui.libraryEditor = editor
  }

  get libraryEditor() {
    return this.ui.libraryEditor
  }

  configure(options: any) {
    let {
      libraryEditor
    } = this
    const {
      RED
    } = this.ui

    let {
      buildFileList,
      saveToLibrary
      } = this.rebind([
        'buildFileList',
        'saveToLibrary'
      ])

    $('#node-input-name').css("width", "66%").after(
      '<div class="btn-group" style="margin-left: 5px;">' +
      '<a id="node-input-' + options.type + '-lookup" class="editor-button" data-toggle="dropdown"><i class="fa fa-book"></i> <i class="fa fa-caret-down"></i></a>' +
      '<ul class="dropdown-menu pull-right" role="menu">' +
      '<li><a id="node-input-' + options.type + '-menu-open-library" tabindex="-1" href="#">' + RED._("library.openLibrary") + '</a></li>' +
      '<li><a id="node-input-' + options.type + '-menu-save-library" tabindex="-1" href="#">' + RED._("library.saveToLibrary") + '</a></li>' +
      '</ul></div>'
    );
    $('#node-input-' + options.type + '-menu-open-library').click((e) => {
      $("#node-select-library").children().remove();
      var bc = $("#node-dialog-library-breadcrumbs");
      bc.children().first().nextAll().remove();
      libraryEditor.setValue('', -1);

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
    libraryEditor = ace.edit('node-select-library-text');
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
      title: RED._("library.typeLibrary", {
        type: options.type
      }),
      modal: true,
      autoOpen: false,
      width: 800,
      height: 450,
      buttons: [{
        text: RED._("common.label.cancel"),
        click: function () {
          (<any>$(this)).dialog("close");
        }
      },
      {
        text: RED._("common.label.load"),
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
      title: RED._("library.saveToLibrary"),
      modal: true,
      autoOpen: false,
      width: 530,
      height: 230,
      buttons: [{
        text: RED._("common.label.cancel"),
        click: function () {
          (<any>$(this)).dialog("close");
        }
      },
      {
        text: RED._("common.label.save"),
        class: "primary",
        click: function () {
          saveToLibrary(true, {});
          (<any>$(this)).dialog("close");
        }
      }
      ]
    });
    (<any>$("#node-dialog-library-save")).dialog({
      title: RED._("library.saveToLibrary"),
      modal: true,
      autoOpen: false,
      width: 530,
      height: 230,
      buttons: [{
        text: RED._("common.label.cancel"),
        click: function () {
          (<any>$(this)).dialog("close");
        }
      },
      {
        text: RED._("common.label.save"),
        class: "primary",
        click: function () {
          saveToLibrary(false, {});
          (<any>$(this)).dialog("close");
        }
      }
      ]
    });
  }
}
