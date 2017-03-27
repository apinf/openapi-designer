import {Field} from './field';

/**
 * AbstractTextfield is a {@link Field} that has some sort of a text input as
 * the primary value.
 */
export class AbstractTextfield extends Field {
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
   * @inheritdoc
   * @param {String} [args.value]       The value of the input field.
   * @param {String} [args.placeholder] The input placeholder text.
   */
  init(id = '', args = {}) {
    args = Object.assign({placeholder: 'Enter value...', value: ''}, args);
    this.value = args.value;
    this.placeholder = args.placeholder;
    return super.init(id, args);
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
