import { Component } from '@stencil/core'

@Component({
  tag: 'red-workspace-toolbar',
  styleUrl: 'styles/workspaceToobar.scss'
})

export class RedWorkspaceFooter {
  // reuse Header.vue template from red-vue
  render() {
    return (
      <div id="workspace-toolbar"></div>
    );
  }
}
