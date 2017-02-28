import {bindable, containerless} from 'aurelia-framework';
import {Basefield} from '../basefield';

@containerless
export class Textareafield extends Basefield {
  @bindable placeholder;
  @bindable value;
  @bindable rows;

  constructor(id = '', {label = '', placeholder = 'Enter value...', value = '', columns = 8, rows = 4} = {}) {
    super(id, {label, columns});
    this.placeholder = placeholder;
    this.rows = rows;
    this.value = value;
  }

  getValue() {
    return this.value;
  }
}
