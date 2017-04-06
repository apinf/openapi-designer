import {bindable} from 'aurelia-framework';
import {Field} from './abstract/field';
import {parseJSON} from '../jsonparser';

export class Typefield extends Field {
  @bindable selectedType = '';
  valueKey = '';
  showType = true;
  copyValue = false;
  child = undefined;
  types = {};

  /** @inheritdoc */
  init(id = '', args = {}) {
    args = Object.assign({
      valueKey: '',
      showType: true,
      copyValue: false,
      types: { 'null': { 'type': 'text' } }
    }, args);
    this.types = args.types;
    this.valueKey = args.valueKey;
    this.showType = args.showType;
    this.copyValue = args.copyValue;
    this.selectedType = args.defaultType || Object.keys(this.types)[0];
    this.selectedTypeChanged(this.selectedType);
    return super.init(id, args);
  }

  selectedTypeChanged(newType) {
    const newSchema = this.types[newType];
    const value = this.copyValue ? this.getValue() : undefined;
    let newChild;
    if (newSchema.hasOwnProperty('$ref')) {
      newChild = this.resolveRef(newSchema.$ref).clone();
    } else {
      newChild = parseJSON(newType, newSchema);
    }
    if (newChild) {
      newChild.parent = this;
      if (value) {
        this.setValue(value);
      }
      this.child = newChild;
    }
  }

  getValue() {
    if (!this.child) {
      return undefined;
    }

    let value = this.child.getValue();
    if (!this.showType) {
      return value;
    }
    if (this.valueKey || typeof value !== 'object' || Array.isArray(value)) {
      const valueKey = this.valueKey || 'value';
      value = {
        type: this.selectedType,
        [valueKey]: value
      };
    } else {
      value.type = this.selectedType;
    }
    return value;
  }

  setValue(value) {
    if (typeof value === 'object' && !Array.isArray(value)) {
      delete value.type;
      this.child.setValue(value);
    } else {
      this.child.setValue(value[this.valueKey]);
    }
  }

  setType(type) {
    this.selectedType = type;
  }

  getType() {
    return this.selectedType;
  }

  get possibleTypes() {
    return Object.keys(this.types);
  }
}
