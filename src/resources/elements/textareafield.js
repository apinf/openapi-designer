import {containerless} from 'aurelia-framework';
import {AbstractTextfield} from './abstract/textfield';

@containerless
export class Textareafield extends AbstractTextfield {
  rows = 4;

  init(id = '', args = {}) {
    this.rows = args.rows || 4;
    return super.init(id, args);
  }
}
