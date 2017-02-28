import {bindable, containerless} from 'aurelia-framework';
import {Basefield} from '../basefield';

@containerless
export class Textareafield extends Basefield {
  @bindable id = '';
  @bindable label = '';
  @bindable columns = 8;
  @bindable placeholder = 'Enter value...';
  @bindable value = '';
  @bindable rows = 4;

  init(id = '', {label = '', placeholder = 'Enter value...', value = '', columns = 8, rows = 4, parent, index} = {}) {
    this.placeholder = placeholder;
    this.rows = rows;
    this.value = value;
    return super.init(id, {label, columns, parent, index});
  }

  getValue() {
    return this.value;
  }
}
