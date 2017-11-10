import { Component, Prop, Element } from '@stencil/core'

interface Image {
  src?: string;
  title?: string
}

interface Action {
  title?: string
}

@Component({
  tag: 'red-header',
  // styleUrl: '../_shared/header.scss'
})
export class RedHeader {
  constructor() {
    // use Canvas as component controller
    // new controllers.Header()
  }

  // See https://medium.com/@gilfink/getting-to-know-stencil-decorators-350c13ce6d38
  @Element() me: HTMLElement;

  @Prop() url: string;
  @Prop() image: Image;
  @Prop() title: string;
  @Prop() action: Action;

  // reuse Header.vue template from red-vue
  render() {
    return (
      <div id="header">
        <span class="logo">
          <a href={this.url}>
            <img src={this.image.src} title={this.image.title}>
              <span>{this.title}</span>
              <a id="btn-login" class="btn btn-primary">{this.action.title}</a>
            </img>
          </a>
        </span>
        <ul class="header-toolbar hide">
          <li>
            <a id="btn-sidemenu" class="button" data-toggle="dropdown" href="#">
              <i class="fa fa-bars"></i>
            </a>
          </li>
        </ul>
        <div id="header-shade" class="hide"></div>
      </div>);
  }
}
