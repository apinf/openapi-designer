import {bindable, containerless} from 'aurelia-framework';
import {Basefield} from './abstract/basefield';

@containerless
export class Textfield extends Basefield {
  @bindable id = '';
  @bindable label = '';
  @bindable columns = 8;
  @bindable placeholder = 'Enter value...';
  @bindable value = '';

  init(id = '', {label = '', placeholder = 'Enter value...', value = '', columns = 8, parent, index} = {}) {
    this.placeholder = placeholder;
    this.value = value;
    return super.init(id, {label, columns, parent, index});
  }

  getValue() {
    return this.value;
  }

  setValue(value) {
    this.value = value;
  }
}
