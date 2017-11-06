import { Component, Prop } from '@stencil/core';


@Component({
  tag: 'red-checkbox-set',
  styleUrl: 'red-checkbox-set.scss'
})
export class RedCheckboxSet {

  @Prop() first: string;

  @Prop() last: string;

  render() {
    return (
      <div>
        Hello, my name is {this.first} {this.last}
      </div>
    );
  }
}
