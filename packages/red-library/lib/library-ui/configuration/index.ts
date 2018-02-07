import {
  LibraryUI
} from '../'

import {
  log,
  Context,
  delegateTarget,
  lazyInject,
  $TYPES
} from '../_base'

import {
  ace
} from '../../../../_libs'
import { II18n } from '../../../../../../red-runtime/src/i18n/interface';

const TYPES = $TYPES.all

interface IDialog extends JQuery<HTMLElement> {
  dialog: Function
}

export interface ILibraryConfiguration {
  libraryEditor(editor)
  libraryEditor()
  configure(options: any)
}

@delegateTarget()
export class LibraryConfiguration extends Context implements ILibraryConfiguration {
  @lazyInject(TYPES.i18n) $i18n: II18n

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
      libraryEditor,
      $i18n
    } = this

    const {
      saveToLibrary,
      configLibraryEditor,
      configNodeInputUI,
      configLibraryLookupDialog,
      configLibrarySaveConfirmDialog,
      configLibrarySaveDialog
      } = this.rebind([
        'saveToLibrary',
        'configLibraryEditor',
        'configNodeInputUI',
        'configLibraryLookupDialog',
        'configLibrarySaveConfirmDialog',
        'configLibrarySaveDialog'
      ])

    configNodeInputUI(options)
    configLibraryEditor()

    // setup dialogs
    configLibraryLookupDialog(options)
    configLibrarySaveConfirmDialog(options, saveToLibrary)
    configLibrarySaveDialog(options, saveToLibrary)
  }

  configLibrarySaveDialog(options, saveToLibrary) {
    const {
      $i18n
    } = this;

    (<any>$("#node-dialog-library-save")).dialog({
      title: $i18n.t("library.saveToLibrary"),
      modal: true,
      autoOpen: false,
      width: 530,
      height: 230,
      buttons: [{
        text: $i18n.t("common.label.cancel"),
        click: function () {
          (<any>$(this)).dialog("close");
        }
      },
      {
        text: $i18n.t("common.label.save"),
        class: "primary",
        click: function () {
          saveToLibrary(false, {});
          (<any>$(this)).dialog("close");
        }
      }
      ]
    });
  }

  configLibrarySaveConfirmDialog(options, saveToLibrary) {
    const {
      $i18n
    } = this;

    (<any>$("#node-dialog-library-save-confirm")).dialog({
      title: $i18n.t("library.saveToLibrary"),
      modal: true,
      autoOpen: false,
      width: 530,
      height: 230,
      buttons: [{
        text: $i18n.t("common.label.cancel"),
        click: function () {
          (<any>$(this)).dialog("close");
        }
      },
      {
        text: $i18n.t("common.label.save"),
        class: "primary",
        click: function () {
          saveToLibrary(true, {});
          (<any>$(this)).dialog("close");
        }
      }
      ]
    });
  }

  configLibraryLookupDialog(options) {
    const {
      $i18n
    } = this;

    (<any>$("#node-dialog-library-lookup")).dialog({
      title: $i18n.t("library.typeLibrary", {
        type: options.type
      }),
      modal: true,
      autoOpen: false,
      width: 800,
      height: 450,
      buttons: [{
        text: $i18n.t("common.label.cancel"),
        click: function () {
          (<any>$(this)).dialog("close");
        }
      },
      {
        text: $i18n.t("common.label.load"),
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
  }

  configLibraryEditor(options) {
    const libraryEditor = ace.edit('node-select-library-text');
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

    // set instance var
    this.ui.libraryEditor = libraryEditor
  }

  configNodeInputUI(options) {
    const {
      $i18n
    } = this;
    const {
      libraryEditor
    } = this.ui
    const {
      loadAndDisplayLibrariesAvailable,
      } = this.rebind([
        'loadAndDisplayLibrariesAvailable',
      ])

    $('#node-input-name').css("width", "66%").after(
      '<div class="btn-group" style="margin-left: 5px;">' +
      '<a id="node-input-' + options.type + '-lookup" class="editor-button" data-toggle="dropdown"><i class="fa fa-book"></i> <i class="fa fa-caret-down"></i></a>' +
      '<ul class="dropdown-menu pull-right" role="menu">' +
      '<li><a id="node-input-' + options.type + '-menu-open-library" tabindex="-1" href="#">' + $i18n.t("library.openLibrary") + '</a></li>' +
      '<li><a id="node-input-' + options.type + '-menu-save-library" tabindex="-1" href="#">' + $i18n.t("library.saveToLibrary") + '</a></li>' +
      '</ul></div>'
    );
    $('#node-input-' + options.type + '-menu-open-library').click((e) => {
      $("#node-select-library").children().remove();
      var bc = $("#node-dialog-library-breadcrumbs");
      bc.children().first().nextAll().remove();
      libraryEditor.setValue('', -1);

      loadAndDisplayLibrariesAvailable()

      e.preventDefault();
    });

    $('#node-input-' + options.type + '-menu-save-library').click((e) => {
      var name = $("#node-input-name").val().toString().replace(/(^\s*)|(\s*$)/g, "");
      $("#node-dialog-library-save-folder").attr("value", "");

      var filename = name.replace(/[^\w-]/g, "-");
      if (filename === "") {
        filename = "unnamed-" + options.type;
      }
      $("#node-dialog-library-save-filename").attr("value", filename + ".js");

      (<any>$("#node-dialog-library-save")).dialog("open");
      e.preventDefault();
    });
  }


  /**
   *
   */
  loadAndDisplayLibrariesAvailable(options) {
    const {
      displayLibrariesAvailable
    } = this

    $.getJSON("library/" + options.url, displayLibrariesAvailable)
  }


  displayLibrariesAvailable(data) {
    let {
      buildFileList,
      } = this.rebind([
        'buildFileList',
      ], this.ui)

    $("#node-select-library").append(buildFileList("/", data));
    $("#node-dialog-library-breadcrumbs a").click((e) => {
      $(this).parent().nextAll().remove();
      $("#node-select-library").children().first().replaceWith(buildFileList("/", data));
      e.stopPropagation();
    });
    (<any>$("#node-dialog-library-lookup")).dialog("open");
  }

}
