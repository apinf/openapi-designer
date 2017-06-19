import {containerless} from 'aurelia-framework';
import {Field} from './abstract/field';

/**
 * Textfield is a {@link Field} with a basic single-line text input.
 */
@containerless
export class Textfield extends Field {
  /**
   * The text value of the input field.
   * @type {String}
   */
  value = '';
  /**
   * The UI placeholder when the field has no value.
   * @type {String}
   */
  placeholder = 'Enter value...';
  /**
   * Autocompletions that the text input should offer.
   * @type {String[]}
   */
  autocomplete = undefined;

  /**
   * @inheritdoc
   * @param {String} [args.value]        The value of the input field.
   * @param {String} [args.placeholder]  The input placeholder text.
   * @param {String} [args.autocomplete] Autocompletions that the text input
   *                                     should offer.
   */
  init(id = '', args = {}) {
    args = Object.assign({
      placeholder: 'Enter value...',
      value: '',
      autocomplete: undefined
    }, args);
    this.value = args.value;
    this.placeholder = args.placeholder;
    this.autocomplete = args.autocomplete;
    return super.init(id, args);
  }

  get listID() {
    return `autocomplete-${this.id}`;
  }

  /**
   * Check if the text input field is empty.
   */
  isEmpty() {
    return this.value.length === 0;
  }

  /**
   * @inheritdoc
   * @return {String} The text in the input field.
   */
  getValue() {
    return this.value;
  }

  /**
   * @inheritdoc
   * @param {String} value The new text to set to the input field.
   */
  setValue(value) {
    this.value = value;
  }
}
