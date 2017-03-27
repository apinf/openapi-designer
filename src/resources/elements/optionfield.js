import {containerless} from 'aurelia-framework';
import {Field} from './abstract/field';

@containerless
export class Optionfield extends Field {
  choices = [];

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
    if (this.getValue() === undefined && this.choices.length > 0) {
      this.choices[0].selected = true;
    }
    return super.init(id, args);
  }

  getValue() {
    if (this.format === 'dropdown') {
      for (const choice of this.choices) {
        if (choice.selected) {
          return choice.key;
        }
      }
      return undefined;
    } else if (this.format === 'checkbox') {
      const chosen = [];
      for (const choice of this.choices) {
        if (choice.selected) {
          chosen.push(choice.key);
        }
      }
      return chosen;
    }
  }

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
  getViewStrategy() {
    return `resources/elements/optionfield-${this.format}.html`;
  }
}
