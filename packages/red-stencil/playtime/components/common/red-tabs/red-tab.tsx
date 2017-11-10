import { Component, Prop } from '@stencil/core'

@Component({
  tag: 'red-tab',
  // styleUrl: 'red-tabs.scss'
})
export class RedTab {
  // TODO: move to appropriate component lifecycle method!!!

  componentDidLoad() {
    // registers Tabs as a jQuery widget on $
  }

  @Prop() caption: string

  render() {
    return (
      <li class="red-ui-tab">{this.caption}</li>
    )
  }
}
