import {
  ILibrary,
  lazyInject,
  $TYPES,
  log,
  Context,
  container,
  delegateTarget,
  delegator,
  LibrariesApi
} from './_base'
import { INodes } from '../../../../../red-runtime/src/nodes/list/interface';
import { ICanvas } from '../../../../../red-runtime/src/interfaces/index';

const TYPES = $TYPES.all

export interface ILibraryFlowExporter {
  exportFlow()
}


@delegateTarget()
export class LibraryFlowExporter extends Context implements ILibraryFlowExporter {
  @lazyInject(TYPES.nodes) $nodes: INodes
  @lazyInject(TYPES.canvas) $view: ICanvas

  constructor(public library: ILibrary) {
    super()
  }

  /**
   * Export flow to a dialog
   */
  exportFlow() {
    const {
      $nodes,
      $view
    } = this
    const {
      exportToLibraryDialog,
    } = this.library

    if (typeof $nodes !== 'object') {
      this.handleError('exportFlow: ctx bad or missing .nodes property', {
        $nodes
      })
    }
    //TODO: don't rely on the main dialog
    var nns = $nodes.createExportableNodeSet($view.selection().nodes);
    $("#node-input-library-filename").attr('nodes', JSON.stringify(nns));

    exportToLibraryDialog.dialog("open");
  }
}
