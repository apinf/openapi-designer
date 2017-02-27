import {bindable} from 'aurelia-framework';

export class Textfield {
  @bindable id;
  @bindable label;
  @bindable placeholder;
  @bindable value;

  constructor(id = '', label = '', placeholder = 'Enter value...', value = '') {
    this.id = id;
    this.label = label;
    this.placeholder = placeholder;
    this.value = value;
  }

  bind() {
    if (this.label.length === 0) {
      this.label = this.id.substr(0, 1).toUpperCase() + this.id.substr(1);
    }
  }

  getValue() {
    return this.value;
  }
}
