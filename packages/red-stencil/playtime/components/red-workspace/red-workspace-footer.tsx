import { Component } from '@stencil/core'

@Component({
  tag: 'red-workspace-footer',
  // styleUrl: 'red-menu.scss'
})
export class RedWorkspaceFooter {
  // reuse Header.vue template from red-vue
  render() {
    return (
      <div id="workspace-footer">
        <a class="workspace-footer-button" id="btn-zoom-out" href="#"><i class="fa fa-minus"></i></a>
        <a class="workspace-footer-button" id="btn-zoom-zero" href="#"><i class="fa fa-circle-o"></i></a>
        <a class="workspace-footer-button" id="btn-zoom-in" href="#"><i class="fa fa-plus"></i></a>
      </div>
    );
  }
}
