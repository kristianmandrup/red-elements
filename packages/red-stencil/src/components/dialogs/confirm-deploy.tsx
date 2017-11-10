import { Component } from '@stencil/core'
// import { library } from '../_widgets'
// const { controllers } = library

@Component({
  tag: 'confirm-deploy',
  styleUrl: 'styles/confirm-deploy.scss'
})
export class ConfirmDeploy {
  componentDidLoad() {
    // use dialog widget?
    // controllers
  }

  // extracted from mustache template
  render() {
    return (
      <div id="node-dialog-confirm-deploy" class="hide">
        <form class="form-horizontal">
          <div id="node-dialog-confirm-deploy-config" class="node-dialog-confirm-row" data-i18n="[prepend]deploy.confirm.improperlyConfigured;[append]deploy.confirm.confirm">
            <ul id="node-dialog-confirm-deploy-invalid-list"></ul>
          </div>
          <div id="node-dialog-confirm-deploy-unknown" class="node-dialog-confirm-row" data-i18n="[prepend]deploy.confirm.unknown;[append]deploy.confirm.confirm">
            <ul id="node-dialog-confirm-deploy-unknown-list"></ul>
          </div>
          <div id="node-dialog-confirm-deploy-conflict" class="node-dialog-confirm-row">
            <div id="conflict-header" class="conflict-header">
              <span data-i18n="deploy.confirm.conflict"></span>
            </div>
            <div id="node-dialog-confirm-deploy-conflict-checking" class="node-dialog-confirm-conflict-row">
              <img src="red/images/spin.svg" /><div data-i18n="deploy.confirm.conflictChecking"></div>
            </div>
            <div id="node-dialog-confirm-deploy-conflict-auto-merge" class="node-dialog-confirm-conflict-row">
              <i class="fa-label fa fa-check"></i><div data-i18n="deploy.confirm.conflictAutoMerge"></div>
            </div>
            <div id="node-dialog-confirm-deploy-conflict-manual-merge" class="node-dialog-confirm-conflict-row">
              <i class="fa-label fa fa-exclamation"></i><div data-i18n="deploy.confirm.conflictManualMerge"></div>
            </div>
          </div>
        </form>
      </div>
    );
  }
}

