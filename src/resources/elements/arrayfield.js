import {bindable, containerless} from 'aurelia-framework';
import {Parentfield} from './abstract/parentfield';
import {Basefield} from './abstract/basefield';

@containerless
export class Arrayfield extends Parentfield {
  @bindable item
  @bindable collapsed = false;
  @bindable format = 'array';
  @bindable keyField = '_key';
  _children = []

  init(id = '', {label = '', format = 'array', keyField = '_key', item, columns = 8, collapsed = false, parent, index} = {}) {
    this.item = item;
    this.format = format;
    this.keyField = keyField;
    this.collapsed = collapsed;
    return super.init(id, {label, columns, parent, index});
  }

  getValue() {
    let value = undefined;
    if (this.format === 'map') {
      value = {};
      for (const item of this._children) {
        const data = item.getValue();
        const key = data[this.keyField];
        delete data[this.keyField];
        value[key] = data;
      }
    } else if (this.format === 'array') {
      value = [];
      for (const [index, item] of Object.entries(this._children)) {
        value[index] = item.getValue();
      }
    }
    return value;
  }

  setValue(value) {
    this._children = [];
    for (const item of value) {
      const index = this.addChild();
      this._children[index].setValue(item);
    }
  }

  addChild() {
    if (!(this.item instanceof Basefield)) {
      return;
    }

    const field = this.item.clone();
    field.parent = this;
    field.index = this._children.length;
    field.id = `${this.item.id}-${field.index}`;
    field.label = `${field.label} #${(field.index + 1)}`;
    this._children.push(field);
    return field.index;
  }

  deleteChild(index) {
    if (this._children.length === 0) {
      return;
    }

    this._children.splice(index, 1);
    for (let i = index; i < this._children.length; i++) {
      const item = this._children[i];
      item.index = i;
      item.label = `${this.item.label} #${(i + 1)}`;
    }
  }

  clone() {
    const clone = new Arrayfield();
    clone.init(this.id, this);
    if (this.item instanceof Basefield) {
      clone.item = this.item.clone();
    }
    return clone;
  }
}
