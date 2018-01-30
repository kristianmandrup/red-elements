import {
  Context,
  $,
  callDelegate
} from './_base'

import { LibraryConfiguration } from './configuration';
import { LibrarySaver } from './library-saver';
import { FileListBuilder } from './file-list-builder';

export interface ILibraryUI {
  buildFileList(root: string, data: any[])
  saveToLibrary(overwrite, options): Promise<any>
}

export class LibraryUI extends Context {
  libraryEditor: any;
  selectedLibraryItem: any;

  protected configuration: LibraryConfiguration
  protected librarySaver: LibrarySaver
  protected libraryFileListBuilder: FileListBuilder

  constructor(public options) {
    super();
    this.selectedLibraryItem = options.selectedLibraryItem || {};
    const { RED } = this

    this.configure(options)
  }

  @callDelegate('configuration')
  configure(options: any) {
    // this.configuration.configure(options)
  }

  @callDelegate('libraryFileListBuilder')
  buildFileList(root: string, data: any[]) {
    this.libraryFileListBuilder.buildFileList(root, data)
  }

  /**
   * Save flows to library
   * @param overwrite
   * @param options
   */
  async saveToLibrary(overwrite, options): Promise<any> {
    return await this.librarySaver.saveToLibrary(overwrite, options)
  }
}
