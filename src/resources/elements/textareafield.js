import {containerless} from 'aurelia-framework';
import {AbstractTextfield} from './abstract/textfield';

@containerless
export class Textareafield extends AbstractTextfield {
  rows = 4;

  init(id = '', {label = '', placeholder = 'Enter value...', value = '', columns = 8, rows = 4, conditions = {}, parent, index} = {}) {
    this.rows = rows;
    return super.init(id, {label, placeholder, value, columns, conditions, parent, index});
  }
}
