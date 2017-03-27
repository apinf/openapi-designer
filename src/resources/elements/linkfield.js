import {noView} from 'aurelia-framework';
import {Field} from './abstract/field';

@noView
export class Linkfield extends Field {
  target = '#';

  init(id = '', args = {}) {
    this.target = args.target || '#';
    return super.init(id, args);
  }

  resolveTarget() {
    const field = this.resolveRef(this.target);
    if (!field || field === this) {
      return undefined;
    }
    return field;
  }

  setValue(value) {
    const field = this.resolveTarget();
    if (field) {
      field.setValue(value);
    }
  }

  getValue() {
    const field = this.resolveTarget();
    return field ? field.getValue() : undefined;
  }
}
