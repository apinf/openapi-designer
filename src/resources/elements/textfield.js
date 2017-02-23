import {bindable, containerless} from 'aurelia-framework';

@containerless
export class Textfield {
  @bindable id = '';
  @bindable label = '';
  @bindable placeholder = 'Enter value...';
  @bindable value = '';

  attached() {
    this.label = this.id.substr(0, 1).toUpperCase() + this.id.substr(1);
  }
}
