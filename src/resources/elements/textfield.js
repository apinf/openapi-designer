import {bindable, containerless} from 'aurelia-framework';
import {Basefield} from '../basefield';

@containerless
export class Textfield extends Basefield {
  @bindable placeholder;
  @bindable value;

  constructor(id = '', {label = '', placeholder = 'Enter value...', value = '', columns = 8} = {}) {
    super(id, {label, columns});
    this.placeholder = placeholder;
    this.value = value;
  }

  getValue() {
    return this.value;
  }
}
