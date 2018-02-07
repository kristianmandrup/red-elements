export interface IActionKeyMap {
  scope?: object,
  key?: string,
  user?: object
}

export interface I18nElem extends JQuery<HTMLElement> {
  i18n: Function
}

export interface ISearchBox extends JQuery<HTMLElement> {
  searchBox: Function
}

export interface IEditableList extends JQuery<HTMLElement> {
  editableList: Function
}
