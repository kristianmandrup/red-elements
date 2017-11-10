import { Component } from '@stencil/core'

@Component({
  tag: 'red-router',
})
export class RedRouter {
  // reuse Header.vue template from red-vue
  render() {
    return (
      <stencil-router>
        <stencil-route url="/" component="landing-page" exact={true} />
        <stencil-route url="/tabs" component="tabs-page" />
        <stencil-route url="/palette" component="palette-page" />
      </stencil-router>
    )
  }
}

