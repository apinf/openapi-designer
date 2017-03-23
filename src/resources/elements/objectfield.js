import {containerless} from 'aurelia-framework';
import {Parentfield} from './abstract/parentfield';

@containerless
export class Objectfield extends Parentfield {
  collapsed = false;
  _children = {};

  init(id = '', {label = '', children = {}, columns = 8, collapsed = false, conditions = {}, parent, index} = {}) {
    this._children = children;
    this.collapsed = collapsed;
    return super.init(id, {label, columns, conditions, parent, index});
  }

  getValue() {
    const value = {};
    for (const [key, field] of Object.entries(this._children)) {
      value[key] = field.getValue();
    }
    return value;
  }

  setValue(value) {
    for (const [key, field] of Object.entries(value)) {
      if (this._children.hasOwnProperty(key)) {
        this._children[key].setValue(field);
      }
    }
  }

  addChild(child) {
    this._children[child.id] = child;
  }

  clone() {
    const clone = new Objectfield();
    const clonedChildren = {};
    for (const [key, field] of Object.entries(this._children)) {
      clonedChildren[key] = field.clone();
    }
    clone.init(this.id, {
      _label: this._label,
      _labelFormat: this._labelFormat,
      columns: this.columns,
      collapsed: this.collapsed,
      parent: this.parent,
      index: this.index,
      children: clonedChildren
    });
    return clone;
  }
}
