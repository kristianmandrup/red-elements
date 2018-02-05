import {
  Context,
  $,
  delegateTo
} from './_base'

import { LibraryConfiguration } from './configuration';
import { LibrarySaver } from './library-saver';
import { FileListBuilder } from './file-list-builder';

import {
  ILibraryUI
} from './interface'

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

  @delegateTo('configuration')
  configure(options: any) {
    // this.configuration.configure(options)
  }

  @delegateTo('libraryFileListBuilder')
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
