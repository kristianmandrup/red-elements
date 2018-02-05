export interface ILibraryUI {
  buildFileList(root: string, data: any[])
  saveToLibrary(overwrite, options): Promise<any>
}
