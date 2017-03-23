import {Field} from './field';

/**
 * AbstractTextfield is a {@link Field} that has some sort of a text input as
 * the primary value.
 */
export class AbstractTextfield extends Field {
  value = '';
  placeholder = 'Enter value...';

  init(id = '', {label = '', placeholder = 'Enter value...', value = '', columns = 8, parent, index} = {}) {
    this.value = value;
    this.placeholder = placeholder;
    return super.init(id, {label, columns, parent, index});
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
