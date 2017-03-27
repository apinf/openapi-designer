import {containerless} from 'aurelia-framework';
import {AbstractTextfield} from './abstract/textfield';

/**
 * Textareafield is a multi-row text input field.
 */
@containerless
export class Textareafield extends AbstractTextfield {
  /**
   * The number of rows to set to the textarea by default.
   * @type {Number}
   */
  rows = 4;

  /**
   * @inheritdoc
   * @param {Number} [args.rows] The number of rows to set to the textarea by
   *                             default.
   */
  init(id = '', args = {}) {
    this.rows = args.rows || 4;
    return super.init(id, args);
  }
}
