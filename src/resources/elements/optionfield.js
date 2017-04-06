import {containerless} from 'aurelia-framework';
import {Field} from './abstract/field';

/**
 * Optionfield is a {@link Field} that gives certain options to the user as
 * checkboxes or a dropdown depending on the format.
 */
@containerless
export class Optionfield extends Field {
  /**
   * The choices.
   * @type {Array}
   */
  choices = [];

  /**
   * @inheritdoc
   * @param {String[]|Object[]} args.choices The choices to add.
   */
  init(id = '', args = {}) {
    args = Object.assign({choices: [], format: 'dropdown'}, args);
    this.choices = [];
    for (const choice of args.choices) {
      if (typeof choice === 'string') {
        this.choices.push({
          key: choice,
          label: choice,
          selected: false
        });
      } else {
        this.choices.push({
          key: choice.key,
          label: choice.label || choice.key,
          selected: false
        });
      }
    }
    if (this.choices.length === 0) {
      this.choices.push({
        key: this.key,
        label: '',
        selected: false
      });
      this.checkboxFormat = 'simple';
    }
    if (this.getValue() === undefined && this.choices.length > 0) {
      this.choices[0].selected = true;
    }
    return super.init(id, args);
  }

  /**
   * @inheritdoc
   * @return {String[]|String} The choice or choices of this option field
   *                           depending on the format of this field.
   */
  getValue() {
    if (this.format === 'dropdown') {
      for (const choice of this.choices) {
        if (choice.selected) {
          return choice.key;
        }
      }
      return undefined;
    } else if (this.format === 'checkbox') {
      if (this.checkboxFormat === 'simple') {
        return this.choices[0].selected;
      }
      const chosen = [];
      for (const choice of this.choices) {
        if (choice.selected) {
          chosen.push(choice.key);
        }
      }
      return chosen;
    }
  }

  /**
   * @inheritdoc
   * @param {String|String[]} value The new choice or choices depending on the
   *                                format of this field.
   */
  setValue(value) {
    if (Array.isArray(value) && this.format === 'checkbox') {
      for (const choice of this.choices) {
        if (value.includes(choice.key)) {
          choice.selected = true;
        } else if (choice.selected) {
          choice.selected = false;
        }
      }
    } else {
      for (const choice of this.choices) {
        if (choice.key === value) {
          choice.selected = true;
        } else if (choice.selected) {
          choice.selected = false;
        }
      }
    }
  }

  /**
   * @return {String} The name of the HTML file that displays the choices in the
   *                  format specified by {@link #format}.
   * @private
   */
  getViewStrategy() {
    return `resources/elements/optionfield-${this.format}.html`;
  }
}
