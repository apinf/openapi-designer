import {containerless} from 'aurelia-framework';
import {Field} from './abstract/field';
import {Parentfield} from './abstract/parentfield';

/**
 * Optionfield is a {@link Field} that gives certain options to the user as
 * checkboxes or a dropdown depending on the format.
 */
@containerless
export class Optionfield extends Field {
  /**
   * The static choices.
   * @type {Array}
   */
  choices = [];
  _dataSourceChoices = [];
  /**
   * Sources from where to get dynamic choices.
   * @type {Array}
   */
  dataSources = [];
  /**
   * Whether or not to hide this field if there are no choices.
   * @type {Boolean}
   */
  hideIfNoChoices = true;

  /**
   * @inheritdoc
   * @param {String[]|Object[]} args.choices     The choices to add.
   * @param {Object[]}          args.dataSources Sources from where to get dynamic choices.
   * @param {Boolean}           args.hideIfNoChoices Whether or not to hide this field if there are no choices.
   */
  init(id = '', args = {}) {
    args = Object.assign({
      choices: [],
      dataSources: [],
      format: 'dropdown',
      hideIfNoChoices: true
    }, args);
    this.dataSources = args.dataSources;
    this.hideIfNoChoices = args.hideIfNoChoices;
    this.argChoices = args.choices;
    this.choices = [];
    for (const choice of args.choices) {
      if (typeof choice === 'string') {
        // Parse a simple (label-only) choice definition.
        this.choices.push({
          key: choice,
          label: choice,
          selected: false,
          conditionsFulfilled: true
        });
      } else {
        // Parse a full choice definition.
        const choiceParent = this;
        this.choices.push({
          key: choice.key,
          label: choice.label || choice.key,
          selected: false,
          conditions: choice.conditions,
          // A getter function to check whether all the conditions defined in
          // the schema are fulfilled.
          // The HTML templates can't do this complex logic, so we have to do it
          // here.
          get conditionsFulfilled() {
            return Optionfield.conditionsFulfilled(choice.conditions, choiceParent);
          }
        });
      }
    }
    if (this.choices.length === 0 && Object.getOwnPropertyNames(this.dataSources).length === 0) {
      // We don't want to leave the choices empty, so if there are no choices,
      // make a checkbox with no label.
      this.choices.push({
        key: this.key,
        label: '',
        selected: false,
        conditionsFulfilled: true
      });
      this.checkboxFormat = 'simple';
    }
    // Make sure some choice is selected.
    if (this.getValue() === undefined && this.choices.length > 0) {
      this.choices[0].selected = true;
    }
    return super.init(id, args);
  }

  shouldDisplay() {
    if (!this.hideIfNoChoices) {
      return super.shouldDisplay();
    }
    for (const choice of this.choices) {
      if (choice.conditionsFulfilled) {
        return super.shouldDisplay();
      }
    }
    return false;
  }

  static conditionsFulfilled(conditions, parentField) {
    if (conditions) {
      for (const [fieldPath, expectedValue] of Object.entries(conditions)) {
        const field = parentField.resolveRef(fieldPath);
        const value = field ? field.getValue() : undefined;
        if (Array.isArray(value) && !value.includes(expectedValue)) {
          return false;
        } else if (value !== expectedValue) {
          return false;
        }
      }
    }
    return true;
  }

  updateChoicesFromDataSources() {
    this._dataSourceChoices = [];
    for (const dataSource of this.dataSources) {
      if (typeof dataSource === 'string') {
        const target = this.resolveRef(dataSource);
        if (target instanceof Parentfield) {
          for (const child of target.iterableChildren) {
            this._dataSourceChoices.push({
              key: child.getValue(),
              label: child.getValue(),
              selected: false,
              conditionsFulfilled: true
            });
          }
        } else {
          this._dataSourceChoices.push({
            key: child.getValue(),
            label: child.getValue(),
            selected: false,
            conditionsFulfilled: true
          });
        }
      } else {
        const target = this.resolveRef(dataSource.source);
        if (target instanceof Parentfield) {
          for (const child of target.iterableChildren) {
            const data = {
              key: child.formatReferencePlusField(dataSource.key),
              selected: false,
              get conditionsFulfilled() {
                return Optionfield.conditionsFulfilled(dataSource.localConditions, child)
                    && Optionfield.conditionsFulfilled(dataSource.targetConditions, child);
              }
            };
            if (dataSource.label) {
              data.label = child.formatReferencePlusField(dataSource.label);
            } else {
              data.label = data.key;
            }
            this._dataSourceChoices.push(data);
          }
        } else {
          const data = {
            key: target.formatReferencePlusField(dataSource.key),
            selected: false,
            get conditionsFulfilled() {
              return Optionfield.conditionsFulfilled(dataSource.localConditions, target)
                  && Optionfield.conditionsFulfilled(dataSource.targetConditions, target);
            }
          };
          if (dataSource.label) {
            data.label = target.formatReferencePlusField(dataSource.label);
          } else {
            data.label = data.key;
          }
          this._dataSourceChoices.push(data);
        }
      }
    }
  }

  get allChoices() {
    if (this.dataSources.length === 0) {
      return this.choices;
    } else if (this.choices.length === 0) {
      return this._dataSourceChoices;
    }

    return this._dataSourceChoices.concat(this.choices);
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
   * Call {@link #setValue()} and {@link #onChange()}
   * @param {String|String[]} value The new choice or choices depending on the
   *                                format of this field.
   */
  selectionChanged(value) {
    this.setValue(value);
    this.onChange();
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
