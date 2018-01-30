import { LibraryUI } from './';

import {
  log,
  $,
  Context,
  container,
  delegateTarget,
  LibrariesApi,
  delegator
} from './_base'

import { dirname } from 'path';

/**
 * Build File List of libraries from server via API call
 */
@delegateTarget({
  container,
})
@delegator({
  container,
  map: {
    librariesApi: LibrariesApi
  }
})
export class FileListBuilder extends Context {
  protected librariesApi: LibrariesApi

  constructor(public ui: LibraryUI) {
    super()
  }

  /**
   * Build a library file list item in the UI for the library file structure
   * @param item
   */
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

  isDirectory(v) {
    return typeof v === 'string'
  }

  isFile(v) {
    return !this.isDirectory
  }

  /**
   * Build file/directory structure of libraries available on server
   *
   * @param root { string } root folder
   * @param data { Array<Object> } library structure
   */
  buildFileList(root: string, data: any[]) {
    const {
      isDirectory,
      buildFileListItem,
      createDirectoryItemClickHandler,
      createFileItemClickHandler
    } = this.rebind([
        'isDirectory',
        'buildFileListItem',
        'createDirectoryItemClickHandler',
        'createFileItemClickHandler'
      ])

    var ul = document.createElement("ul");
    var li;
    for (var i = 0; i < data.length; i++) {
      var v = data[i];

      // directory
      if (isDirectory(v)) {
        li = buildFileListItem(v);
        li.onclick = createDirectoryItemClickHandler(v, root)

        li.innerHTML = '<i class="fa fa-folder"></i> ' + v + "</i>";
        ul.appendChild(li);
      } else {
        // file
        li = buildFileListItem(v);
        li.innerHTML = v.name;
        li.onclick = createFileItemClickHandler(v, root, ul)
        ul.appendChild(li);
      }
    }
    return ul;
  }

  /**
   * Create click handler to load file item from Api
   * @param v
   * @param root
   * @param ul
   */
  createFileItemClickHandler(v, root, ul) {
    const {
      loadLibraryFileItem
    } = this.rebind([
        'loadLibraryFileItem'
      ])

    return () => {
      var item = v;
      return function (e) {
        $(".list-selected", ul).removeClass("list-selected");
        $(this).addClass("list-selected");

        const url = 'library/' + this.options.url + root + item.fn
        loadLibraryFileItem(item, url)
      }
    }
  }

  set selectedLibraryItem(item) {
    this.ui.selectedLibraryItem = item
  }

  get libraryEditor() {
    return this.ui.libraryEditor
  }

  async loadLibraryFileItem(item, url) {
    const {
      librariesApi,
      rebind
    } = this
    const {
      onLibraryItemLoadSuccess,
      onLibraryItemLoadError,
    } = rebind([
        'onLibraryItemLoadSuccess',
        'onLibraryItemLoadError',
      ])


    try {
      librariesApi.configure({
        url
      })
      const result = await librariesApi.read.one(item)

      onLibraryItemLoadSuccess(result, item)
    } catch (error) {
      onLibraryItemLoadError(error)
    }
  }

  onLibraryItemLoadSuccess(data, item) {
    let {
      selectedLibraryItem,
      libraryEditor
    } = this
    selectedLibraryItem = item;
    libraryEditor.setValue(data, -1);
  }

  // TODO
  onLibraryItemLoadError(error) {
  }

  createDirectoryItemClickHandler(v, root) {
    const {
      loadDirectoryItem
    } = this.rebind([
        'loadDirectoryItem'
      ])

    var dirName = v;
    return function (e) {
      var bcli = $('<li class="active"><span class="divider">/</span> <a href="#">' + dirName + '</a></li>');
      $("a", bcli).click(function (e) {
        $(this).parent().nextAll().remove();

        loadDirectoryItem(this.options, root, dirName)
        e.stopPropagation();
      });
      var bc = $("#node-dialog-library-breadcrumbs");
      $(".active", bc).removeClass("active");
      bc.append(bcli);

      loadDirectoryItem(this.options, root, dirName)
    }
  }

  async loadDirectoryItem(options, root, dirName) {
    const url = 'library/' + options.url + root // + dirName
    const {
      librariesApi,
      rebind
    } = this
    const {
      onDirectoryItemLoadSuccess,
      onDirectoryItemLoadError,
    } = rebind([
        'onDirectoryItemLoadSuccess',
        'onDirectoryItemLoadError',
      ])


    librariesApi.configure({
      url
    })

    try {
      const result = await librariesApi.read.one(dirName)
      onDirectoryItemLoadSuccess(result, root, dirname)
    } catch (error) {
      onDirectoryItemLoadError(error)
    }
  }

  onDirectoryItemLoadSuccess(data, root, dirName) {
    $("#node-select-library").children().first().replaceWith(this.buildFileList(root + dirName + "/", data));
  }

  onDirectoryItemLoadError(error) {

  }
}
